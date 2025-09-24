import React, { useState, useEffect, useRef } from 'react';
import { Send, MessageCircle, Users, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { messageApi, caseApi } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  caseId?: string;
  content: string;
  isRead: boolean;
  senderName: string;
  receiverName: string;
  createdAt: string;
}

interface Case {
  id: string;
  clientId: string;
  lawyerId: string;
  title: string;
  description: string;
  status: string;
  type: string;
  clientName: string;
  lawyerName: string;
}

interface MessagingSystemProps {
  caseId?: string;
  otherUserId?: string;
}

export const MessagingSystem: React.FC<MessagingSystemProps> = ({ 
  caseId, 
  otherUserId 
}) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [cases, setCases] = useState<Case[]>([]);
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user?.userId) {
      loadUserCases();
    }
  }, [user]);

  useEffect(() => {
    if (selectedCase && user?.userId) {
      loadMessages();
    }
  }, [selectedCase, user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadUserCases = async () => {
    if (!user?.userId) return;

    try {
      setLoading(true);
      const data = user.role === 'CLIENT' 
        ? await caseApi.getByClient(user.userId)
        : await caseApi.getByLawyer(user.userId);
      setCases(data);
      
      // If a specific case is provided, select it
      if (caseId) {
        const caseData = data.find((c: Case) => c.id === caseId);
        if (caseData) {
          setSelectedCase(caseData);
        } else if (data.length > 0) {
          setSelectedCase(data[0]);
        }
      } else if (data.length > 0) {
        setSelectedCase(data[0]);
      }
    } catch (error) {
      toast.error('Failed to load cases');
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async () => {
    if (!selectedCase || !user?.userId) return;

    try {
      const data = await messageApi.getByCase(selectedCase.id);
      setMessages(data);
      
      // Mark messages as read
      const unreadMessages = data.filter((msg: Message) => 
        !msg.isRead && msg.receiverId === user.userId
      );
      
      if (unreadMessages.length > 0) {
        await messageApi.markAllAsRead(user.userId);
      }
    } catch (error) {
      toast.error('Failed to load messages');
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedCase || !user?.userId) return;

    const receiverId = user.role === 'CLIENT' 
      ? selectedCase.lawyerId 
      : selectedCase.clientId;

    try {
      setSending(true);
      const message = await messageApi.send(
        user.userId,
        receiverId,
        newMessage.trim(),
        selectedCase.id
      );
      
      setMessages([...messages, message]);
      setNewMessage('');
    } catch (error) {
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading messages...</p>
      </div>
    );
  }

  if (cases.length === 0) {
    return (
      <div className="text-center py-8">
        <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">No cases available for messaging.</p>
      </div>
    );
  }

  return (
    <div className="flex h-[600px] border rounded-lg overflow-hidden">
      {/* Cases Sidebar */}
      <div className="w-1/3 border-r bg-gray-50">
        <div className="p-4 border-b">
          <h3 className="font-semibold">Your Cases</h3>
        </div>
        <div className="overflow-y-auto">
          {cases.map((caseItem) => (
            <div
              key={caseItem.id}
              onClick={() => setSelectedCase(caseItem)}
              className={`p-4 border-b cursor-pointer hover:bg-gray-100 ${
                selectedCase?.id === caseItem.id ? 'bg-blue-50 border-blue-200' : ''
              }`}
            >
              <div className="font-medium text-sm">{caseItem.title}</div>
              <div className="text-xs text-gray-600 mt-1">
                {user?.role === 'CLIENT' ? caseItem.lawyerName : caseItem.clientName}
              </div>
              <Badge variant="outline" className="text-xs mt-1">
                {caseItem.status}
              </Badge>
            </div>
          ))}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 flex flex-col">
        {selectedCase ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{selectedCase.title}</h3>
                  <p className="text-sm text-gray-600">
                    {user?.role === 'CLIENT' ? selectedCase.lawyerName : selectedCase.clientName}
                  </p>
                </div>
                <Badge variant="outline">{selectedCase.type.replace('_', ' ')}</Badge>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.senderId === user?.userId ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.senderId === user?.userId
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-900'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p
                      className={`text-xs mt-1 ${
                        message.senderId === user?.userId
                          ? 'text-blue-100'
                          : 'text-gray-500'
                      }`}
                    >
                      {formatTime(message.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t bg-white">
              <div className="flex gap-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  disabled={sending}
                />
                <Button
                  onClick={sendMessage}
                  disabled={!newMessage.trim() || sending}
                  size="sm"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Select a case to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
