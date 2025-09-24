import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Users, Clock, CheckCircle, DollarSign, FileText, MessageCircle, Bell } from 'lucide-react';
import { consultationApi, caseApi, messageApi } from '@/services/api';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { CaseRequestManager } from '@/components/CaseRequests/CaseRequestManager';
import { MessagingSystem } from '@/components/Messaging/MessagingSystem';

const LawyerDashboard = () => {
  const { user } = useAuth();
  const [consultations, setConsultations] = useState<any[]>([]);
  const [cases, setCases] = useState<any[]>([]);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'cases' | 'requests' | 'messages'>('overview');
  const [preselectedCaseId, setPreselectedCaseId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);
        if (user?.userId) {
          const [consultationsData, casesData, unreadCount] = await Promise.all([
            consultationApi.getByLawyer(user.userId),
            caseApi.getByLawyer(user.userId),
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
    { title: 'Active Cases', value: cases.filter((c: any) => c.status === 'ACTIVE').length, icon: FileText, color: 'text-blue-600' },
    { title: 'Total Cases', value: cases.length, icon: CheckCircle, color: 'text-green-600' },
    { title: 'Unread Messages', value: unreadMessages, icon: MessageCircle, color: 'text-purple-600' },
    { title: 'Consultations', value: consultations.length, icon: Calendar, color: 'text-orange-600' },
  ];

  const handleStatusUpdate = async (consultationId: string, status: string) => {
    try {
      await consultationApi.updateStatus(consultationId, status);
      const data = await consultationApi.getByLawyer(user!.userId);
      setConsultations(data);
    } catch (error: any) {
      console.error('Failed to update status:', error);
      toast.error('Failed to update consultation status');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, Atty. {user?.name}!</h1>
        <p className="text-gray-600">Manage your cases, clients, and consultations.</p>
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
          variant={activeTab === 'requests' ? 'default' : 'outline'}
          onClick={() => setActiveTab('requests')}
        >
          <Bell className="w-4 h-4 mr-2" />
          Case Requests
        </Button>
        <Button
          variant={activeTab === 'messages' ? 'default' : 'outline'}
          onClick={() => setActiveTab('messages')}
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          Messages {unreadMessages > 0 && `(${unreadMessages})`}
        </Button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <Card key={stat.title}>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <stat.icon className={cn('h-8 w-8', stat.color)} />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Cases</CardTitle>
              <CardDescription>Your latest legal cases</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : cases.length > 0 ? (
                <div className="space-y-4">
                  {cases.slice(0, 5).map((caseItem: any) => (
                    <div key={caseItem.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{caseItem.title}</p>
                        <p className="text-sm text-gray-600">Client: {caseItem.clientName}</p>
                        <p className="text-sm text-gray-600">Type: {caseItem.type.replace('_', ' ')}</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span
                          className={cn(
                            'px-2 py-1 rounded-full text-xs font-medium',
                            caseItem.status === 'ACTIVE' && 'bg-green-100 text-green-800',
                            caseItem.status === 'PENDING' && 'bg-yellow-100 text-yellow-800',
                            caseItem.status === 'COMPLETED' && 'bg-blue-100 text-blue-800',
                            caseItem.status === 'CLOSED' && 'bg-gray-100 text-gray-800'
                          )}
                        >
                          {caseItem.status}
                        </span>
                        <Button size="sm" variant="outline">View Details</Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-600">No cases yet</p>
                  <p className="text-gray-500 text-sm">Your cases will appear here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {/* Cases Tab */}
      {activeTab === 'cases' && (
        <Card>
          <CardHeader>
            <CardTitle>My Cases</CardTitle>
            <CardDescription>All your legal cases</CardDescription>
          </CardHeader>
          <CardContent>
            {cases.length > 0 ? (
              <div className="space-y-4">
                {cases.map((caseItem: any) => (
                  <div key={caseItem.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{caseItem.title}</h3>
                        <p className="text-gray-600 mt-1">{caseItem.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          <span>Client: {caseItem.clientName}</span>
                          <span>Type: {caseItem.type.replace('_', ' ')}</span>
                          <span>Rate: ${caseItem.hourlyRate}/hour</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span
                          className={cn(
                            'px-2 py-1 rounded-full text-xs font-medium',
                            caseItem.status === 'ACTIVE' && 'bg-green-100 text-green-800',
                            caseItem.status === 'PENDING' && 'bg-yellow-100 text-yellow-800',
                            caseItem.status === 'COMPLETED' && 'bg-blue-100 text-blue-800',
                            caseItem.status === 'CLOSED' && 'bg-gray-100 text-gray-800'
                          )}
                        >
                          {caseItem.status}
                        </span>
                        <Button size="sm" variant="outline">View Details</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-600">No cases yet</p>
                <p className="text-gray-500 text-sm">Your cases will appear here</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Case Requests Tab */}
      {activeTab === 'requests' && (
        <CaseRequestManager onAccepted={(caseId) => {
          setPreselectedCaseId(caseId);
          setActiveTab('messages');
        }} />
      )}

      {/* Messages Tab */}
      {activeTab === 'messages' && (
        <Card>
          <CardHeader>
            <CardTitle>Messages</CardTitle>
            <CardDescription>Communicate with your clients</CardDescription>
          </CardHeader>
          <CardContent>
            <MessagingSystem caseId={preselectedCaseId ?? undefined} />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LawyerDashboard;


