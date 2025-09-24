import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from 'lucide-react';
import { consultationApi } from '@/services/api';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const ConsultationsPage = () => {
  const { user } = useAuth();
  const [consultations, setConsultations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConsultations = async () => {
      try {
        if (!user?.userId) return;
        const data = user.role === 'CLIENT'
          ? await consultationApi.getByClient(user.userId)
          : await consultationApi.getByLawyer(user.userId);
        setConsultations(data);
      } finally {
        setLoading(false);
      }
    };
    fetchConsultations();
  }, [user]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED': return 'bg-blue-100 text-blue-800';
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filterConsultations = (status: string) => {
    if (status === 'all') return consultations;
    return consultations.filter((c: any) => c.status === status.toUpperCase());
  };

  const ConsultationCard = ({ consultation }: { consultation: any }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">
              {user?.role === 'CLIENT' ? (
                <>Atty. {consultation.lawyer?.name || 'Unknown Lawyer'}</>
              ) : (
                <>{consultation.client?.name || 'Unknown Client'}</>
              )}
            </CardTitle>
            <CardDescription>
              {user?.role === 'CLIENT' ? consultation.lawyer?.email : consultation.client?.email}
            </CardDescription>
          </div>
          <Badge className={cn('text-xs', getStatusColor(consultation.status))}>{consultation.status}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            {format(new Date(consultation.scheduledAt), 'PPP p')}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Consultations</h1>
        <p className="text-gray-600">
          {user?.role === 'CLIENT' ? 'Track your legal consultations and appointments' : 'Manage your client consultations and schedule'}
        </p>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:grid-cols-5">
          <TabsTrigger value="all">All ({consultations.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({filterConsultations('pending').length})</TabsTrigger>
          <TabsTrigger value="confirmed">Confirmed ({filterConsultations('confirmed').length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({filterConsultations('completed').length})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected ({filterConsultations('rejected').length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {consultations.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {consultations.map((consultation: any) => (
                <ConsultationCard key={consultation.id} consultation={consultation} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-600 text-lg mb-2">No consultations found</p>
              <p className="text-gray-500">Your consultations will appear here</p>
            </div>
          )}
        </TabsContent>

        {['pending', 'confirmed', 'completed', 'rejected'].map((status) => (
          <TabsContent key={status} value={status} className="space-y-4">
            {filterConsultations(status).length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filterConsultations(status).map((consultation: any) => (
                  <ConsultationCard key={consultation.id} consultation={consultation} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-600 text-lg mb-2">No {status} consultations</p>
                <p className="text-gray-500">Your {status} consultations will appear here</p>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default ConsultationsPage;


