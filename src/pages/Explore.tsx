import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { STAGE_LABELS, PROJECT_TYPE_LABELS, CALL_TYPE_LABELS, LOCATION_MODE_LABELS, StageKey, ProjectType, CallType, LocationMode, Project, OpenCall } from '@/lib/types';
import { qProjectsExplore, qOpenCallsExplore, qProjectsByIds } from '@/lib/queries';
import ProjectCard from '@/components/ProjectCard';
import OpenCallCard from '@/components/OpenCallCard';
import EmptyState from '@/components/EmptyState';
import ErrorState from '@/components/ErrorState';
import PaginationControls from '@/components/Pagination';
import { CardGridSkeleton } from '@/components/LoadingSkeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const PAGE_SIZE = 12;

export default function Explore() {
  const [tab, setTab] = useState('projects');

  // Project state
  const [projects, setProjects] = useState<any[]>([]);
  const [pTotal, setPTotal] = useState(0);
  const [pPage, setPPage] = useState(1);
  const [pSearch, setPSearch] = useState('');
  const [stageFilter, setStageFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [pLoading, setPLoading] = useState(true);
  const [pError, setPError] = useState(false);

  // Call state
  const [calls, setCalls] = useState<any[]>([]);
  const [cTotal, setCTotal] = useState(0);
  const [cPage, setCPage] = useState(1);
  const [cSearch, setCSearch] = useState('');
  const [callTypeFilter, setCallTypeFilter] = useState('all');
  const [locFilter, setLocFilter] = useState('all');
  const [cLoading, setCLoading] = useState(true);
  const [cError, setCError] = useState(false);

  const fetchProjects = useCallback(async () => {
    setPLoading(true);
    setPError(false);
    const { data, count, error } = await qProjectsExplore({
      search: pSearch || undefined, stage: stageFilter, type: typeFilter, page: pPage, pageSize: PAGE_SIZE,
    });
    if (error) { setPError(true); setPLoading(false); return; }
    setProjects(data ?? []);
    setPTotal(count ?? 0);
    setPLoading(false);
  }, [pSearch, stageFilter, typeFilter, pPage]);

  const fetchCalls = useCallback(async () => {
    setCLoading(true);
    setCError(false);
    const { data, count, error } = await qOpenCallsExplore({
      search: cSearch || undefined, callType: callTypeFilter, locationMode: locFilter, page: cPage, pageSize: PAGE_SIZE,
    });
    if (error) { setCError(true); setCLoading(false); return; }
    const callsData = data ?? [];

    // Map project info
    const projectIds = [...new Set(callsData.map(c => c.project_id))];
    const { data: projectsData } = await qProjectsByIds(projectIds);
    const pMap = new Map((projectsData ?? []).map(p => [p.id, p]));

    setCalls(callsData.map(c => ({
      ...c,
      _projectTitle: pMap.get(c.project_id)?.title,
      _projectSlug: pMap.get(c.project_id)?.slug,
    })));
    setCTotal(count ?? 0);
    setCLoading(false);
  }, [cSearch, callTypeFilter, locFilter, cPage]);

  useEffect(() => { fetchProjects(); }, [fetchProjects]);
  useEffect(() => { fetchCalls(); }, [fetchCalls]);

  // Reset page on filter change
  const handleStageFilter = (v: string) => { setStageFilter(v); setPPage(1); };
  const handleTypeFilter = (v: string) => { setTypeFilter(v); setPPage(1); };
  const handleCallTypeFilter = (v: string) => { setCallTypeFilter(v); setCPage(1); };
  const handleLocFilter = (v: string) => { setLocFilter(v); setCPage(1); };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 font-display text-3xl font-bold">Keşfet</h1>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="mb-6 bg-secondary">
          <TabsTrigger value="projects">Projeler</TabsTrigger>
          <TabsTrigger value="calls">Açık Çağrılar</TabsTrigger>
        </TabsList>

        <TabsContent value="projects">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px] max-w-xs">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Proje ara..."
                value={pSearch}
                onChange={e => { setPSearch(e.target.value); setPPage(1); }}
                className="bg-secondary border-border pl-9"
              />
            </div>
            <Select value={stageFilter} onValueChange={handleStageFilter}>
              <SelectTrigger className="w-48 bg-secondary border-border"><SelectValue placeholder="Evre" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm Evreler</SelectItem>
                {Object.entries(STAGE_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={handleTypeFilter}>
              <SelectTrigger className="w-40 bg-secondary border-border"><SelectValue placeholder="Tür" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm Türler</SelectItem>
                {Object.entries(PROJECT_TYPE_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {pLoading ? (
            <CardGridSkeleton />
          ) : pError ? (
            <ErrorState onRetry={fetchProjects} />
          ) : projects.length === 0 ? (
            <EmptyState message="Henüz proje yok." />
          ) : (
            <>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {projects.map(p => <ProjectCard key={p.id} project={p} />)}
              </div>
              <PaginationControls page={pPage} totalCount={pTotal} pageSize={PAGE_SIZE} onPageChange={setPPage} />
            </>
          )}
        </TabsContent>

        <TabsContent value="calls">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px] max-w-xs">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Çağrı ara..."
                value={cSearch}
                onChange={e => { setCSearch(e.target.value); setCPage(1); }}
                className="bg-secondary border-border pl-9"
              />
            </div>
            <Select value={callTypeFilter} onValueChange={handleCallTypeFilter}>
              <SelectTrigger className="w-48 bg-secondary border-border"><SelectValue placeholder="Çağrı Türü" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm Türler</SelectItem>
                {Object.entries(CALL_TYPE_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={locFilter} onValueChange={handleLocFilter}>
              <SelectTrigger className="w-40 bg-secondary border-border"><SelectValue placeholder="Konum" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tümü</SelectItem>
                {Object.entries(LOCATION_MODE_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {cLoading ? (
            <CardGridSkeleton />
          ) : cError ? (
            <ErrorState onRetry={fetchCalls} />
          ) : calls.length === 0 ? (
            <EmptyState message="Henüz açık çağrı yok." />
          ) : (
            <>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {calls.map(c => (
                  <OpenCallCard
                    key={c.id}
                    call={{
                      ...c,
                      projects: c._projectTitle ? { title: c._projectTitle, slug: c._projectSlug ?? null } : undefined,
                    } as any}
                  />
                ))}
              </div>
              <PaginationControls page={cPage} totalCount={cTotal} pageSize={PAGE_SIZE} onPageChange={setCPage} />
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
