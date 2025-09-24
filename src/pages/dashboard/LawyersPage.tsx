import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Calendar, Star, MapPin } from 'lucide-react';
import { lawyerApi, consultationApi } from '@/services/api';
import { toast } from 'sonner';

const LawyersPage = () => {
  const { user } = useAuth();
  const [lawyers, setLawyers] = useState<any[]>([]);
  const [filteredLawyers, setFilteredLawyers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [bookingLawyer, setBookingLawyer] = useState<any>(null);
  const [scheduledAt, setScheduledAt] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLawyers = async () => {
      try {
        setError(null);
        console.log('Fetching all lawyers...');
        const data = await lawyerApi.getAll();
        console.log('Lawyers data:', data);
        setLawyers(data);
        setFilteredLawyers(data);
      } catch (error: any) {
        console.error('Failed to fetch lawyers:', error);
        setError(error?.response?.data?.message || error.message || 'Failed to fetch lawyers');
        setLawyers([]);
        setFilteredLawyers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchLawyers();
  }, []);

  useEffect(() => {
    const run = async () => {
      if (!searchQuery) {
        setFilteredLawyers(lawyers);
        return;
      }
      try {
        console.log('Searching lawyers with query:', searchQuery);
        const data = await lawyerApi.getAll(searchQuery);
        console.log('Search results:', data);
        setFilteredLawyers(data);
      } catch (e: any) {
        console.error('Search error:', e);
        setError(e?.response?.data?.message || e.message || 'Search failed');
      }
    };
    run();
  }, [searchQuery]);

  const handleBooking = async () => {
    if (!scheduledAt) {
      toast.error('Please select a date and time');
      return;
    }

    try {
      console.log('Booking consultation:', {
        clientId: user!.userId,
        lawyerId: bookingLawyer.user.id,
        scheduledAt: new Date(scheduledAt).toISOString(),
      });
      
      await consultationApi.create({
        clientId: user!.userId,
        lawyerId: bookingLawyer.user.id,
        scheduledAt: new Date(scheduledAt).toISOString(),
      });
      
      toast.success('Consultation booked successfully!');
      setBookingLawyer(null);
      setScheduledAt('');
    } catch (error: any) {
      console.error('Booking error:', error);
      // Keep UI clean: no red page-level banner
      toast.error(error?.response?.data?.message || 'Failed to book consultation');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Find Lawyers</h1>
        <p className="text-gray-600">Search and book consultations with qualified legal professionals.</p>
        {/* Intentionally not rendering page-level error banner to keep UX clean */}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search by name or specialization..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : filteredLawyers.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredLawyers.map((lawyer: any) => (
            <Card key={lawyer.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{lawyer.user?.name || 'Unknown Lawyer'}</CardTitle>
                    <CardDescription>{lawyer.specialization}</CardDescription>
                  </div>
                  {lawyer.verified && (
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Verified
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  {lawyer.experience} experience
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Star className="h-4 w-4 mr-2" />
                  ${lawyer.hourlyRate}/hour
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  {lawyer.user?.email}
                </div>
                <Button onClick={() => setBookingLawyer(lawyer)} className="w-full">
                  Book Consultation
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-600 py-8">No lawyers found.</div>
      )}

      {/* Booking modal */}
      {bookingLawyer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Schedule Consultation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                type="datetime-local"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
              />
              <div className="flex gap-2">
                <Button onClick={handleBooking} className="flex-1">Confirm</Button>
                <Button variant="outline" onClick={() => setBookingLawyer(null)} className="flex-1">Cancel</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default LawyersPage;


