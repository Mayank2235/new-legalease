import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Plus, Upload, Trash2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { caseApi, caseDocumentsApi } from '@/services/api';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';

const CasesPage = () => {
  const { user } = useAuth();
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewCase, setShowNewCase] = useState(false);
  const [form, setForm] = useState({ clientId: '', title: '', description: '', type: 'OTHER', hourlyRate: 0 });
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [docsByCase, setDocsByCase] = useState<Record<string, any[]>>({});

  useEffect(() => {
    const fetch = async () => {
      try {
        if (user?.userId) {
          const data = await caseApi.getByLawyer(user.userId);
          setCases(data);
          // Load documents for each case (lawyer-only)
          if (user.role === 'LAWYER') {
            const entries = await Promise.all(
              data.map(async (k: any) => {
                try {
                  const docs = await caseDocumentsApi.list(k.id, user.userId);
                  return [k.id as string, docs];
                } catch {
                  return [k.id as string, []];
                }
              })
            );
            const map: Record<string, any[]> = {};
            for (const [k, v] of entries) map[k as string] = v as any[];
            setDocsByCase(map);
          }
        }
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [user]);

  const isLawyer = useMemo(() => user?.role === 'LAWYER', [user]);

  const isValidUuid = (s: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(s);

  const handleCreateCase = async () => {
    if (!user?.userId) return;
    if (!isValidUuid(form.clientId)) {
      toast({ title: 'Invalid Client ID', description: 'Please enter a valid UUID for the client.' });
      return;
    }
    if (!form.title.trim()) {
      toast({ title: 'Title required', description: 'Please enter a case title.' });
      return;
    }
    try {
      await caseApi.create(form.clientId, user.userId, form.title, form.description, form.type, Number(form.hourlyRate));
      const refreshed = await caseApi.getByLawyer(user.userId);
      setCases(refreshed);
      toast({ title: 'Case created' });
      setShowNewCase(false);
      setForm({ clientId: '', title: '', description: '', type: 'OTHER', hourlyRate: 0 });
    } catch (e: any) {
      toast({ title: 'Create failed', description: e?.response?.data?.message || 'Unable to create case.' });
    }
  };

  const handleUpload = async (caseId: string, files: FileList | null) => {
    if (!files || !user?.userId) return;
    setUploadingId(caseId);
    try {
      for (const file of Array.from(files)) {
        await caseDocumentsApi.upload(caseId, user.userId, file);
      }
      const docs = await caseDocumentsApi.list(caseId, user.userId);
      setDocsByCase((m) => ({ ...m, [caseId]: docs }));
      toast({ title: 'Upload successful' });
    } finally {
      setUploadingId(null);
    }
  };

  const handleDeleteCase = async (caseId: string) => {
    try {
      await caseApi.delete(caseId);
      if (user?.userId) setCases(await caseApi.getByLawyer(user.userId));
      setDocsByCase((m) => {
        const n = { ...m };
        delete n[caseId];
        return n;
      });
      toast({ title: 'Case deleted' });
    } catch (e: any) {
      toast({ title: 'Delete failed', description: e?.response?.data?.message || 'Unable to delete case.' });
    }
  };

  const handleDeleteDoc = async (docId: string, caseId: string) => {
    if (!user?.userId) return;
    try {
      await caseDocumentsApi.delete(docId, user.userId);
      const docs = await caseDocumentsApi.list(caseId, user.userId);
      setDocsByCase((m) => ({ ...m, [caseId]: docs }));
      toast({ title: 'Document deleted' });
    } catch (e: any) {
      toast({ title: 'Delete failed', description: e?.response?.data?.message || 'Unable to delete document.' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Cases</h1>
          <p className="text-gray-600">Track and manage your ongoing cases</p>
        </div>
        {isLawyer && (
          <Button onClick={() => setShowNewCase(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Case
          </Button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <div className="col-span-full flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : cases.length === 0 ? (
          <div className="col-span-full text-center text-gray-600 py-8">No cases yet</div>
        ) : (
          cases.map((c) => (
          <Card key={c.id} className="hover:shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                {c.title}
              </CardTitle>
              <CardDescription>{c.clientName} • {c.type} • {new Date(c.createdAt).toLocaleDateString()}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="outline">{c.status}</Badge>
                {isLawyer && (
                  <Button size="sm" variant="destructive" onClick={() => handleDeleteCase(c.id)}>
                    <Trash2 className="h-4 w-4 mr-2" /> Delete
                  </Button>
                )}
              </div>
              {isLawyer && (
                <div className="flex items-center gap-3">
                  <label className="inline-flex items-center px-3 py-2 border rounded-md cursor-pointer text-sm">
                    <Upload className="h-4 w-4 mr-2" /> Upload docs
                    <input type="file" className="hidden" multiple accept="image/*,application/pdf" onChange={(e) => handleUpload(c.id, e.target.files)} />
                  </label>
                  {uploadingId === c.id && <span className="text-xs text-gray-500">Uploading...</span>}
                </div>
              )}
              {Array.isArray(docsByCase[c.id]) && docsByCase[c.id].length > 0 && (
                <div className="space-y-2">
                  {docsByCase[c.id].map((d: any) => (
                    <div key={d.id} className="flex items-center justify-between text-sm">
                      <a className="text-blue-600 hover:underline" href={`http://localhost:8080${d.downloadUrl}?lawyerId=${user?.userId}`} target="_blank" rel="noreferrer">
                        {d.originalName}
                      </a>
                      <Button size="icon" variant="ghost" onClick={() => handleDeleteDoc(d.id, c.id)} title="Delete document">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )))
        }
      </div>

      <Dialog open={showNewCase} onOpenChange={setShowNewCase}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Case</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Input placeholder="Client ID (UUID)" value={form.clientId} onChange={(e) => setForm({ ...form, clientId: e.target.value })} />
            <Input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <Input placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
              <SelectTrigger><SelectValue placeholder="Case Type" /></SelectTrigger>
              <SelectContent>
                {['CRIMINAL','CIVIL','FAMILY','CORPORATE','REAL_ESTATE','PERSONAL_INJURY','EMPLOYMENT','IMMIGRATION','TAX','INTELLECTUAL_PROPERTY','OTHER'].map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input type="number" placeholder="Hourly Rate" value={form.hourlyRate} onChange={(e) => setForm({ ...form, hourlyRate: Number(e.target.value) })} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewCase(false)}>Cancel</Button>
            <Button onClick={handleCreateCase}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CasesPage;


