import { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
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
import { Badge } from '@/components/ui/badge';
import { Search, X } from 'lucide-react';
import { STAGE_ORDER, type ProjectType, type CallType, type LocationMode } from '@/lib/types';

const PAGE_SIZE = 12;

const PROJECT_TYPES: ProjectType[] = ['content','app','community','open_source','education','media','other'];
const CALL_TYPES: CallType[] = ['core','volunteer','short_task','advisor'];
const LOCATION_MODES: LocationMode[] = ['remote','onsite','hybrid'];

function useDebounce(value: string, delay = 400) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export default function Explore() {
  const { t } = useTranslation();
  const [tab, setTab] = useState('projects');
  const [projects, setProjects] = useState<any[]>([]);
  const [pTotal, setPTotal] = useState(0);
  const [pPage, setPPage] = useState(1);
  const [pSearch, setPSearch] = useState('');
  const [stageFilter, setStageFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [pTags, setPTags] = useState<string[]>([]);
  const [pTagInput, setPTagInput] = useState('');
  const [pLoading, setPLoading] = useState(true);
  const [pError, setPError] = useState(false);

  const [calls, setCalls] = useState<any[]>([]);
  const [cTotal, setCTotal] = useState(0);
  const [cPage, setCPage] = useState(1);
  const [cSearch, setCSearch] = useState('');
  const [callTypeFilter, setCallTypeFilter] = useState('all');
  const [locFilter, setLocFilter] = useState('all');
  const [cTags, setCTags] = useState<string[]>([]);
  const [cTagInput, setCTagInput] = useState('');
  const [cLoading, setCLoading] = useState(true);
  const [cError, setCError] = useState(false);

  const debouncedPSearch = useDebounce(pSearch);
  const debouncedCSearch = useDebounce(cSearch);

  const fetchProjects = useCallback(async () => {
    setPLoading(true); setPError(false);
    const { data, count, error } = await qProjectsExplore({ search: debouncedPSearch || undefined, stage: stageFilter, type: typeFilter, tags: pTags.length > 0 ? pTags : undefined, page: pPage, pageSize: PAGE_SIZE });
    if (error) { setPError(true); setPLoading(false); return; }
    setProjects(data ?? []); setPTotal(count ?? 0); setPLoading(false);
  }, [debouncedPSearch, stageFilter, typeFilter, pTags, pPage]);

  const fetchCalls = useCallback(async () => {
    setCLoading(true); setCError(false);
    const { data, count, error } = await qOpenCallsExplore({ search: debouncedCSearch || undefined, callType: callTypeFilter, locationMode: locFilter, tags: cTags.length > 0 ? cTags : undefined, page: cPage, pageSize: PAGE_SIZE });
    if (error) { setCError(true); setCLoading(false); return; }
    const callsData = data ?? [];
    const projectIds = [...new Set(callsData.map(c => c.project_id))];
    const { data: projectsData } = await qProjectsByIds(projectIds);
    const pMap = new Map((projectsData ?? []).map(p => [p.id, p]));
    setCalls(callsData.map(c => ({ ...c, _projectTitle: pMap.get(c.project_id)?.title, _projectSlug: pMap.get(c.project_id)?.slug })));
    setCTotal(count ?? 0); setCLoading(false);
  }, [debouncedCSearch, callTypeFilter, locFilter, cTags, cPage]);

  useEffect(() => { fetchProjects(); }, [fetchProjects]);
  useEffect(() => { fetchCalls(); }, [fetchCalls]);

  const handleStageFilter = (v: string) => { setStageFilter(v); setPPage(1); };
  const handleTypeFilter = (v: string) => { setTypeFilter(v); setPPage(1); };
  const handleCallTypeFilter = (v: string) => { setCallTypeFilter(v); setCPage(1); };
  const handleLocFilter = (v: string) => { setLocFilter(v); setCPage(1); };

  const addPTag = (val: string) => {
    const tag = val.trim().toLowerCase();
    if (tag && !pTags.includes(tag)) { setPTags([...pTags, tag]); setPPage(1); }
    setPTagInput('');
  };
  const removePTag = (tag: string) => { setPTags(pTags.filter(t => t !== tag)); setPPage(1); };

  const addCTag = (val: string) => {
    const tag = val.trim().toLowerCase();
    if (tag && !cTags.includes(tag)) { setCTags([...cTags, tag]); setCPage(1); }
    setCTagInput('');
  };
  const removeCTag = (tag: string) => { setCTags(cTags.filter(t => t !== tag)); setCPage(1); };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 font-display text-3xl font-bold">{t('explore.title')}</h1>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="mb-6 bg-secondary">
          <TabsTrigger value="projects">{t('explore.projects')}</TabsTrigger>
          <TabsTrigger value="calls">{t('explore.openCalls')}</TabsTrigger>
        </TabsList>

        <TabsContent value="projects">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px] max-w-xs">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder={t('explore.searchProjects')} value={pSearch} onChange={e => { setPSearch(e.target.value); setPPage(1); }} className="bg-secondary border-border pl-9" />
            </div>
            <Select value={stageFilter} onValueChange={handleStageFilter}>
              <SelectTrigger className="w-48 bg-secondary border-border"><SelectValue placeholder={t('explore.stage')} /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('explore.allStages')}</SelectItem>
                {STAGE_ORDER.map(k => <SelectItem key={k} value={k}>{t(`stages.${k}`)}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={handleTypeFilter}>
              <SelectTrigger className="w-40 bg-secondary border-border"><SelectValue placeholder={t('explore.type')} /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('explore.allTypes')}</SelectItem>
                {PROJECT_TYPES.map(k => <SelectItem key={k} value={k}>{t(`projectTypes.${k}`)}</SelectItem>)}
              </SelectContent>
            </Select>
            <div className="relative min-w-[160px] max-w-xs">
              <Input
                placeholder={t('explore.addTag')}
                value={pTagInput}
                onChange={e => setPTagInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addPTag(pTagInput); } }}
                className="bg-secondary border-border"
              />
            </div>
          </div>
          {pTags.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {pTags.map(tag => (
                <Badge key={tag} variant="secondary" className="gap-1 cursor-pointer" onClick={() => removePTag(tag)}>
                  {tag} <X className="h-3 w-3" />
                </Badge>
              ))}
            </div>
          )}
          {pLoading ? <CardGridSkeleton /> : pError ? <ErrorState onRetry={fetchProjects} /> : projects.length === 0 ? <EmptyState message={t('explore.noProjects')} /> : (
            <>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{projects.map(p => <ProjectCard key={p.id} project={p} />)}</div>
              <PaginationControls page={pPage} totalCount={pTotal} pageSize={PAGE_SIZE} onPageChange={setPPage} />
            </>
          )}
        </TabsContent>

        <TabsContent value="calls">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px] max-w-xs">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder={t('explore.searchCalls')} value={cSearch} onChange={e => { setCSearch(e.target.value); setCPage(1); }} className="bg-secondary border-border pl-9" />
            </div>
            <Select value={callTypeFilter} onValueChange={handleCallTypeFilter}>
              <SelectTrigger className="w-48 bg-secondary border-border"><SelectValue placeholder={t('explore.callType')} /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('explore.allCallTypes')}</SelectItem>
                {CALL_TYPES.map(k => <SelectItem key={k} value={k}>{t(`callTypes.${k}`)}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={locFilter} onValueChange={handleLocFilter}>
              <SelectTrigger className="w-40 bg-secondary border-border"><SelectValue placeholder={t('explore.location')} /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('explore.allLocations')}</SelectItem>
                {LOCATION_MODES.map(k => <SelectItem key={k} value={k}>{t(`locationModes.${k}`)}</SelectItem>)}
              </SelectContent>
            </Select>
            <div className="relative min-w-[160px] max-w-xs">
              <Input
                placeholder={t('explore.addTag')}
                value={cTagInput}
                onChange={e => setCTagInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addCTag(cTagInput); } }}
                className="bg-secondary border-border"
              />
            </div>
          </div>
          {cTags.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {cTags.map(tag => (
                <Badge key={tag} variant="secondary" className="gap-1 cursor-pointer" onClick={() => removeCTag(tag)}>
                  {tag} <X className="h-3 w-3" />
                </Badge>
              ))}
            </div>
          )}
          {cLoading ? <CardGridSkeleton /> : cError ? <ErrorState onRetry={fetchCalls} /> : calls.length === 0 ? <EmptyState message={t('explore.noCalls')} /> : (
            <>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {calls.map(c => (
                  <OpenCallCard key={c.id} call={{ ...c, projects: c._projectTitle ? { title: c._projectTitle, slug: c._projectSlug ?? null } : undefined } as any} />
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
