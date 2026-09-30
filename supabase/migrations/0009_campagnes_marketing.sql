-- ============================================================
-- Migration 0009 — Campagnes marketing Facebook (onglet « Campagne »
-- de l'app mobile, qui remplace l'onglet Newsletter).
--
-- Schéma `editorial` (projet Supabase Social-neuraweb, szpqellzyyocenxufvsl) :
-- c'est le schéma que Claude routine lit et écrit déjà via son connecteur,
-- donc le générateur quotidien n'a besoin d'aucun nouvel accès.
--
-- Qui écrit quoi :
--   campagnes              → humain (SQL / seed ci-dessous)      · routine : lecture
--   campagne_semaines      → humain via l'app (gagnant, KPI manuels)
--                            + routine le dimanche (bilan, decisions)
--   campagne_publications  → routine (INSERT, statut 'a_valider')
--                            + app (validation, édition, publication, lien FB)
--   campagne_metriques     → route serveur /api/mobile/campagne/sync (service role)
--   campagne_page_stats    → idem
--   campagne_suivi (vue)   → lecture app + routine : publication + dernières métriques
--
-- Idempotente (if not exists / drop policy if exists) : ré-exécutable.
-- Appliquée en base le 2026-09-29 via le connecteur Supabase.
-- ============================================================

