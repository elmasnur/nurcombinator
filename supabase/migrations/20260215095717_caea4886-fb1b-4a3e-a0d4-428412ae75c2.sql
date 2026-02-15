
-- 0) EXTENSIONS
create extension if not exists pgcrypto;

-- 1) ENUMS
do $$ begin
  create type public.user_role as enum ('member','mentor','moderator','admin');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.project_visibility as enum ('public','verified_only','private');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.project_type as enum ('content','app','community','open_source','education','media','other');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.stage_key as enum (
    'niyet_istikamet','taslak_cerceve','ilk_yayin','kullaniciya_acilim',
    'istikrar_sureklilik','yayinginlastirma','arsiv_kurumsallasma'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.need_category as enum ('mentorluk','data','networking','operasyon','icerik','teknik','hukuk','moderasyon');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.call_type as enum ('core','volunteer','short_task','advisor');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.location_mode as enum ('remote','onsite','hybrid');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.call_status as enum ('open','paused','closed');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.application_status as enum ('submitted','shortlisted','accepted','rejected','withdrawn');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.membership_role as enum ('owner','core','volunteer','editor','moderator');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.report_target_type as enum ('project','open_call','application','profile','message');
exception when duplicate_object then null; end $$;

-- 2) TABLES (before functions)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  bio text,
  skills_tags text[] default '{}'::text[],
  availability_hours int default 0,
  trust_level smallint default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.user_roles (
  user_id uuid references auth.users(id) on delete cascade,
  role public.user_role not null,
  created_at timestamptz default now(),
  primary key (user_id, role)
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  slug text unique,
  title text not null,
  summary text,
  description text,
  type public.project_type not null default 'other',
  visibility public.project_visibility not null default 'public',
  current_stage public.stage_key not null default 'niyet_istikamet',
  stage_updated_at timestamptz default now(),
  tags text[] default '{}'::text[],
  cover_image_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_projects_owner on public.projects(owner_id);
create index if not exists idx_projects_visibility on public.projects(visibility);
create index if not exists idx_projects_stage on public.projects(current_stage);

create table if not exists public.project_members (
  project_id uuid references public.projects(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  role public.membership_role not null default 'volunteer',
  created_at timestamptz default now(),
  primary key (project_id, user_id)
);
create index if not exists idx_project_members_user on public.project_members(user_id);

create table if not exists public.stages (
  key public.stage_key primary key,
  title text not null,
  description text
);

create table if not exists public.stage_checklists (
  stage_key public.stage_key primary key references public.stages(key) on delete cascade,
  items jsonb not null
);

create table if not exists public.needs_catalog (
  id uuid primary key default gen_random_uuid(),
  stage_key public.stage_key null,
  category public.need_category not null,
  title text not null,
  description text,
  is_active boolean default true
);
create index if not exists idx_needs_stage on public.needs_catalog(stage_key);
create index if not exists idx_needs_category on public.needs_catalog(category);

create table if not exists public.project_needs (
  project_id uuid references public.projects(id) on delete cascade,
  need_id uuid references public.needs_catalog(id) on delete cascade,
  created_at timestamptz default now(),
  primary key(project_id, need_id)
);

create table if not exists public.open_calls (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  title text not null,
  call_type public.call_type not null default 'volunteer',
  commitment text,
  location_mode public.location_mode not null default 'remote',
  visibility public.project_visibility not null default 'public',
  tags text[] default '{}'::text[],
  status public.call_status not null default 'open',
  apply_until date,
  description text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists idx_open_calls_project on public.open_calls(project_id);
create index if not exists idx_open_calls_status on public.open_calls(status);
create index if not exists idx_open_calls_visibility on public.open_calls(visibility);

create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  open_call_id uuid not null references public.open_calls(id) on delete cascade,
  applicant_id uuid not null references auth.users(id) on delete cascade,
  message text not null,
  links jsonb default '[]'::jsonb,
  status public.application_status not null default 'submitted',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(open_call_id, applicant_id)
);
create index if not exists idx_applications_call on public.applications(open_call_id);
create index if not exists idx_applications_applicant on public.applications(applicant_id);

create table if not exists public.checkins (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  week_start date not null,
  main_metric_name text,
  main_metric_value text,
  deliverable_link text,
  blocker text,
  help_request text,
  created_at timestamptz default now(),
  unique(project_id, week_start)
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null,
  payload jsonb not null default '{}'::jsonb,
  read_at timestamptz,
  created_at timestamptz default now()
);
create index if not exists idx_notifications_user on public.notifications(user_id);

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references auth.users(id) on delete cascade,
  target_type public.report_target_type not null,
  target_id uuid not null,
  reason text not null,
  status text not null default 'open',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 3) HELPER FUNCTIONS (after tables exist)
create or replace function public.has_role(p_user uuid, p_role public.user_role)
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.user_roles ur where ur.user_id = p_user and ur.role = p_role); $$;

