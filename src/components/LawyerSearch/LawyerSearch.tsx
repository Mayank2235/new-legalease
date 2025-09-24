import React, { useState, useEffect } from 'react';
import { Search, MapPin, Clock, DollarSign, CheckCircle, Star } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { lawyerApi, caseRequestApi } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface Lawyer {
  id: string;
  name: string;
  email: string;
  specialization: string;
  experience: string;
  verified: boolean;
  hourlyRate: number;
}

interface CaseRequestForm {
  title: string;
  description: string;
  type: string;
}

const CASE_TYPES = [
  'CRIMINAL', 'CIVIL', 'FAMILY', 'CORPORATE', 'REAL_ESTATE',
  'PERSONAL_INJURY', 'EMPLOYMENT', 'IMMIGRATION', 'TAX',
  'INTELLECTUAL_PROPERTY', 'OTHER'
];

export const LawyerSearch: React.FC = () => {
  const { user } = useAuth();
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedLawyer, setSelectedLawyer] = useState<Lawyer | null>(null);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requestForm, setRequestForm] = useState<CaseRequestForm>({
    title: '',
    description: '',
    type: 'CIVIL'
  });

  useEffect(() => {
    loadLawyers();
  }, []);

  const loadLawyers = async () => {
    try {
      setLoading(true);
      const data = await lawyerApi.search(searchQuery);
      setLawyers(data);
    } catch (error) {
      toast.error('Failed to load lawyers');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    loadLawyers();
  };

  const handleRequestCase = async () => {
    if (!selectedLawyer || !user) return;
    if (user.role !== 'CLIENT') {
      toast.error('Only clients can send case requests. Please login as a client.');
      return;
    }

    try {
      await caseRequestApi.create(
        user.userId,
        selectedLawyer.id,
        requestForm.title,
        requestForm.description,
        requestForm.type
      );
      
      toast.success('Case request sent successfully!');
      setShowRequestForm(false);
      setSelectedLawyer(null);
      setRequestForm({ title: '', description: '', type: 'CIVIL' });
    } catch (error: any) {
      const msg = error?.response?.data?.error || error?.message || 'Failed to send case request';
      toast.error(msg);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Find a Lawyer</h1>
        <p className="text-gray-600 mb-6">
          Search for qualified lawyers by specialization, name, or experience.
        </p>
        
        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Search by name, specialization, or experience..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <Button onClick={handleSearch} disabled={loading}>
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading lawyers...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lawyers.map((lawyer) => (
            <Card key={lawyer.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{lawyer.name}</CardTitle>
                    <p className="text-sm text-gray-600">{lawyer.email}</p>
                  </div>
                  {lawyer.verified && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Verified
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{lawyer.specialization}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{lawyer.experience}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium">${lawyer.hourlyRate}/hour</span>
                  </div>
                  
                  <Button 
                    onClick={() => {
                      setSelectedLawyer(lawyer);
                      setShowRequestForm(true);
                    }}
                    className="w-full mt-4"
                  >
                    Request Consultation
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {lawyers.length === 0 && !loading && (
        <div className="text-center py-8">
          <p className="text-gray-600">No lawyers found. Try adjusting your search criteria.</p>
        </div>
      )}

      {/* Case Request Modal */}
      {showRequestForm && selectedLawyer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Request Case Consultation</CardTitle>
              <p className="text-sm text-gray-600">
                Send a request to {selectedLawyer.name}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Case Title</label>
                <Input
                  value={requestForm.title}
                  onChange={(e) => setRequestForm({ ...requestForm, title: e.target.value })}
                  placeholder="Brief title of your case"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Case Type</label>
                <select
                  value={requestForm.type}
                  onChange={(e) => setRequestForm({ ...requestForm, type: e.target.value })}
                  className="w-full p-2 border rounded-md"
                >
                  {CASE_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type.replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={requestForm.description}
                  onChange={(e) => setRequestForm({ ...requestForm, description: e.target.value })}
                  placeholder="Describe your case in detail..."
                  className="w-full p-2 border rounded-md h-24 resize-none"
                />
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button
                  onClick={handleRequestCase}
                  disabled={!requestForm.title || !requestForm.description}
                  className="flex-1"
                >
                  Send Request
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowRequestForm(false);
                    setSelectedLawyer(null);
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
