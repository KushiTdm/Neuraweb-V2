// ============================================================
// lib/analytics-core.ts
// Accès serveur à Google Search Console (GSC) + GA4 Data API via un
// compte de service. Logique d'auth JWT RS256 portée depuis
// scripts/analyze-site.js (même service account / mêmes scopes).
//
// Clé de service :
//   - Local : fichier `neuraweb-indexation-859fd0c7dfeb.json` à la racine
//     project/ (ou chemin GOOGLE_SERVICE_ACCOUNT_KEY_PATH).
//   - Vercel/prod : variable GOOGLE_SERVICE_ACCOUNT_JSON (JSON brut ou base64)
//     — le fichier .json est gitignored et absent du déploiement.
// ============================================================

import crypto from "crypto";
import fs from "fs";
import path from "path";

const TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token";
const GSC_SCOPE = "https://www.googleapis.com/auth/webmasters.readonly";
const GA4_SCOPE = "https://www.googleapis.com/auth/analytics.readonly";
const SITE_URL = "sc-domain:neuraweb.fr";
const GA4_PROPERTY_ID = process.env.GA4_PROPERTY_ID || "517812956";

interface ServiceAccount {
  client_email: string;
  private_key: string;
}

let saCache: ServiceAccount | null = null;

function loadServiceAccount(): ServiceAccount | null {
  if (saCache) return saCache;

  // 1) Variable d'env (prod) — JSON brut ou base64
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (raw) {
    try {
      const json = raw.trim().startsWith("{")
        ? raw
        : Buffer.from(raw, "base64").toString("utf8");
      saCache = JSON.parse(json);
      return saCache;
    } catch (e) {
      console.error("[analytics-core] GOOGLE_SERVICE_ACCOUNT_JSON invalide:", e);
      return null;
    }
  }

  // 2) Fichier local (dev)
  const keyPath =
    process.env.GOOGLE_SERVICE_ACCOUNT_KEY_PATH ||
    path.join(process.cwd(), "neuraweb-indexation-859fd0c7dfeb.json");
  try {
    if (fs.existsSync(keyPath)) {
      saCache = JSON.parse(fs.readFileSync(keyPath, "utf8"));
      return saCache;
    }
  } catch (e) {
    console.error("[analytics-core] lecture clé service échouée:", e);
  }
  console.warn("[analytics-core] aucun compte de service Google disponible.");
  return null;
}

function base64url(input: string | Buffer): string {
  return Buffer.from(input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function buildJWT(sa: ServiceAccount, scope: string): string {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "RS256", typ: "JWT" };
  const claim = { iss: sa.client_email, scope, aud: TOKEN_ENDPOINT, exp: now + 3600, iat: now };
  const unsigned = `${base64url(JSON.stringify(header))}.${base64url(JSON.stringify(claim))}`;
  const sig = crypto.createSign("RSA-SHA256").update(unsigned).sign(sa.private_key);
  return `${unsigned}.${base64url(sig)}`;
}

const tokenCache = new Map<string, { token: string; exp: number }>();

async function getToken(scope: string): Promise<string | null> {
  const cached = tokenCache.get(scope);
  if (cached && cached.exp > Date.now() + 60_000) return cached.token;

  const sa = loadServiceAccount();
  if (!sa) return null;

  const jwt = buildJWT(sa, scope);
  const body = new URLSearchParams({
    grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
    assertion: jwt,
  }).toString();

  const res = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  const json = await res.json();
  if (!res.ok || !json.access_token) {
    console.error("[analytics-core] auth Google échouée:", res.status, json);
    return null;
  }
  tokenCache.set(scope, { token: json.access_token, exp: Date.now() + 3500_000 });
  return json.access_token;
}

function dateRange(days: number): { startDate: string; endDate: string } {
  const today = new Date();
  const endDate = today.toISOString().split("T")[0];
  const start = new Date(today);
  start.setDate(start.getDate() - days);
  return { startDate: start.toISOString().split("T")[0], endDate };
}

// ── GSC ─────────────────────────────────────────────────────
async function gscQuery(token: string, dimensions: string[], range: { startDate: string; endDate: string }) {
  const url = `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(
    SITE_URL,
  )}/searchAnalytics/query`;
  const res = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ ...range, dimensions, rowLimit: 1000 }),
  });
  if (!res.ok) {
    console.error("[analytics-core] GSC error", res.status, await res.text().catch(() => ""));
    return [];
  }
  const data = await res.json();
  return (data.rows || []) as Array<{ keys?: string[]; clicks: number; impressions: number; ctr: number; position: number }>;
}

// ── GA4 ─────────────────────────────────────────────────────
async function ga4Query(
  token: string,
  dimensions: string[],
  metrics: string[],
  range: { startDate: string; endDate: string },
  limit = 200,
) {
  const url = `https://analyticsdata.googleapis.com/v1beta/properties/${GA4_PROPERTY_ID}:runReport`;
  const res = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      dateRanges: [range],
      dimensions: dimensions.map((name) => ({ name })),
      metrics: metrics.map((name) => ({ name })),
      limit,
    }),
  });
  if (!res.ok) {
    console.error("[analytics-core] GA4 error", res.status, await res.text().catch(() => ""));
    return null;
  }
  return res.json();
}