create or replace function public.is_admin_or_mod(p_user uuid)
returns boolean language sql stable security definer set search_path = public
as $$ select public.has_role(p_user,'admin') or public.has_role(p_user,'moderator'); $$;

create or replace function public.is_verified_user(p_user uuid)
returns boolean language sql stable security definer set search_path = public
as $$
  select exists (select 1 from public.profiles p where p.id = p_user and coalesce(p.trust_level,0) >= 2)
    or public.has_role(p_user,'mentor')
    or public.is_admin_or_mod(p_user);
$$;

-- 4) PUBLIC VIEW
create or replace view public.profiles_public with (security_invoker = on) as
select p.id, p.display_name, p.bio, p.skills_tags, p.availability_hours, p.trust_level, p.created_at
from public.profiles p;

-- 5) updated_at triggers
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

drop trigger if exists trg_profiles_touch on public.profiles;
create trigger trg_profiles_touch before update on public.profiles for each row execute function public.touch_updated_at();
drop trigger if exists trg_projects_touch on public.projects;
create trigger trg_projects_touch before update on public.projects for each row execute function public.touch_updated_at();
drop trigger if exists trg_open_calls_touch on public.open_calls;
create trigger trg_open_calls_touch before update on public.open_calls for each row execute function public.touch_updated_at();
drop trigger if exists trg_applications_touch on public.applications;
create trigger trg_applications_touch before update on public.applications for each row execute function public.touch_updated_at();

-- 6) Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles(id, display_name, trust_level)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name','Yeni Üye'), 0)
  on conflict (id) do nothing;
  insert into public.user_roles(user_id, role)
  values (new.id, 'member')
  on conflict do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
for each row execute function public.handle_new_user();

-- 7) Notification trigger
create or replace function public.notify_project_owner_on_application()
returns trigger language plpgsql security definer set search_path = public as $$
declare v_owner uuid; v_project uuid;
begin
  select oc.project_id into v_project from public.open_calls oc where oc.id = new.open_call_id;
  select p.owner_id into v_owner from public.projects p where p.id = v_project;
  if v_owner is not null then
    insert into public.notifications(user_id, type, payload)
    values (v_owner, 'new_application', jsonb_build_object('application_id', new.id, 'open_call_id', new.open_call_id, 'applicant_id', new.applicant_id, 'project_id', v_project));
  end if;
  return new;
end $$;

drop trigger if exists trg_notify_owner_on_app on public.applications;
create trigger trg_notify_owner_on_app after insert on public.applications
for each row execute function public.notify_project_owner_on_application();

-- 8) RLS ENABLE
alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.projects enable row level security;
alter table public.project_members enable row level security;
alter table public.stages enable row level security;
alter table public.stage_checklists enable row level security;
alter table public.needs_catalog enable row level security;
alter table public.project_needs enable row level security;
alter table public.open_calls enable row level security;
alter table public.applications enable row level security;
alter table public.checkins enable row level security;
alter table public.notifications enable row level security;
alter table public.reports enable row level security;

-- 9) RLS POLICIES
create policy "profiles_select_self" on public.profiles for select using (auth.uid() = id or public.is_admin_or_mod(auth.uid()));
create policy "profiles_update_self" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);

grant select on public.profiles_public to anon, authenticated;

create policy "roles_select_self" on public.user_roles for select using (user_id = auth.uid() or public.is_admin_or_mod(auth.uid()));
create policy "roles_admin_write" on public.user_roles for insert with check (public.is_admin_or_mod(auth.uid()));
create policy "roles_admin_update" on public.user_roles for update using (public.is_admin_or_mod(auth.uid())) with check (public.is_admin_or_mod(auth.uid()));
create policy "roles_admin_delete" on public.user_roles for delete using (public.is_admin_or_mod(auth.uid()));

create policy "stages_read_all" on public.stages for select using (true);
create policy "checklists_read_all" on public.stage_checklists for select using (true);
create policy "needs_read_all_active" on public.needs_catalog for select using (is_active = true);