-- ── 1. Campagnes ────────────────────────────────────────────
create table if not exists editorial.campagnes (
  id              bigint generated always as identity primary key,
  slug            text not null unique,
  nom             text not null,
  marche          text not null default 'hanoi' check (marche in ('france', 'hanoi')),
  plateforme      text not null default 'Facebook',
  langue          text not null default 'vi' check (langue in ('vi', 'en', 'fr')),
  objectif        text,
  -- Règles, offre, rythme, direction artistique : lu intégralement par le
  -- générateur à chaque session. Fait foi pour la campagne.
  brief           text not null,
  -- Réponses types aux commentaires (copiables depuis l'app) :
  -- [{ "cas": "...", "cas_fr": "...", "reponse": "..." }]
  reponses_types  jsonb not null default '[]'::jsonb,
  lien_principal  text,
  date_debut      date not null,
  date_fin        date,
  statut          text not null default 'active'
                  check (statut in ('brouillon', 'active', 'en_pause', 'terminee')),
  kpi_cibles      jsonb not null default '{}'::jsonb,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

comment on table editorial.campagnes is
  'Campagnes marketing orchestrées au quotidien (onglet Campagne de l''app). statut=active → Claude routine génère les publications du jour et du lendemain à partir de brief.';

-- ── 2. Semaines de campagne ─────────────────────────────────
create table if not exists editorial.campagne_semaines (
  id                bigint generated always as identity primary key,
  campagne_id       bigint not null references editorial.campagnes (id) on delete cascade,
  semaine_numero    int not null check (semaine_numero > 0),
  date_debut        date not null,
  date_fin          date not null,
  angle             text,
  -- Saisis par l'humain dans l'app — jamais par la routine.
  gagnant           text,
  statut_selection  text not null default 'collecte'
                    check (statut_selection in ('collecte', 'annonce', 'production', 'livre', 'report')),
  conversations     int check (conversations >= 0),
  devis             int check (devis >= 0),
  ventes            int check (ventes >= 0),
  notes_humain      text,
  -- Écrits par Claude routine le dimanche (bilan + propositions).
  bilan             text,   -- « analyse » est un mot réservé en PostgreSQL
  decisions         text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  unique (campagne_id, semaine_numero)
);

-- ── 3. Publications ─────────────────────────────────────────
create table if not exists editorial.campagne_publications (
  id                  bigint generated always as identity primary key,
  campagne_id         bigint not null references editorial.campagnes (id) on delete cascade,
  semaine_numero      int,
  date_prevue         date not null,
  heure_prevue        text,                -- 'HH:MM', heure locale du marché (Hanoi = UTC+7)
  role                text not null default 'autre'
                      check (role in ('appel', 'relance', 'demo', 'educatif', 'coulisses', 'livraison',
                                      'avant_apres', 'annonce', 'report', 'offre', 'autre')),
  format              text not null default 'image'
                      check (format in ('image', 'video', 'carrousel', 'texte')),
  titre               text not null,       -- FR, interne
  texte_publication   text not null,       -- dans la langue de la campagne (vi)
  traduction_fr       text,
  commentaire_epingle text,
  texte_visuel        text,                -- texte à incruster à la main (Canva), jamais dans le prompt
  visuel_type         text not null default 'ia'
                      check (visuel_type in ('ia', 'photo_reelle', 'capture', 'aucun')),
  brief_photo         text,                -- si photo réelle / capture : quoi shooter
  prompt_image        text,                -- Gemini / ChatGPT
  prompt_video        text,                -- Flow (Veo, Frames to Video) à partir de l'image
  format_visuel       text check (format_visuel is null or format_visuel in ('4:5', '1:1', '9:16', '16:9')),
  hashtags            text,
  objectif            text,
  checklist           jsonb not null default '{}'::jsonb,
  statut              text not null default 'a_valider'
                      check (statut in ('a_valider', 'valide', 'publie', 'rejete')),
  genere_par          text not null default 'claude_routine'
                      check (genere_par in ('claude_routine', 'app', 'humain')),
  note_humain         text,                -- retour de l'humain (motif de rejet, corrections)
  facebook_post_id    text,
  permalink_url       text,
  date_publication    timestamptz,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create index if not exists campagne_publications_campagne_date_idx
  on editorial.campagne_publications (campagne_id, date_prevue desc);

-- Un post Facebook ne peut être rattaché qu'à une seule publication.
create unique index if not exists campagne_publications_fb_post_uidx
  on editorial.campagne_publications (facebook_post_id)
  where facebook_post_id is not null;

-- ── 4. Métriques (une ligne par collecte = série temporelle) ─
create table if not exists editorial.campagne_metriques (
  id                         bigint generated always as identity primary key,
  publication_id             bigint not null references editorial.campagne_publications (id) on delete cascade,
  date_collecte              timestamptz not null default now(),
  vues                       int,   -- post_media_view (remplace les impressions depuis juin 2026)
  personnes_atteintes        int,   -- post_total_media_view_unique
  reactions                  int,
  commentaires               int,
  partages                   int,
  clics                      int,   -- post_clicks
  vues_video                 int,   -- post_video_views (3 s)
  commentaires_conformes     int,   -- format de participation respecté (posts d'appel)
  commentaires_sans_reponse  int,   -- commentaires de 1er niveau sans réponse de la Page
  brut                       jsonb  -- métriques indisponibles / erreurs Graph, pour diagnostic
);

create index if not exists campagne_metriques_publication_idx
  on editorial.campagne_metriques (publication_id, date_collecte desc);

-- ── 5. Statistiques de la Page ──────────────────────────────
create table if not exists editorial.campagne_page_stats (
  id             bigint generated always as identity primary key,
  campagne_id    bigint not null references editorial.campagnes (id) on delete cascade,
  date_collecte  timestamptz not null default now(),
  page_id        text,
  page_nom       text,
  page_lien      text,
  abonnes        int,
  fans           int
);

create index if not exists campagne_page_stats_campagne_idx
  on editorial.campagne_page_stats (campagne_id, date_collecte desc);

-- ── 6. Vue de suivi : publication + dernières métriques ─────
create or replace view editorial.campagne_suivi
with (security_invoker = true) as
select
  p.id as publication_id,
  p.campagne_id,
  p.semaine_numero,
  p.date_prevue,
  p.heure_prevue,
  p.role,
  p.format,
  p.titre,
  p.statut,
  p.date_publication,
  p.facebook_post_id,
  m.date_collecte,
  m.vues,
  m.personnes_atteintes,
  m.reactions,
  m.commentaires,
  m.partages,
  m.clics,
  m.vues_video,
  m.commentaires_conformes,
  m.commentaires_sans_reponse
from editorial.campagne_publications p
left join lateral (
  select *
  from editorial.campagne_metriques cm
  where cm.publication_id = p.id
  order by cm.date_collecte desc
  limit 1
) m on true;

-- ── 7. updated_at ───────────────────────────────────────────
drop trigger if exists trg_campagnes_updated_at on editorial.campagnes;
create trigger trg_campagnes_updated_at
  before update on editorial.campagnes
  for each row execute function editorial.set_updated_at();

drop trigger if exists trg_campagne_semaines_updated_at on editorial.campagne_semaines;
create trigger trg_campagne_semaines_updated_at
  before update on editorial.campagne_semaines
  for each row execute function editorial.set_updated_at();

drop trigger if exists trg_campagne_publications_updated_at on editorial.campagne_publications;
create trigger trg_campagne_publications_updated_at
  before update on editorial.campagne_publications
  for each row execute function editorial.set_updated_at();

-- ── 8. RLS + GRANT ──────────────────────────────────────────
-- Les privilèges par défaut du schéma donnent SELECT à `anon` sur toute
-- nouvelle table : RLS activée partout + REVOKE explicite, sinon ces
-- tables seraient lisibles avec la seule anon key.
alter table editorial.campagnes             enable row level security;
alter table editorial.campagne_semaines     enable row level security;
alter table editorial.campagne_publications enable row level security;
alter table editorial.campagne_metriques    enable row level security;
alter table editorial.campagne_page_stats   enable row level security;

-- Point de départ sans privilège, puis on accorde le strict nécessaire.
revoke all on editorial.campagnes, editorial.campagne_semaines, editorial.campagne_publications,
              editorial.campagne_metriques, editorial.campagne_page_stats, editorial.campagne_suivi
  from anon, authenticated;

-- App (compte admin authentifié) : lecture partout.
drop policy if exists "authenticated read" on editorial.campagnes;
create policy "authenticated read" on editorial.campagnes for select to authenticated using (true);
drop policy if exists "authenticated read" on editorial.campagne_semaines;
create policy "authenticated read" on editorial.campagne_semaines for select to authenticated using (true);
drop policy if exists "authenticated read" on editorial.campagne_publications;
create policy "authenticated read" on editorial.campagne_publications for select to authenticated using (true);
drop policy if exists "authenticated read" on editorial.campagne_metriques;
create policy "authenticated read" on editorial.campagne_metriques for select to authenticated using (true);
drop policy if exists "authenticated read" on editorial.campagne_page_stats;
create policy "authenticated read" on editorial.campagne_page_stats for select to authenticated using (true);

-- App : saisie humaine de la semaine (gagnant, KPI manuels).
drop policy if exists "authenticated update" on editorial.campagne_semaines;
create policy "authenticated update" on editorial.campagne_semaines
  for update to authenticated using (true) with check (true);

-- App : validation, édition, rejet, « publié ailleurs » d'une publication.
drop policy if exists "authenticated update" on editorial.campagne_publications;
create policy "authenticated update" on editorial.campagne_publications
  for update to authenticated using (true) with check (true);

grant usage on schema editorial to authenticated;
grant select on editorial.campagnes, editorial.campagne_metriques, editorial.campagne_page_stats,
                editorial.campagne_suivi
  to authenticated;
grant select, update on editorial.campagne_semaines, editorial.campagne_publications to authenticated;
-- Aucun insert/delete depuis l'app : les publications viennent de la routine,
-- les métriques et stats de Page de la route serveur (service role).

-- ── 9. Realtime (nouvelle publication → notification dans l'app) ─
do $$
declare t text;
begin
  foreach t in array array['campagne_publications', 'campagne_semaines'] loop
    if not exists (
      select 1 from pg_publication_tables
      where pubname = 'supabase_realtime' and schemaname = 'editorial' and tablename = t
    ) then
      execute format('alter publication supabase_realtime add table editorial.%I', t);
    end if;
  end loop;
end $$;

-- ── 10. Seed : opération « Mỗi tuần một trang » (Hanoi) ─────
-- Source : Hanoi/OFFRE-JEU-FACEBOOK.md et .vi.md (septembre 2026).
insert into editorial.campagnes
  (slug, nom, marche, plateforme, langue, objectif, brief, reponses_types, lien_principal,
   date_debut, date_fin, statut, kpi_cibles)
values (
  'moi-tuan-mot-trang-2026',
  'Mỗi tuần một trang',
  'hanoi',
  'Facebook',
  'vi',
  'Chaque semaine, offrir une landing page (valeur 4.900.000₫) à un établissement de Hà Nội sélectionné sur critères, pour construire 8 réalisations locales et convertir les participants en clients Khởi Đầu.',
  $brief$
# Brief — opération « Mỗi tuần một trang » (Facebook, Hà Nội)

Sources qui font foi : `OFFRE-JEU-FACEBOOK.md` / `.vi.md` (dépôt Hanoi) et la page publique https://vn.neuraweb.fr/qua-tang. Ce brief en est la version opérationnelle pour la génération quotidienne.

## 1. L'offre
- Chaque semaine, UN établissement de Hà Nội reçoit la conception et le développement d'une landing page, valeur **4.900.000₫**, livrée en 7 jours après réception du contenu (design sur mesure, rapide sur mobile, boutons Gọi · Zalo · Messenger · Chỉ đường, carte, 3 à 6 photos, affiche QR A5).
- Restent à la charge du gagnant : **phí mở dịch vụ 50 USD (~1.300.000₫)**, une seule fois, et le **tên miền** acheté à son nom. Jamais d'abonnement, de commission, de frais cachés.
- Participation : suivre la page + commenter au format **« Tên cơ sở – Địa chỉ (hoặc link Google Maps) – Một câu: vì sao quán này xứng đáng có một trang web »**. N'importe qui peut proposer un établissement (le lot n'est remis qu'au gérant, après un appel de vérification).
- Sélection sur critères annoncés, jamais un tirage : besoin réel 35 %, photogénie 25 %, représentativité de la cible 20 %, disponibilité du gérant 20 %. Annonce le dimanche 20h. Sous 15 commentaires conformes, la semaine peut être reportée.
- Durée : 8 premières semaines, du 28/09 au 22/11/2026. Une prolongation ne s'annonce qu'explicitement, jamais par sous-entendu.
- Non-retenus : un geste, jamais une remise — frais de mise en service offerts + 3 photos si Khởi Đầu sous 7 jours (message privé dans les réponses types).

## 2. Seuls chiffres autorisés
Khởi Đầu 4.900.000₫ (3.900.000₫ avec entretien) · Phát Triển 11.900.000₫ · Cao Cấp 24.900.000₫ · Doanh Nghiệp sur devis. Options : langue 1.500.000₫, logo 2.500.000₫, Zalo OA 1.500.000₫, shooting 2.000.000₫, tự sửa nội dung 6.900.000₫ (Khởi Đầu) / 12.900.000₫ (Phát Triển). Services sur devis : tự động hoá dès 9.900.000₫, chatbot IA dès 19.900.000₫, application Android dès 49.900.000₫. Mise en service 1.300.000₫ (~50 USD) et domaine (~300.000₫/an) : jamais inclus, jamais « offerts » à l'écrit. Aucun autre chiffre (statistique de marché, résultat client, pourcentage) sans source fournie par l'humain.

## 3. Règles non négociables
1. Vocabulaire interdit : « bốc thăm », « quay số », « trúng thưởng », « người trúng thưởng », « may mắn ». Seule exception : la négation officielle « không bốc thăm may rủi ». On dit « xét chọn », « cơ sở được chọn », « lượt tham gia ».
2. Jamais exiger ni sous-entendre un partage ou un tag comme condition. On écrit au contraire « không cần chia sẻ, không cần tag ai ».
3. Le cadeau (4.900.000₫) devant, les conditions derrière mais toujours présentes : chaque post d'appel contient la ligne « 📄 Điều kiện: phần thiết kế và lập trình (4.900.000₫) được tặng. Phí mở dịch vụ 50 USD và tên miền do cơ sở được chọn tự trả. Chi tiết: vn.neuraweb.fr/qua-tang#dieu-kien ».
4. Posts d'appel et d'annonce : dernière ligne « Chương trình do Neuraweb tổ chức, không liên kết và không được Facebook/Meta tài trợ hay quản lý. »
5. Aucune fausse urgence ni fausse rareté. Les compteurs réels (« TUẦN 2/8 », « Còn 6/8 tuần ») sont autorisés.
6. Aucun témoignage, avis, nom de client, citation de gérant ou résultat inventé. Le gagnant est uniquement celui saisi par l'humain (`campagne_semaines.gagnant`) ; une citation de gérant n'existe que si l'humain l'a fournie (`notes_humain`).
7. Ne jamais isoler un « 4 » seul en gros (homophone de « tử », la mort). « 4.900.000₫ » dans une phrase ne pose aucun problème.
8. Liens sortants dans le commentaire épinglé, pas dans le corps (seule exception : la ligne Điều kiện des posts d'appel).
9. Rien hors grille ni hors périmètre : pas de Zalo Mini App, de voice bot, de « top Google garanti ».
10. Vietnamien naturel, jamais une traduction mot à mot du français : lecteur = « anh/chị », soi = « mình » (« em » dans une réponse très polie), jamais « bạn » pour un gérant, jamais « tôi ». Diacritiques complets. Lexique : trang web / landing page (jamais « trang hạ cánh »), phí mở dịch vụ, tên miền, thể lệ chương trình, lượt tham gia, cơ sở được chọn, xét chọn, tự sửa nội dung, bảo trì ; noms de gói jamais traduits.
11. Tout texte vietnamien est relu par un natif avant publication (l'humain s'en charge) : toujours fournir une traduction française fidèle.
12. Commentaires : réponse en moins de 2 heures, en public, avec un chiffre (réponses types fournies).

## 4. Rythme hebdomadaire (heure de Hanoi)
- **Lundi 20h — appel** : bandeau « TUẦN n/8 », angle de la semaine. À partir de S2 : « Tuần trước là [gagnant]. Tuần này là ai? », rappel des 2 étapes en 2 lignes (pas tout le règlement), « Còn N/8 tuần ».
- **Mardi à jeudi — soutien** (1 post/jour ; horaires à tester : 11h30-12h30 ou 19h30-21h, à ajuster aux vues mesurées) : démo du métier de la semaine (vn.neuraweb.fr/packs), pédagogie (« Facebook garde vos clients, un site en amène de nouveaux via Google Maps »), coulisses de production du gagnant précédent, réponse à une question fréquente. Chaque post renvoie vers le post d'appel en cours.
- **Vendredi — livraison** : mise en ligne du site du gagnant précédent (si livré), sinon démo ou offre.
- **Samedi — avant/après** du gagnant précédent : « TRƯỚC / SAU », photos réelles uniquement. C'est le post le plus rentable des huit, le seul qui prouve.
- **Dimanche 20h — annonce** : « ĐÃ CHỌN: [tên cơ sở], [quận] », une raison concrète et vraie du choix, remerciement aux participants, « Còn N/8 tuần » ; ou annonce de report. Le soir même : message privé aux non-retenus (réponses types).
- S1 n'a pas de gagnant précédent : coulisses, livraison et avant/après sont remplacés par des démos et de la pédagogie. L'avant/après du gagnant S1 tombe en S3.

## 5. Accroches testées (1re ligne, avant « Xem thêm »)
A « TẶNG MỘT TRANG WEB. MỖI TUẦN. CHO MỘT QUÁN Ở HÀ NỘI. » (lancement) · B « Trị giá 4.900.000₫. Tặng. Mỗi tuần một quán ở Hà Nội. » (à tester en S3) · C « Tuần này, một quán ở Hà Nội sẽ có website riêng. Miễn phí. » (la plus douce).

## 6. Direction artistique
- Scènes réelles de Hà Nội : ruelle du Vieux Quartier, petit café aux tabourets bas, salon de quartier, boutique, homestay. Lumière naturelle, rendu de photo prise au smartphone. Jamais d'image de stock « équipe souriante autour d'un laptop » (signal d'arnaque n°1 sur ce marché).
- Palette : fond clair ou blanc cassé, un accent profond (vert émeraude ou bleu nuit), or #D9A02B réservé au montant 4.900.000₫ ajouté en surimpression. Fuir le rouge-jaune saturé des promos (bas de gamme). Noir et blanc dominants à éviter (deuil).
- L'image générée ne contient AUCUN texte : le texte à incruster (`texte_visuel`) est posé ensuite à la main avec Be Vietnam Pro (diacritiques vérifiés à l'œil : ế, ộ, ữ, đ). Garder une zone calme pour ce texte. Test : lisible réduit à 150 px de large.
- Formats : 4:5 (1080×1350) pour une image du fil ; 9:16 (1080×1920) quand une vidéo est prévue, sujet principal dans la zone centrale 4:5 pour réutiliser la même image dans le fil.
- Une image générée ne représente jamais un établissement réel identifiable, un gérant ou un « client » : annonce, livraison, avant/après et portrait de gérant = photo réelle (`visuel_type = photo_reelle` + `brief_photo`).

## 7. Liens
Règlement et conditions : https://vn.neuraweb.fr/qua-tang (ancre #dieu-kien) · 17 démos : https://vn.neuraweb.fr/packs · Zalo : zalo.me/33749775654 · Page Facebook : https://www.facebook.com/people/Neuraweb/61587416320627/

## 8. KPI (hypothèses de départ, à remplacer par le réel)
Commentaires conformes par semaine : 15 minimum (seuil de validité), 15-25 en S1-S2, 25-40 en S5-S8. Nouveaux abonnés : 20-50 puis 40-80 par semaine. Conversations privées 5-10, devis 1-3, ventes 0-1 par semaine au début. Succès de l'opération : 3 ventes Khởi Đầu + 2 contrats d'entretien. En S1, le chiffre qui compte est le nombre de commentaires conformes : il dit si la mécanique est comprise.
$brief$,
  jsonb_build_array(
    jsonb_build_object(
      'cas', '« Bao nhiêu tiền? »',
      'cas_fr', 'Combien ça coûte ?',
      'reponse', 'Phần thiết kế và lập trình (4.900.000₫) mình tặng ạ. Anh/chị chỉ trả phí mở dịch vụ 50 USD (~1.300.000₫) một lần và tự mua tên miền đứng tên mình (~300.000₫/năm). Không có phí hằng tháng, không có phí ẩn ạ.'),
    jsonb_build_object(
      'cas', '« Có thật không? »',
      'cas_fr', 'C''est vrai ?',
      'reponse', 'Thật ạ. Mình có 17 mẫu đã làm xong, link ở bình luận ghim, anh/chị bấm vào xem được ngay. Tuần sau mình sẽ đăng ảnh trước/sau của quán đầu tiên.'),
    jsonb_build_object(
      'cas', '« Làm cho tôi luôn được không? »',
      'cas_fr', 'Vous pouvez faire le mien tout de suite ?',
      'reponse', 'Dạ được ạ! Anh/chị bình luận tên quán + địa chỉ để tham gia tuần này. Còn nếu không muốn chờ, nhắn Zalo zalo.me/33749775654 mình báo giá gói Khởi Đầu 4.900.000₫, làm trong 5 ngày ạ.'),
    jsonb_build_object(
      'cas', '« Chắc lừa đảo »',
      'cas_fr', 'Le sceptique : « c''est une arnaque »',
      'reponse', 'Em hiểu vì sao anh/chị nghĩ vậy, trên Facebook đúng là nhiều vụ thật. Nên em ghi rõ hết: em không cầm tiền tên miền của ai, thể lệ công khai ở đây vn.neuraweb.fr/qua-tang, và 17 mẫu web em làm anh/chị xem được ngay bây giờ. Anh/chị cứ xem trước rồi tính ạ.'),
    jsonb_build_object(
      'cas', 'Pas un commerce',
      'cas_fr', 'Hors cible (particulier, pas d''établissement)',
      'reponse', 'Cảm ơn bạn đã quan tâm nha! Chương trình này dành cho cơ sở kinh doanh có địa điểm thật ở Hà Nội. Nếu bạn biết quán nào đang cần, cứ gửi bài này cho họ nhé 🙏'),
    jsonb_build_object(
      'cas', 'Message privé aux non-retenus (dimanche soir)',
      'cas_fr', 'À envoyer en Messenger dans l''heure qui suit l''annonce. Remplacer [tên] et [tên cơ sở khác].',
      'reponse', E'Chào anh/chị [tên], cảm ơn anh/chị đã tham gia tuần này. Tuần này mình chọn [tên cơ sở khác], nhưng thứ Hai tuần sau anh/chị tham gia lại được ạ.\n\nTrong lúc chờ, mình có hai đề nghị:\n• Nếu anh/chị làm gói Khởi Đầu (4.900.000₫ — có thực đơn/bảng giá, hồ sơ Google Maps) trong 7 ngày tới: mình TẶNG phí mở dịch vụ 50 USD và 3 ảnh chụp quán.\n• Nếu anh/chị chỉ muốn một lời tư vấn thật lòng về trang Facebook hiện tại: 15 phút trên Zalo, miễn phí, không mời chào.\n\nAnh/chị chọn cái nào cũng được ạ 🙏')
  ),
  'https://vn.neuraweb.fr/qua-tang',
  date '2026-09-28',
  date '2026-11-22',
  'active',
  jsonb_build_object(
    'commentaires_conformes_semaine', 15,
    'nouveaux_abonnes_semaine', jsonb_build_array(20, 50),
    'conversations_semaine', jsonb_build_array(5, 10),
    'devis_semaine', jsonb_build_array(1, 3),
    'ventes_objectif_campagne', 3,
    'contrats_entretien_objectif', 2
  )
)
on conflict (slug) do nothing;

-- Les 8 semaines du calendrier publié (angles de OFFRE-JEU-FACEBOOK.md §5).
insert into editorial.campagne_semaines (campagne_id, semaine_numero, date_debut, date_fin, angle)
select c.id, s.n, s.d1, s.d2, s.angle
from editorial.campagnes c
cross join (values
  (1, date '2026-09-28', date '2026-10-04', 'Lancement'),
  (2, date '2026-10-05', date '2026-10-11', 'Hà Nội — 10/10, Libération de la capitale'),
  (3, date '2026-10-12', date '2026-10-18', 'Avant/après du gagnant S1 (accroche B à tester)'),
  (4, date '2026-10-19', date '2026-10-25', '20/10, Journée de la femme vietnamienne — salons, spas, boutiques tenues par des femmes'),
  (5, date '2026-10-26', date '2026-11-01', 'Cafés & quán ăn'),
  (6, date '2026-11-02', date '2026-11-08', 'Boutiques'),
  (7, date '2026-11-09', date '2026-11-15', 'Homestays'),
  (8, date '2026-11-16', date '2026-11-22', 'Dernière semaine des 8 premières — prolongation possible ensuite')
) as s(n, d1, d2, angle)
where c.slug = 'moi-tuan-mot-trang-2026'
on conflict (campagne_id, semaine_numero) do nothing;

-- Post de lancement S1 (texte validé de OFFRE-JEU-FACEBOOK.vi.md §2), pour
-- pouvoir le rattacher au post réellement publié le 28/09 (« Lier un post »)
-- et suivre ses commentaires = les candidatures de la semaine 1.
insert into editorial.campagne_publications
  (campagne_id, semaine_numero, date_prevue, heure_prevue, role, format, titre, texte_publication,
   traduction_fr, commentaire_epingle, texte_visuel, visuel_type, brief_photo, format_visuel, hashtags,
   objectif, checklist, statut, genere_par, note_humain)
select
  c.id, 1, date '2026-09-28', '20:00', 'appel', 'image',
  'S1 — Post de lancement (accroche A)',
  $post$TẶNG MỘT TRANG WEB. MỖI TUẦN. CHO MỘT QUÁN Ở HÀ NỘI.

Trị giá 4.900.000₫ — Neuraweb tặng.

🎨 Thiết kế riêng cho quán của anh/chị, không phải mẫu dùng chung
📱 Ảnh quán, giờ mở cửa, bản đồ chỉ đường — mở nhanh trên điện thoại
📞 Nút Gọi – Zalo – Messenger luôn hiện trên màn hình
🔳 Mã QR khổ A5 để dán ở quầy
⏱️ Bàn giao trong 7 ngày

Mình là [Tên], lập trình viên người Pháp sống ở Hà Nội. Mình mới bắt đầu ở đây và cần 8 công trình thật — nên trong 8 tuần, mỗi tuần mình chọn một cơ sở kinh doanh ở Hà Nội và làm tặng trọn bộ một trang web.

📝 Tham gia — 2 bước. KHÔNG cần chia sẻ, KHÔNG cần tag ai:
1️⃣ Theo dõi trang Neuraweb
2️⃣ Bình luận: Tên cơ sở – Địa chỉ (hoặc link Google Maps) – Một câu: vì sao quán này xứng đáng có một trang web

🎯 Tối Chủ Nhật 20h mình công bố cơ sở được chọn. Xét chọn theo tiêu chí, không bốc thăm may rủi.

📄 Điều kiện: phần thiết kế và lập trình (4.900.000₫) được tặng. Phí mở dịch vụ 50 USD và tên miền do cơ sở được chọn tự trả. Chi tiết: vn.neuraweb.fr/qua-tang#dieu-kien

📸 17 mẫu web mình đã làm — link ở bình luận ghim.

Chương trình do Neuraweb tổ chức, không liên kết và không được Facebook/Meta tài trợ hay quản lý.

#HaNoi #ThietKeWebsite #QuanCafeHaNoi #TiemTocHaNoi #KinhDoanhHaNoi #ChuQuanHaNoi$post$,
  $fr$OFFRIR UNE PAGE WEB. CHAQUE SEMAINE. À UN COMMERCE DE HANOÏ.

Valeur 4.900.000₫ — offert par Neuraweb.

🎨 Un design fait pour votre commerce, pas un modèle partagé
📱 Photos du lieu, horaires, carte d'itinéraire — rapide à ouvrir sur téléphone
📞 Boutons Appeler – Zalo – Messenger toujours visibles à l'écran
🔳 QR code A5 à coller au comptoir
⏱️ Livré en 7 jours

Je suis [Prénom], développeur français installé à Hanoï. Je démarre ici et j'ai besoin de 8 réalisations réelles — alors pendant 8 semaines, chaque semaine je choisis un commerce de Hanoï et je lui offre une page web complète.

📝 Participer — 2 étapes. PAS besoin de partager, PAS besoin de taguer qui que ce soit :
1️⃣ Suivre la page Neuraweb
2️⃣ Commenter : Nom du commerce – Adresse (ou lien Google Maps) – Une phrase : pourquoi ce commerce mérite une page web

🎯 Dimanche soir à 20h, j'annonce le commerce choisi. Sélection sur critères, pas de tirage au sort.

📄 Conditions : la conception et le développement (4.900.000₫) sont offerts. Les frais de mise en service de 50 USD et le nom de domaine sont à la charge du commerce choisi. Détails : vn.neuraweb.fr/qua-tang#dieu-kien

📸 17 modèles de sites que j'ai réalisés — lien en commentaire épinglé.

Opération organisée par Neuraweb, sans lien avec Facebook/Meta, ni parrainée ni gérée par eux.$fr$,
  $pin$📸 17 mẫu web THẬT mình đã làm cho quán và cửa hàng ở Hà Nội — xem trực tiếp tại: vn.neuraweb.fr/packs
📄 Thể lệ đầy đủ, ghi rõ từng đồng: vn.neuraweb.fr/qua-tang
💬 Zalo mình: zalo.me/33749775654 — anh chị hỏi gì cứ hỏi, mình không giấu giá.$pin$,
  $vis$TẶNG 1 TRANG WEB
4.900.000₫
MỖI TUẦN · 1 QUÁN Ở HÀ NỘI
[logo Neuraweb]   8 tuần · 28/09 → 22/11
* Phí mở dịch vụ và tên miền do khách tự trả. Xem điều kiện.$vis$,
  'photo_reelle',
  'Photo réelle d''un café ou d''un salon de Hanoï, prise par toi au téléphone, idéalement avec un téléphone visible à l''écran montrant une page web. Fond clair, lumière naturelle, tiers supérieur dégagé pour le texte. Jamais de photo de stock.',
  '4:5',
  '#HaNoi #ThietKeWebsite #QuanCafeHaNoi #TiemTocHaNoi #KinhDoanhHaNoi #ChuQuanHaNoi',
  'Lancer l''opération : obtenir au moins 15 commentaires conformes avant le dimanche 04/10.',
  jsonb_build_object(
    'vocabulaire_interdit_absent', true,
    'pas_de_partage_ni_tag_exige', true,
    'chiffres_de_la_grille_uniquement', true,
    'conditions_presentes', true,
    'mention_meta', true,
    'pas_de_fausse_urgence', true,
    'aucun_temoignage_invente', true,
    'pas_de_4_isole', true,
    'relecture_native_requise', true
  ),
  'valide',
  'humain',
  'Texte validé du dossier OFFRE-JEU-FACEBOOK.vi.md. S''il est déjà en ligne depuis le 28/09 : « Publié ailleurs », puis « Lier le post Facebook » pour suivre ses commentaires (les candidatures de la semaine 1).'
from editorial.campagnes c
where c.slug = 'moi-tuan-mot-trang-2026'
  and not exists (
    select 1 from editorial.campagne_publications p
    where p.campagne_id = c.id and p.semaine_numero = 1 and p.role = 'appel'
  );
