import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Users, Clock, CheckCircle, MessageCircle, FileText, Search } from 'lucide-react';
import { consultationApi, caseApi, messageApi } from '@/services/api';
import { cn } from '@/lib/utils';
import { LawyerSearch } from '@/components/LawyerSearch/LawyerSearch';
import { ClientRequests } from '@/components/ClientRequests/ClientRequests';
import { MessagingSystem } from '@/components/Messaging/MessagingSystem';

const ClientDashboard = () => {
  const { user } = useAuth();
  const [consultations, setConsultations] = useState<any[]>([]);
  const [cases, setCases] = useState<any[]>([]);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'cases' | 'messages' | 'find-lawyer' | 'requests'>('overview');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);
        if (user?.userId) {
          const [consultationsData, casesData, unreadCount] = await Promise.all([
            consultationApi.getByClient(user.userId),
            caseApi.getByClient(user.userId),
            messageApi.getUnreadCount(user.userId)
          ]);
          setConsultations(consultationsData);
          setCases(casesData);
          setUnreadMessages(unreadCount);
        } else {
          setConsultations([]);
          setCases([]);
          setUnreadMessages(0);
        }
      } catch (error: any) {
        console.error('Failed to fetch data:', error);
        // Keep UI clean: do not render page-level error banner
        setError(error?.response?.data?.message || error.message || 'Failed to fetch data');
        setConsultations([]);
        setCases([]);
        setUnreadMessages(0);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const stats = [
    {
      title: 'Total Cases',
      value: cases.length,
      icon: FileText,
      color: 'text-blue-600',
    },
    {
      title: 'Active Cases',
      value: cases.filter((c: any) => c.status === 'ACTIVE').length,
      icon: CheckCircle,
      color: 'text-green-600',
    },
    {
      title: 'Unread Messages',
      value: unreadMessages,
      icon: MessageCircle,
      color: 'text-purple-600',
    },
    {
      title: 'Consultations',
      value: consultations.length,
      icon: Calendar,
      color: 'text-orange-600',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
        <p className="text-gray-600">Manage your legal cases and connect with lawyers.</p>
        {/* Intentionally hiding page-level error banner to remove red strip */}
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1">
        <Button
          variant={activeTab === 'overview' ? 'default' : 'outline'}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </Button>
        <Button
          variant={activeTab === 'cases' ? 'default' : 'outline'}
          onClick={() => setActiveTab('cases')}
        >
          <FileText className="w-4 h-4 mr-2" />
          My Cases
        </Button>
        <Button
          variant={activeTab === 'messages' ? 'default' : 'outline'}
          onClick={() => setActiveTab('messages')}
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          Messages {unreadMessages > 0 && `(${unreadMessages})`}
        </Button>
        <Button
          variant={activeTab === 'requests' ? 'default' : 'outline'}
          onClick={() => setActiveTab('requests')}
        >
          <Users className="w-4 h-4 mr-2" />
          My Requests
        </Button>
        <Button
          variant={activeTab === 'find-lawyer' ? 'default' : 'outline'}
          onClick={() => setActiveTab('find-lawyer')}
        >
          <Search className="w-4 h-4 mr-2" />
          Find Lawyer
        </Button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <stat.icon className={cn('w-5 h-5 mr-2', stat.color)} />
                  <div>
                    <div className="text-sm text-gray-500">{stat.title}</div>
                    <div className="text-2xl font-bold">{stat.value}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Cases Tab */}
      {activeTab === 'cases' && (
        <div className="space-y-4">
          {cases.length === 0 ? (
            <div className="text-gray-600">No cases yet</div>
          ) : (
            cases.map((c: any) => (
              <Card key={c.id}>
                <CardHeader>
                  <CardTitle>{c.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-gray-600">{c.description}</div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Messages Tab */}
      {activeTab === 'messages' && <MessagingSystem />}

      {/* Requests Tab */}
      {activeTab === 'requests' && <ClientRequests />}

      {/* Find Lawyer Tab */}
      {activeTab === 'find-lawyer' && <LawyerSearch />}
    </div>
  );
};

export default ClientDashboard;