create policy "seeds_admin_write_stages" on public.stages for insert with check (public.is_admin_or_mod(auth.uid()));
create policy "seeds_admin_update_stages" on public.stages for update using (public.is_admin_or_mod(auth.uid()));
create policy "seeds_admin_delete_stages" on public.stages for delete using (public.is_admin_or_mod(auth.uid()));
create policy "seeds_admin_write_checklists" on public.stage_checklists for insert with check (public.is_admin_or_mod(auth.uid()));
create policy "seeds_admin_update_checklists" on public.stage_checklists for update using (public.is_admin_or_mod(auth.uid()));
create policy "seeds_admin_delete_checklists" on public.stage_checklists for delete using (public.is_admin_or_mod(auth.uid()));
create policy "seeds_admin_write_needs" on public.needs_catalog for insert with check (public.is_admin_or_mod(auth.uid()));
create policy "seeds_admin_update_needs" on public.needs_catalog for update using (public.is_admin_or_mod(auth.uid()));
create policy "seeds_admin_delete_needs" on public.needs_catalog for delete using (public.is_admin_or_mod(auth.uid()));

create policy "projects_read_public" on public.projects for select using (visibility = 'public');
create policy "projects_read_verified" on public.projects for select using (visibility = 'verified_only' and public.is_verified_user(auth.uid()));
create policy "projects_read_private_members" on public.projects for select using (
  visibility = 'private' and (owner_id = auth.uid() or exists(select 1 from public.project_members pm where pm.project_id = id and pm.user_id = auth.uid()) or public.is_admin_or_mod(auth.uid()))
);
create policy "projects_insert_owner" on public.projects for insert with check (owner_id = auth.uid());
create policy "projects_update_owner" on public.projects for update using (owner_id = auth.uid() or public.is_admin_or_mod(auth.uid())) with check (owner_id = auth.uid() or public.is_admin_or_mod(auth.uid()));
create policy "projects_delete_owner" on public.projects for delete using (owner_id = auth.uid() or public.is_admin_or_mod(auth.uid()));

create policy "pm_read_members" on public.project_members for select using (
  exists(select 1 from public.project_members pm2 where pm2.project_id = project_id and pm2.user_id = auth.uid())
  or exists(select 1 from public.projects p where p.id = project_id and p.owner_id = auth.uid())
  or public.is_admin_or_mod(auth.uid())
);
create policy "pm_insert_owner" on public.project_members for insert with check (
  exists(select 1 from public.projects p where p.id = project_id and p.owner_id = auth.uid()) or public.is_admin_or_mod(auth.uid())
);
create policy "pm_update_owner" on public.project_members for update using (
  exists(select 1 from public.projects p where p.id = project_id and p.owner_id = auth.uid()) or public.is_admin_or_mod(auth.uid())
);
create policy "pm_delete_owner" on public.project_members for delete using (
  exists(select 1 from public.projects p where p.id = project_id and p.owner_id = auth.uid()) or public.is_admin_or_mod(auth.uid())
);

create policy "project_needs_read" on public.project_needs for select using (true);
create policy "project_needs_write_member" on public.project_needs for insert with check (
  exists(select 1 from public.projects p where p.id = project_id and p.owner_id = auth.uid())
  or exists(select 1 from public.project_members pm where pm.project_id = project_id and pm.user_id = auth.uid())
);
create policy "project_needs_delete_member" on public.project_needs for delete using (
  exists(select 1 from public.projects p where p.id = project_id and p.owner_id = auth.uid())
  or exists(select 1 from public.project_members pm where pm.project_id = project_id and pm.user_id = auth.uid())
);

create policy "open_calls_read_public" on public.open_calls for select using (
  visibility = 'public' and status in ('open','paused') and exists(select 1 from public.projects p where p.id = project_id and p.visibility = 'public')
);
create policy "open_calls_read_verified" on public.open_calls for select using (
  visibility = 'verified_only' and status in ('open','paused') and public.is_verified_user(auth.uid())
);
create policy "open_calls_read_team" on public.open_calls for select using (
  exists(select 1 from public.projects p where p.id = project_id and p.owner_id = auth.uid())
  or exists(select 1 from public.project_members pm where pm.project_id = project_id and pm.user_id = auth.uid())
  or public.is_admin_or_mod(auth.uid())
);
create policy "open_calls_insert_team" on public.open_calls for insert with check (
  exists(select 1 from public.projects p where p.id = project_id and p.owner_id = auth.uid())
  or exists(select 1 from public.project_members pm where pm.project_id = project_id and pm.user_id = auth.uid() and pm.role in ('owner','core','moderator','editor'))
  or public.is_admin_or_mod(auth.uid())
);
create policy "open_calls_update_team" on public.open_calls for update using (
  exists(select 1 from public.projects p where p.id = project_id and p.owner_id = auth.uid())
  or exists(select 1 from public.project_members pm where pm.project_id = project_id and pm.user_id = auth.uid() and pm.role in ('owner','core','moderator','editor'))
  or public.is_admin_or_mod(auth.uid())
);
create policy "open_calls_delete_team" on public.open_calls for delete using (
  exists(select 1 from public.projects p where p.id = project_id and p.owner_id = auth.uid())
  or exists(select 1 from public.project_members pm where pm.project_id = project_id and pm.user_id = auth.uid() and pm.role in ('owner','core','moderator','editor'))
  or public.is_admin_or_mod(auth.uid())
);

