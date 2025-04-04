import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import ConversationList from "@/components/messages/ConversationList";
import MessageThread from "@/components/messages/MessageThread";
import { FaSearch } from "react-icons/fa";
import { useAuth } from "@/lib/authContext";

export default function Messages() {
  const { user } = useAuth();
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Fetch all conversations
  const { data: conversationsData, isLoading: isConversationsLoading } = useQuery({
    queryKey: ['/api/messages'],
    staleTime: 30000,
  });
  
  const conversations = conversationsData?.conversations || [];
  
  // Filter conversations by search term
  const filteredConversations = conversations.filter((conversation: any) => {
    const partnerName = `${conversation.partner.firstName} ${conversation.partner.lastName}`.toLowerCase();
    return partnerName.includes(searchTerm.toLowerCase());
  });
  
  // Get total number of unread messages
  const unreadCount = conversations.reduce((sum: number, conversation: any) => {
    return sum + (conversation.unreadCount || 0);
  }, 0);
  
  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-600">
            Communicate with players, scouts, and academies
            {unreadCount > 0 && (
              <Badge className="ml-2 bg-accent text-white">{unreadCount} unread</Badge>
            )}
          </p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-card overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 h-[calc(100vh-220px)] min-h-[500px]">
          {/* Conversations List */}
          <div className="md:col-span-1 border-r border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <Input
                  type="text"
                  placeholder="Search conversations..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="overflow-y-auto h-[calc(100%-65px)]">
              <ConversationList 
                conversations={filteredConversations} 
                isLoading={isConversationsLoading}
                selectedUserId={selectedUserId}
                onSelectConversation={setSelectedUserId}
              />
            </div>
          </div>
          
          {/* Message Thread */}
          <div className="md:col-span-2 flex flex-col h-full">
            {selectedUserId ? (
              <MessageThread 
                userId={selectedUserId} 
                currentUserId={user?.id}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-6">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Your Messages</h3>
                <p className="text-gray-500 max-w-md mb-6">
                  Select a conversation from the list to view messages or start a new conversation.
                </p>
                <Button disabled className="opacity-50">
                  New Message
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
