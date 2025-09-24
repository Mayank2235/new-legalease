import React, { useState, useEffect } from 'react';
import { Clock, User, FileText, DollarSign, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { caseRequestApi } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface CaseRequestDto {
  id: string;
  clientId: string;
  lawyerId: string;
  caseId?: string;
  title: string;
  description: string;
  type: string;
  status: string;
  clientName: string;
  lawyerName: string;
  createdAt: string;
  updatedAt: string;
}

type Props = { onAccepted?: (caseId: string) => void };

export const CaseRequestManager: React.FC<Props> = ({ onAccepted }) => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<CaseRequestDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<CaseRequestDto | null>(null);
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [hourlyRate, setHourlyRate] = useState('');

  useEffect(() => {
    if (user?.userId) {
      loadPendingRequests();
    }
  }, [user]);

  const loadPendingRequests = async () => {
    if (!user?.userId) return;
    
    try {
      setLoading(true);
      const data = await caseRequestApi.getPendingByLawyer(user.userId);
      setRequests(data);
    } catch (error) {
      toast.error('Failed to load case requests');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async () => {
    if (!selectedRequest || !hourlyRate) return;

    try {
      const res = await caseRequestApi.accept(selectedRequest.id, parseFloat(hourlyRate));
      toast.success('Case request accepted! A new case has been created.');
      if (res?.caseId && onAccepted) {
        onAccepted(res.caseId);
      }
      setShowAcceptModal(false);
      setSelectedRequest(null);
      setHourlyRate('');
      loadPendingRequests();
    } catch (error) {
      toast.error('Failed to accept case request');
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      await caseRequestApi.reject(requestId);
      toast.success('Case request rejected');
      loadPendingRequests();
    } catch (error) {
      toast.error('Failed to reject case request');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="secondary">Pending</Badge>;
      case 'ACCEPTED':
        return <Badge variant="default" className="bg-green-500">Accepted</Badge>;
      case 'REJECTED':
        return <Badge variant="destructive">Rejected</Badge>;
      case 'CANCELLED':
        return <Badge variant="outline">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Case Requests</h1>
        <p className="text-gray-600">
          Review and respond to case requests from clients.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading requests...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {requests.map((request) => (
            <Card key={request.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{request.title}</CardTitle>
                    <p className="text-sm text-gray-600">From: {request.clientName}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(request.status)}
                    <span className="text-xs text-gray-500">
                      {formatDate(request.createdAt)}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium">Type: {request.type.replace('_', ' ')}</span>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-700">{request.description}</p>
                  </div>
                  
                  {request.status === 'PENDING' && (
                    <div className="flex gap-2 pt-4">
                      <Button
                        onClick={() => {
                          setSelectedRequest(request);
                          setShowAcceptModal(true);
                        }}
                        className="flex items-center gap-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Accept
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleReject(request.id)}
                        className="flex items-center gap-2"
                      >
                        <XCircle className="w-4 h-4" />
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {requests.length === 0 && !loading && (
        <div className="text-center py-8">
          <p className="text-gray-600">No pending case requests.</p>
        </div>
      )}

      {/* Accept Request Modal */}
      {showAcceptModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Accept Case Request</CardTitle>
              <p className="text-sm text-gray-600">
                Set your hourly rate for this case
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Hourly Rate ($)</label>
                <Input
                  type="number"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(e.target.value)}
                  placeholder="Enter your hourly rate"
                  min="0"
                  step="0.01"
                />
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button
                  onClick={handleAccept}
                  disabled={!hourlyRate || parseFloat(hourlyRate) <= 0}
                  className="flex-1"
                >
                  Accept & Create Case
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowAcceptModal(false);
                    setSelectedRequest(null);
                    setHourlyRate('');
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
