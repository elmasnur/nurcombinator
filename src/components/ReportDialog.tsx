import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Flag } from 'lucide-react';
import { getUserFriendlyError } from '@/lib/error-utils';
import { toast } from 'sonner';
import type { Database } from '@/integrations/supabase/types';

type ReportTargetType = Database['public']['Enums']['report_target_type'];

interface ReportDialogProps {
  targetType: ReportTargetType;
  targetId: string;
}

export default function ReportDialog({ targetType, targetId }: ReportDialogProps) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  if (!user) return null;

  const handleSubmit = async () => {
    if (!reason.trim()) return;
    setLoading(true);
    const { error } = await supabase.from('reports').insert({
      reporter_id: user.id,
      target_type: targetType,
      target_id: targetId,
      reason: reason.trim(),
    });
    if (error) toast.error(getUserFriendlyError(error));
    else { toast.success('Rapor gönderildi'); setOpen(false); setReason(''); }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-muted-foreground">
          <Flag className="mr-1 h-3 w-3" /> Raporla
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card border-border">
        <DialogHeader><DialogTitle>Raporla</DialogTitle></DialogHeader>
        <Textarea
          value={reason}
          onChange={e => setReason(e.target.value)}
          placeholder="Raporlama nedeniniz..."
          maxLength={500}
          className="bg-secondary border-border"
          rows={3}
        />
        <Button onClick={handleSubmit} disabled={!reason.trim() || loading} className="bg-primary text-primary-foreground">
          {loading ? 'Gönderiliyor...' : 'Gönder'}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
