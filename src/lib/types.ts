import { Database } from '@/integrations/supabase/types';

export type Tables = Database['public']['Tables'];
export type Enums = Database['public']['Enums'];

export type Profile = Tables['profiles']['Row'];
export type Project = Tables['projects']['Row'];
export type OpenCall = Tables['open_calls']['Row'];
export type Application = Tables['applications']['Row'];
export type Checkin = Tables['checkins']['Row'];
export type Notification = Tables['notifications']['Row'];
export type Report = Tables['reports']['Row'];
export type ProjectMember = Tables['project_members']['Row'];
export type NeedsCatalog = Tables['needs_catalog']['Row'];
export type ProjectNeed = Tables['project_needs']['Row'];
export type Stage = Tables['stages']['Row'];
export type StageChecklist = Tables['stage_checklists']['Row'];

export type StageKey = Enums['stage_key'];
export type ProjectVisibility = Enums['project_visibility'];
export type ProjectType = Enums['project_type'];
export type CallType = Enums['call_type'];
export type CallStatus = Enums['call_status'];
export type LocationMode = Enums['location_mode'];
export type ApplicationStatus = Enums['application_status'];
export type MembershipRole = Enums['membership_role'];

export const STAGE_LABELS: Record<StageKey, string> = {
  niyet_istikamet: 'Niyet & İstikamet',
  taslak_cerceve: 'Taslak & Çerçeve',
  ilk_yayin: 'İlk Yayın',
  kullaniciya_acilim: 'Kullanıcıya Açılım',
  istikrar_sureklilik: 'İstikrar & Süreklilik',
  yayinginlastirma: 'Yaygınlaştırma',
  arsiv_kurumsallasma: 'Arşiv & Kurumsallaşma',
};

export const STAGE_ORDER: StageKey[] = [
  'niyet_istikamet',
  'taslak_cerceve',
  'ilk_yayin',
  'kullaniciya_acilim',
  'istikrar_sureklilik',
  'yayinginlastirma',
  'arsiv_kurumsallasma',
];

export const PROJECT_TYPE_LABELS: Record<ProjectType, string> = {
  content: 'İçerik',
  app: 'Uygulama',
  community: 'Topluluk',
  open_source: 'Açık Kaynak',
  education: 'Eğitim',
  media: 'Medya',
  other: 'Diğer',
};

export const CALL_TYPE_LABELS: Record<CallType, string> = {
  core: 'Çekirdek Ekip',
  volunteer: 'Gönüllü',
  short_task: 'Kısa Görev',
  advisor: 'Danışman',
};

export const LOCATION_MODE_LABELS: Record<LocationMode, string> = {
  remote: 'Uzaktan',
  onsite: 'Yerinde',
  hybrid: 'Hibrit',
};
