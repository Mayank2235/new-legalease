import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { caseRequestApi } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

type CaseRequest = {
  id: string;
  clientId: string;
  lawyerId: string;
  title: string;
  description: string;
  type: string;
  status: string;
  clientName: string;
  lawyerName: string;
  createdAt: string;
  updatedAt: string;
};

export const ClientRequests: React.FC = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<CaseRequest[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.userId) {
      load();
    }
  }, [user]);

  const load = async () => {
    if (!user?.userId) return;
    try {
      setLoading(true);
      const data = await caseRequestApi.getByClient(user.userId);
      setRequests(data);
    } catch {
      toast.error('Failed to load your requests');
    } finally {
      setLoading(false);
    }
  };

  const cancel = async (id: string) => {
    try {
      await caseRequestApi.cancel(id);
      toast.success('Request cancelled');
      load();
    } catch {
      toast.error('Failed to cancel request');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="secondary">Pending</Badge>;
      case 'ACCEPTED':
        return <Badge className="bg-green-500">Accepted</Badge>;
      case 'REJECTED':
        return <Badge variant="destructive">Rejected</Badge>;
      case 'CANCELLED':
        return <Badge variant="outline">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading requests...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {requests.length === 0 ? (
        <div className="text-gray-600">You have no requests.</div>
      ) : (
        requests.map((r) => (
          <Card key={r.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{r.title}</CardTitle>
                  <div className="text-sm text-gray-600">To: {r.lawyerName}</div>
                </div>
                <div className="flex items-center gap-2">{getStatusBadge(r.status)}</div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-700 mb-3">{r.description}</div>
              {r.status === 'PENDING' && (
                <Button variant="outline" onClick={() => cancel(r.id)}>
                  Cancel Request
                </Button>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default ClientRequests;


