import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

interface ConversationListProps {
  conversations: any[];
  isLoading: boolean;
  selectedUserId: number | null;
  onSelectConversation: (userId: number) => void;
}

export default function ConversationList({ 
  conversations, 
  isLoading, 
  selectedUserId,
  onSelectConversation 
}: ConversationListProps) {
  
  if (isLoading) {
    return (
      <div className="py-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="mt-2 text-sm text-gray-500">Loading conversations...</p>
      </div>
    );
  }
  
  if (conversations.length === 0) {
    return (
      <div className="py-12 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
        <h3 className="text-gray-700 font-medium">No messages yet</h3>
        <p className="text-gray-500 text-sm mt-1">
          Your conversations will appear here
        </p>
      </div>
    );
  }
  
  return (
    <div className="divide-y divide-gray-200">
      {conversations.map((conversation) => (
        <div 
          key={conversation.partner.id}
          className={`p-4 hover:bg-gray-50 cursor-pointer ${
            selectedUserId === conversation.partner.id ? 'bg-blue-50' : ''
          }`}
          onClick={() => onSelectConversation(conversation.partner.id)}
        >
          <div className="flex items-center">
            <div className="relative">
              <Avatar className="h-12 w-12">
                <AvatarImage src={conversation.partner.profileImage} alt={conversation.partner.firstName} />
                <AvatarFallback>
                  {conversation.partner.firstName?.[0]}
                  {conversation.partner.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              {conversation.unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-accent text-white">
                  {conversation.unreadCount}
                </Badge>
              )}
            </div>
            <div className="ml-4 flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <h4 className="font-medium truncate">
                  {conversation.partner.firstName} {conversation.partner.lastName}
                </h4>
                <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                  {formatDistanceToNow(new Date(conversation.lastMessage.createdAt), { addSuffix: true })}
                </span>
              </div>
              <p className={`text-sm truncate ${conversation.unreadCount > 0 ? 'font-medium' : 'text-gray-500'}`}>
                {conversation.lastMessage.senderId === conversation.partner.id 
                  ? conversation.lastMessage.content 
                  : `You: ${conversation.lastMessage.content}`}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