create policy "applications_insert_self" on public.applications for insert with check (applicant_id = auth.uid());
create policy "applications_read_self" on public.applications for select using (applicant_id = auth.uid());
create policy "applications_read_project_team" on public.applications for select using (
  exists(select 1 from public.open_calls oc join public.projects p on p.id = oc.project_id left join public.project_members pm on pm.project_id = p.id and pm.user_id = auth.uid()
    where oc.id = open_call_id and (p.owner_id = auth.uid() or pm.role in ('owner','core','moderator','editor') or public.is_admin_or_mod(auth.uid())))
);
create policy "applications_update_project_team" on public.applications for update using (
  exists(select 1 from public.open_calls oc join public.projects p on p.id = oc.project_id left join public.project_members pm on pm.project_id = p.id and pm.user_id = auth.uid()
    where oc.id = open_call_id and (p.owner_id = auth.uid() or pm.role in ('owner','core','moderator','editor') or public.is_admin_or_mod(auth.uid())))
) with check (true);
create policy "applications_withdraw_self" on public.applications for update using (applicant_id = auth.uid()) with check (applicant_id = auth.uid());

create policy "checkins_read_members" on public.checkins for select using (
  exists(select 1 from public.projects p where p.id = project_id and p.owner_id = auth.uid())
  or exists(select 1 from public.project_members pm where pm.project_id = project_id and pm.user_id = auth.uid())
  or public.is_admin_or_mod(auth.uid())
);
create policy "checkins_insert_members" on public.checkins for insert with check (
  user_id = auth.uid() and (
    exists(select 1 from public.projects p where p.id = project_id and p.owner_id = auth.uid())
    or exists(select 1 from public.project_members pm where pm.project_id = project_id and pm.user_id = auth.uid())
  )
);
create policy "checkins_update_members" on public.checkins for update using (user_id = auth.uid() or public.is_admin_or_mod(auth.uid())) with check (user_id = auth.uid() or public.is_admin_or_mod(auth.uid()));

create policy "notifications_read_self" on public.notifications for select using (user_id = auth.uid());
create policy "notifications_update_self" on public.notifications for update using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "reports_insert_all_auth" on public.reports for insert with check (reporter_id = auth.uid());
create policy "reports_read_admin_mod" on public.reports for select using (public.is_admin_or_mod(auth.uid()));
create policy "reports_update_admin_mod" on public.reports for update using (public.is_admin_or_mod(auth.uid())) with check (public.is_admin_or_mod(auth.uid()));

-- 10) SEED DATA
insert into public.stages(key,title,description) values
('niyet_istikamet','Niyet & İstikamet','Projenin maksadı, sınırları ve ilkeleri netleşir.'),
('taslak_cerceve','Taslak & Çerçeve','İçerik/ürün iskeleti, akış ve plan çıkar.'),
('ilk_yayin','İlk Yayın','Canlıda ilk sürüm yayınlanır.'),
('kullaniciya_acilim','Kullanıcıya Açılım','Düzenli kullanıcı teması ve geri bildirim döngüsü kurulur.'),
('istikrar_sureklilik','İstikrar & Süreklilik','Rutin, kalite standardı ve bakım sorumluluğu oturur.'),
('yayinginlastirma','Yaygınlaştırma & Hizmet Ağları','İşbirliği ve yaygınlaştırma yapılır, çizgi korunur.'),
('arsiv_kurumsallasma','Arşiv & Kurumsallaşma','Kişiye bağlı kalmadan sürdürülebilir sistem kurulur.')
on conflict (key) do nothing;

