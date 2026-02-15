import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Project, OpenCall, STAGE_LABELS, StageKey, PROJECT_TYPE_LABELS, ProjectType, CALL_TYPE_LABELS, CallType } from '@/lib/types';
import ProjectCard from '@/components/ProjectCard';
import OpenCallCard from '@/components/OpenCallCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function Explore() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [calls, setCalls] = useState<(OpenCall & { projects: { title: string; slug: string | null } | null })[]>([]);
  const [stageFilter, setStageFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [callTypeFilter, setCallTypeFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [pRes, cRes] = await Promise.all([
      supabase.from('projects').select('*').eq('visibility', 'public').order('created_at', { ascending: false }),
      supabase.from('open_calls').select('*, projects(title, slug)').eq('status', 'open').eq('visibility', 'public').order('created_at', { ascending: false }),
    ]);
    setProjects(pRes.data ?? []);
    setCalls(cRes.data ?? []);
    setLoading(false);
  };

  const filteredProjects = projects.filter(p => {
    if (stageFilter !== 'all' && p.current_stage !== stageFilter) return false;
    if (typeFilter !== 'all' && p.type !== typeFilter) return false;
    return true;
  });

  const filteredCalls = calls.filter(c => {
    if (callTypeFilter !== 'all' && c.call_type !== callTypeFilter) return false;
    return true;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 font-display text-3xl font-bold">Keşfet</h1>

      <Tabs defaultValue="projects">
        <TabsList className="mb-6 bg-secondary">
          <TabsTrigger value="projects">Projeler</TabsTrigger>
          <TabsTrigger value="calls">Açık Çağrılar</TabsTrigger>
        </TabsList>

        <TabsContent value="projects">
          <div className="mb-4 flex flex-wrap gap-3">
            <Select value={stageFilter} onValueChange={setStageFilter}>
              <SelectTrigger className="w-48 bg-secondary border-border">
                <SelectValue placeholder="Evre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm Evreler</SelectItem>
                {Object.entries(STAGE_LABELS).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{v}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-40 bg-secondary border-border">
                <SelectValue placeholder="Tür" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm Türler</SelectItem>
                {Object.entries(PROJECT_TYPE_LABELS).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{v}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {loading ? (
            <p className="text-muted-foreground">Yükleniyor...</p>
          ) : filteredProjects.length === 0 ? (
            <p className="text-muted-foreground">Henüz proje yok.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProjects.map(p => <ProjectCard key={p.id} project={p} />)}
            </div>
          )}
        </TabsContent>

        <TabsContent value="calls">
          <div className="mb-4">
            <Select value={callTypeFilter} onValueChange={setCallTypeFilter}>
              <SelectTrigger className="w-48 bg-secondary border-border">
                <SelectValue placeholder="Çağrı Türü" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm Türler</SelectItem>
                {Object.entries(CALL_TYPE_LABELS).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{v}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {loading ? (
            <p className="text-muted-foreground">Yükleniyor...</p>
          ) : filteredCalls.length === 0 ? (
            <p className="text-muted-foreground">Henüz açık çağrı yok.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredCalls.map(c => <OpenCallCard key={c.id} call={c} />)}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