export interface AnalyticsSummary {
  available: boolean;
  days: number;
  range: { startDate: string; endDate: string };
  totals: { pageViews: number; sessions: number; activeUsers: number; engagementRate: number };
  byDevice: Array<{ device: string; sessions: number; engagementRate: number }>;
  topPages: Array<{ path: string; views: number }>;
  blogPosts: Array<{ path: string; views: number }>;
  search: { clicks: number; impressions: number; ctr: number; position: number };
  topQueries: Array<{ query: string; clicks: number; impressions: number; position: number }>;
}

function emptySummary(days: number, range: { startDate: string; endDate: string }): AnalyticsSummary {
  return {
    available: false,
    days,
    range,
    totals: { pageViews: 0, sessions: 0, activeUsers: 0, engagementRate: 0 },
    byDevice: [],
    topPages: [],
    blogPosts: [],
    search: { clicks: 0, impressions: 0, ctr: 0, position: 0 },
    topQueries: [],
  };
}

// Cache process-local (6 h) par fenêtre de jours.
const summaryCache = new Map<number, { at: number; data: AnalyticsSummary }>();
const TTL = 6 * 60 * 60 * 1000;

/** Résumé d'activité agrégé GSC + GA4 pour les `days` derniers jours. */
export async function getAnalyticsSummary(days = 28): Promise<AnalyticsSummary> {
  const cached = summaryCache.get(days);
  if (cached && Date.now() - cached.at < TTL) return cached.data;

  const range = dateRange(days);

  const [gscToken, ga4Token] = await Promise.all([getToken(GSC_SCOPE), getToken(GA4_SCOPE)]);
  if (!gscToken && !ga4Token) return emptySummary(days, range);

  const summary = emptySummary(days, range);
  summary.available = true;

  // GA4
  if (ga4Token) {
    const [totalsRes, pagesRes, deviceRes] = await Promise.all([
      ga4Query(ga4Token, [], ["screenPageViews", "sessions", "activeUsers", "engagementRate"], range, 1),
      ga4Query(ga4Token, ["pagePath"], ["screenPageViews"], range, 50),
      ga4Query(ga4Token, ["deviceCategory"], ["sessions", "engagementRate"], range, 10),
    ]);

    const t = totalsRes?.rows?.[0]?.metricValues;
    if (t) {
      summary.totals = {
        pageViews: Number(t[0]?.value || 0),
        sessions: Number(t[1]?.value || 0),
        activeUsers: Number(t[2]?.value || 0),
        engagementRate: Number(t[3]?.value || 0),
      };
    }

    const pages = (pagesRes?.rows || []).map((r: any) => ({
      path: r.dimensionValues?.[0]?.value || "",
      views: Number(r.metricValues?.[0]?.value || 0),
    }));
    summary.topPages = pages.slice(0, 15);
    summary.blogPosts = pages.filter((p: { path: string }) => p.path.includes("/blog/")).slice(0, 15);

    summary.byDevice = (deviceRes?.rows || []).map((r: any) => ({
      device: r.dimensionValues?.[0]?.value || "",
      sessions: Number(r.metricValues?.[0]?.value || 0),
      engagementRate: Number(r.metricValues?.[1]?.value || 0),
    }));
  }

  // GSC
  if (gscToken) {
    const [totals, queries] = await Promise.all([
      gscQuery(gscToken, [], range),
      gscQuery(gscToken, ["query"], range),
    ]);
    if (totals[0]) {
      summary.search = {
        clicks: totals[0].clicks,
        impressions: totals[0].impressions,
        ctr: totals[0].ctr,
        position: totals[0].position,
      };
    }
    summary.topQueries = queries
      .slice(0, 15)
      .map((r) => ({
        query: r.keys?.[0] || "",
        clicks: r.clicks,
        impressions: r.impressions,
        position: r.position,
      }));
  }

  summaryCache.set(days, { at: Date.now(), data: summary });
  return summary;
}

/** Version texte compacte du snapshot, pour injection dans le prompt IA. */
export function summarizeForPrompt(s: AnalyticsSummary): string {
  if (!s.available) return "Analytics indisponible (compte de service non configuré).";
  const top = s.topPages.slice(0, 5).map((p) => `${p.path} (${p.views})`).join(", ");
  const blog = s.blogPosts.slice(0, 5).map((p) => `${p.path} (${p.views})`).join(", ");
  const q = s.topQueries.slice(0, 5).map((x) => `"${x.query}" (${x.clicks} clics, pos ${x.position.toFixed(1)})`).join(", ");
  return [
    `Période : ${s.days} derniers jours.`,
    `Trafic : ${s.totals.pageViews} pages vues, ${s.totals.sessions} sessions, ${s.totals.activeUsers} utilisateurs, engagement ${(s.totals.engagementRate * 100).toFixed(0)}%.`,
    `Search Console : ${s.search.clicks} clics, ${s.search.impressions} impressions, CTR ${(s.search.ctr * 100).toFixed(1)}%, position moyenne ${s.search.position.toFixed(1)}.`,
    top && `Top pages : ${top}.`,
    blog && `Top articles blog : ${blog}.`,
    q && `Top requêtes : ${q}.`,
  ]
    .filter(Boolean)
    .join("\n");
}
