import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { formatDistanceToNow } from "date-fns";
import { FaPaperPlane } from "react-icons/fa";

interface MessageThreadProps {
  userId: number;
  currentUserId?: number;
}

export default function MessageThread({ userId, currentUserId }: MessageThreadProps) {
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch messages between users
  const { data: messagesData, isLoading: isMessagesLoading } = useQuery({
    queryKey: [`/api/messages/${userId}`],
    refetchInterval: 10000, // Refetch every 10 seconds
    staleTime: 5000,
  });
  
  // Fetch user details
  const { data: userData, isLoading: isUserLoading } = useQuery({
    queryKey: [`/api/users/${userId}`],
  });
  
  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      const res = await apiRequest('POST', '/api/messages', {
        receiverId: userId,
        content
      });
      return res.json();
    },
    onSuccess: () => {
      setMessage("");
      queryClient.invalidateQueries({ queryKey: [`/api/messages/${userId}`] });
      queryClient.invalidateQueries({ queryKey: ['/api/messages'] });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to send message",
        description: error.message || "There was an error sending your message",
        variant: "destructive",
      });
    },
  });
  
  const messages = messagesData?.messages || [];
  const partner = userData?.user;
  
  const isLoading = isMessagesLoading || isUserLoading;
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (!isLoading && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);
  
  const handleSendMessage = () => {
    if (!message.trim()) return;
    sendMessageMutation.mutate(message);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading messages...</p>
        </div>
      </div>
    );
  }
  
  if (!partner) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">User not found</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center">
        <Avatar className="h-10 w-10 mr-3">
          <AvatarImage src={partner.profileImage} alt={`${partner.firstName} ${partner.lastName}`} />
          <AvatarFallback>{partner.firstName?.[0]}{partner.lastName?.[0]}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-medium">{partner.firstName} {partner.lastName}</h3>
          <p className="text-xs text-gray-500">{partner.role}</p>
        </div>
      </div>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <h3 className="text-gray-700 font-medium">No messages yet</h3>
              <p className="text-gray-500 text-sm mt-1">
                Send a message to start the conversation
              </p>
            </div>
          </div>
        ) : (
          messages.map((msg: any) => (
            <div
              key={msg.id}
              className={`flex ${msg.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[70%] ${msg.senderId === currentUserId ? 'order-2' : 'order-1'}`}>
                {msg.senderId !== currentUserId && (
                  <Avatar className="h-8 w-8 mb-1">
                    <AvatarImage src={partner.profileImage} alt={`${partner.firstName} ${partner.lastName}`} />
                    <AvatarFallback>{partner.firstName?.[0]}{partner.lastName?.[0]}</AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`rounded-lg p-3 ${
                    msg.senderId === currentUserId
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex space-x-2">
          <Input
            className="flex-1"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Button 
            onClick={handleSendMessage}
            disabled={message.trim() === "" || sendMessageMutation.isPending}
          >
            <FaPaperPlane className="mr-2" />
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}