insert into public.stage_checklists(stage_key, items) values
('niyet_istikamet', '[{"title":"1 sayfa Proje Niyeti & Kapsamı yaz","done":false},{"title":"Yapmayacaklarımız listesi (en az 5 madde)","done":false},{"title":"Hedef kitleyi tek cümleyle tanımla","done":false},{"title":"3 risk belirle","done":false},{"title":"İlk 7 günlük mini planı yaz","done":false}]'::jsonb),
('taslak_cerceve', '[{"title":"Sitemap/akış şeması çıkar","done":false},{"title":"3 örnek içerik/ekran üret","done":false},{"title":"Haftalık üretim ritmi belirle","done":false},{"title":"Kalite kontrol kuralı yaz","done":false},{"title":"Gönüllü rol tanımları oluştur","done":false}]'::jsonb),
('ilk_yayin', '[{"title":"Canlı landing veya ilk modül yayınla","done":false},{"title":"Geri bildirim formunu ekle","done":false},{"title":"Basit analitik kur","done":false},{"title":"10 kişiye ulaştır ve 3 geri bildirim topla","done":false},{"title":"1 düzeltme turu yap","done":false}]'::jsonb),
('kullaniciya_acilim', '[{"title":"Topluluk kanalı aç","done":false},{"title":"Haftalık 1 yayın/iterasyon ritmi","done":false},{"title":"Geri bildirimleri etiketle ve önceliklendir","done":false},{"title":"50 erişim / 10 aktif etkileşim hedefi koy","done":false},{"title":"1 haftalık iyileştirme raporu yaz","done":false}]'::jsonb),
('istikrar_sureklilik', '[{"title":"1 aylık yayın takvimi oluştur","done":false},{"title":"Bakım sorumlusu belirle","done":false},{"title":"Dokümantasyon başlat","done":false},{"title":"Kriz planı","done":false},{"title":"4 hafta aralıksız devam hedefi","done":false}]'::jsonb),
('yayinginlastirma', '[{"title":"3 partnerlik hedefi yaz","done":false},{"title":"1 seri/etkinlik formatı belirle","done":false},{"title":"Gönüllü kazanım akışı oluştur","done":false},{"title":"İletişim dili ve yanlış anlaşılma önlemleri","done":false},{"title":"Çapraz yayın/işbirliği planı","done":false}]'::jsonb),
('arsiv_kurumsallasma', '[{"title":"Arşiv standardı belirle","done":false},{"title":"Devir planı yaz","done":false},{"title":"Yeni gelen onboarding dokümanı","done":false},{"title":"Şeffaf raporlama formatı","done":false},{"title":"Uzun vadeli finansman modeli","done":false}]'::jsonb)
on conflict (stage_key) do nothing;

insert into public.needs_catalog(stage_key, category, title, description) values
(null,'networking','Ekip arkadaşı / paydaş arıyorum','Her evrede açılabilir; proje profilinde yayınlanır.'),
(null,'mentorluk','Genel yönlendirme (15-30 dk)','Evre bağımsız hızlı değerlendirme.'),
(null,'data','Basit ölçüm / analitik kurulum','Erişim-etkileşim-istikrar takibi.'),
('niyet_istikamet','icerik','Manifesto / niyet metni gözden geçirme','1 sayfalık niyet ve sınır metni.'),
('taslak_cerceve','teknik','MVP kapsamı ve mimari öneri','İlk yayın için minimum plan.'),
('ilk_yayin','teknik','Canlıya alma desteği','Deploy/hosting + temel güvenlik.'),
('kullaniciya_acilim','networking','Topluluk kural seti ve moderasyon','Kural + rol + şikayet süreci.'),
('istikrar_sureklilik','operasyon','Süreç ve görev devri','Tek kişiye bağlı kalmama.'),
('yayinginlastirma','networking','Partnerlik / çapraz yayın','Benzer projelerle işbirliği.'),
('arsiv_kurumsallasma','hukuk','Kurumsal yapı ve şeffaflık','İhtiyaç varsa dernek/vakıf + raporlama.')
on conflict do nothing;

-- 11) Grants
grant usage on schema public to anon, authenticated;
grant select on public.projects, public.stages, public.stage_checklists, public.needs_catalog, public.open_calls to anon, authenticated;
grant select, insert, update, delete on public.project_members, public.project_needs, public.applications, public.checkins, public.notifications, public.reports to authenticated;
grant select, update on public.profiles to authenticated;
grant insert on public.projects, public.open_calls to authenticated;
