import {
  FacebookPage,
  Quote,
  QuoteTemplate,
  ScheduledPost,
  AutoPilotPageConfig,
  FactoryLog,
  FactoryStats,
  PostingHabitPreset,
  AspectRatio,
  TelegramConfig,
} from '../types';
import { DEFAULT_PAGES, DEFAULT_QUOTES, DEFAULT_TEMPLATES, DEFAULT_AUTOPILOT_CONFIGS } from '../data/defaultData';

const STORAGE_KEYS = {
  PAGES: 'omniniche_pages_v1',
  QUOTES: 'omniniche_quotes_v1',
  TEMPLATES: 'omniniche_templates_v1',
  SCHEDULED_POSTS: 'omniniche_scheduled_posts_v1',
  ACTIVE_PAGE_ID: 'omniniche_active_page_id_v1',
  AUTOPILOT_CONFIGS: 'omniniche_autopilot_configs_v1',
  FACTORY_LOGS: 'omniniche_factory_logs_v1',
  GLOBAL_QUOTE_SIGNATURES: 'omniniche_global_quote_signatures_v1',
  TELEGRAM_CONFIG: 'omniniche_telegram_config_v1',
};

// --- DEDUPLICATION ENGINE ---

export function normalizeQuoteText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/gi, '') // strip punctuation
    .replace(/\s+/g, ' ')
    .trim();
}

export function getQuoteSignature(quote: string, author?: string): string {
  const normQuote = normalizeQuoteText(quote);
  const normAuthor = author ? normalizeQuoteText(author) : '';
  return `${normQuote}__${normAuthor}`;
}

export function getAllUsedSignatures(pageId?: string): Set<string> {
  const signatures = new Set<string>();

  // 1. From stored scheduled posts
  const posts = getStoredScheduledPosts();
  posts.forEach((p) => {
    if (!pageId || p.pageId === pageId) {
      signatures.add(getQuoteSignature(p.quoteText, p.author));
      signatures.add(normalizeQuoteText(p.quoteText));
    }
  });

  // 2. From autopilot configs
  const configs = getAutoPilotConfigs();
  if (pageId && configs[pageId]?.usedQuoteSignatures) {
    configs[pageId].usedQuoteSignatures.forEach((s) => signatures.add(s));
  } else {
    Object.values(configs).forEach((cfg) => {
      cfg.usedQuoteSignatures?.forEach((s) => signatures.add(s));
    });
  }

  // 3. From global signatures storage
  try {
    const rawGlobal = localStorage.getItem(STORAGE_KEYS.GLOBAL_QUOTE_SIGNATURES);
    if (rawGlobal) {
      const parsed: string[] = JSON.parse(rawGlobal);
      parsed.forEach((s) => signatures.add(s));
    }
  } catch (e) {
    // ignore
  }

  return signatures;
}

export function isQuoteDuplicate(quote: string, author?: string, pageId?: string): boolean {
  const fullSig = getQuoteSignature(quote, author);
  const normText = normalizeQuoteText(quote);
  const used = getAllUsedSignatures(pageId);

  return used.has(fullSig) || used.has(normText);
}

export function recordUsedSignature(quote: string, author: string, pageId: string, seed?: number): void {
  const fullSig = getQuoteSignature(quote, author);
  const normText = normalizeQuoteText(quote);

  // Update Page Autopilot Config
  const configs = getAutoPilotConfigs();
  const pageConfig = configs[pageId] || {
    pageId,
    enabled: true,
    targetBufferDays: 14,
    postingHabit: 'peak-3' as PostingHabitPreset,
    postsPerDay: 3,
    preferredHours: [9, 15, 21],
    subTopics: [],
    usedQuoteSignatures: [],
    usedImageSeeds: [],
    templateRotation: ['modern-editorial', 'minimal-sans', 'glassmorphic'],
    aspectRatioPreference: '1:1',
  };

  if (!pageConfig.usedQuoteSignatures) pageConfig.usedQuoteSignatures = [];
  if (!pageConfig.usedQuoteSignatures.includes(normText)) {
    pageConfig.usedQuoteSignatures.push(normText);
  }
  if (!pageConfig.usedQuoteSignatures.includes(fullSig)) {
    pageConfig.usedQuoteSignatures.push(fullSig);
  }
  if (seed && (!pageConfig.usedImageSeeds || !pageConfig.usedImageSeeds.includes(seed))) {
    if (!pageConfig.usedImageSeeds) pageConfig.usedImageSeeds = [];
    pageConfig.usedImageSeeds.push(seed);
  }

  configs[pageId] = pageConfig;
  saveAutoPilotConfigs(configs);

  // Update Global Signatures
  try {
    const rawGlobal = localStorage.getItem(STORAGE_KEYS.GLOBAL_QUOTE_SIGNATURES);
    const parsed: string[] = rawGlobal ? JSON.parse(rawGlobal) : [];
    if (!parsed.includes(normText)) parsed.push(normText);
    if (!parsed.includes(fullSig)) parsed.push(fullSig);
    localStorage.setItem(STORAGE_KEYS.GLOBAL_QUOTE_SIGNATURES, JSON.stringify(parsed));
  } catch (e) {
    // ignore
  }
}

// --- AUTOPILOT CONFIGS & FACTORY STATS ---

export function getAutoPilotConfigs(): Record<string, AutoPilotPageConfig> {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.AUTOPILOT_CONFIGS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.AUTOPILOT_CONFIGS, JSON.stringify(DEFAULT_AUTOPILOT_CONFIGS));
      return DEFAULT_AUTOPILOT_CONFIGS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse autopilot configs from storage', e);
    return DEFAULT_AUTOPILOT_CONFIGS;
  }
}

export function saveAutoPilotConfigs(configs: Record<string, AutoPilotPageConfig>): void {
  localStorage.setItem(STORAGE_KEYS.AUTOPILOT_CONFIGS, JSON.stringify(configs));
}

export function updateAutoPilotConfig(pageId: string, updates: Partial<AutoPilotPageConfig>): void {
  const configs = getAutoPilotConfigs();
  configs[pageId] = {
    ...(configs[pageId] || {
      pageId,
      enabled: true,
      targetBufferDays: 14,
      postingHabit: 'peak-3' as PostingHabitPreset,
      postsPerDay: 3,
      preferredHours: [9, 15, 21],
      subTopics: [],
      usedQuoteSignatures: [],
      usedImageSeeds: [],
      templateRotation: ['modern-editorial', 'classical-marble', 'minimal-sans'],
      aspectRatioPreference: '1:1',
    }),
    ...updates,
  };
  saveAutoPilotConfigs(configs);
}

// --- FACTORY LOGS ---

export function getFactoryLogs(): FactoryLog[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.FACTORY_LOGS);
    if (!raw) {
      const initialLogs: FactoryLog[] = [
        {
          id: 'log-1',
          timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
          pageId: 'page-atheism',
          pageName: 'The Rational Void',
          action: 'auto_refill',
          quoteSnippet: 'The cosmos is within us...',
          author: 'Carl Sagan',
          subTopic: 'Cosmic Insignificance & Human Reason',
          seed: 421098,
          scheduledFor: new Date(Date.now() + 3600000 * 24).toISOString(),
        },
        {
          id: 'log-2',
          timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
          pageId: 'page-stoic',
          pageName: 'The Stoic Citadel',
          action: 'dedup_verified',
          quoteSnippet: 'You have power over your mind...',
          author: 'Marcus Aurelius',
          subTopic: 'Dichotomy of Control (Epictetus)',
          seed: 551923,
          scheduledFor: new Date(Date.now() + 3600000 * 48).toISOString(),
        },
      ];
      localStorage.setItem(STORAGE_KEYS.FACTORY_LOGS, JSON.stringify(initialLogs));
      return initialLogs;
    }
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

export function addFactoryLog(log: Omit<FactoryLog, 'id' | 'timestamp'>): void {
  const logs = getFactoryLogs();
  const newLog: FactoryLog = {
    ...log,
    id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    timestamp: new Date().toISOString(),
  };
  logs.unshift(newLog);
  // Keep max 100 logs
  if (logs.length > 100) logs.length = 100;
  localStorage.setItem(STORAGE_KEYS.FACTORY_LOGS, JSON.stringify(logs));
}

export function clearFactoryLogs(): void {
  localStorage.setItem(STORAGE_KEYS.FACTORY_LOGS, JSON.stringify([]));
}

export function getPostingHabitHours(habit: PostingHabitPreset = 'peak-3', customHours?: number[]): number[] {
  switch (habit) {
    case 'hourly-24':
      // 24 slots: every hour
      return Array.from({ length: 24 }, (_, i) => i);
    case 'hourly-waking':
      // 16 slots: 8:00 AM to 11:00 PM
      return [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
    case 'peak-4':
      // 4 peak engagement windows: 9 AM, 1 PM, 5 PM, 9 PM
      return [9, 13, 17, 21];
    case 'peak-3':
      // 3 standard Facebook peak hours: 9 AM, 3 PM, 9 PM
      return [9, 15, 21];
    case 'steady-2':
      // 2 optimal morning & evening slots: 9 AM, 7 PM
      return [9, 19];
    case 'custom':
      return customHours && customHours.length > 0 ? customHours : [9, 15, 21];
    default:
      return [9, 15, 21];
  }
}

/**
 * Calculates the exact future datetime slots for a given page according to its posting habit,
 * ensuring no overlapping with already scheduled future posts.
 */
export function calculateOptimalScheduleSlots(pageId: string, count: number): Date[] {
  const configs = getAutoPilotConfigs();
  const cfg = configs[pageId];
  const habit = cfg?.postingHabit || 'peak-3';
  const hours = getPostingHabitHours(habit, cfg?.preferredHours);

  const existingPosts = getStoredScheduledPosts()
    .filter((p) => p.pageId === pageId && p.status === 'scheduled')
    .map((p) => new Date(p.scheduledTime).getTime());

  const slots: Date[] = [];
  const now = new Date();
  
  // Start from next available hour or tomorrow
  let searchDate = new Date();
  searchDate.setMinutes(0, 0, 0);

  // Look ahead up to 90 days to find open schedule slots
  for (let dayOffset = 0; dayOffset < 90 && slots.length < count; dayOffset++) {
    for (const targetHour of hours) {
      if (slots.length >= count) break;

      const slotCandidate = new Date();
      slotCandidate.setDate(now.getDate() + dayOffset);
      slotCandidate.setHours(targetHour, 0, 0, 0);

      // Must be in future (at least 15 mins from now)
      if (slotCandidate.getTime() < now.getTime() + 15 * 60 * 1000) {
        continue;
      }

      // Check if another post is already scheduled within 45 minutes of this slot
      const hasConflict = existingPosts.some(
        (existingTime) => Math.abs(existingTime - slotCandidate.getTime()) < 45 * 60 * 1000
      );

      const isAlreadyInSlots = slots.some(
        (s) => Math.abs(s.getTime() - slotCandidate.getTime()) < 45 * 60 * 1000
      );

      if (!hasConflict && !isAlreadyInSlots) {
        slots.push(slotCandidate);
        existingPosts.push(slotCandidate.getTime());
      }
    }
  }

  // Fallback if needed
  while (slots.length < count) {
    const lastSlot = slots.length > 0 ? slots[slots.length - 1] : now;
    const fallback = new Date(lastSlot.getTime() + 3 * 3600 * 1000);
    slots.push(fallback);
  }

  return slots;
}

export function getFactoryStats(): FactoryStats {
  const quotes = getStoredQuotes();
  const posts = getStoredScheduledPosts();
  const configs = getAutoPilotConfigs();

  let totalSignatures = quotes.length;
  let totalSeeds = 0;
  let totalBuffered = posts.filter((p) => p.status === 'scheduled').length;

  Object.values(configs).forEach((cfg) => {
    totalSignatures += (cfg.usedQuoteSignatures || []).length;
    totalSeeds += (cfg.usedImageSeeds || []).length;
  });

  const now = new Date();
  const futureScheduled = posts.filter((p) => p.status === 'scheduled' && new Date(p.scheduledTime) > now);
  let latestFuture = now.getTime();
  futureScheduled.forEach((p) => {
    const t = new Date(p.scheduledTime).getTime();
    if (t > latestFuture) latestFuture = t;
  });
  const totalDaysProtected = Math.max(1, Math.round((latestFuture - now.getTime()) / (1000 * 60 * 60 * 24)));

  // Batch packing optimization metrics (e.g. 6-12 quotes per API call instead of 1:1)
  const apiCallsSaved = Math.max(0, totalBuffered * 5); // 5x calls saved via batching
  const estimatedDailyPosts = Object.values(configs).reduce((acc, c) => acc + (c.postsPerDay || 3), 0);
  const dailyApiConsumptionEstimate = Math.ceil(estimatedDailyPosts / 6); // only ~4-10 calls / day out of 1500 free

  return {
    totalUniqueQuotesIndexed: Math.max(quotes.length, totalSignatures),
    totalUniqueImagesSynthesized: Math.max(posts.length, totalSeeds + posts.length),
    zeroDuplicatesEnforced: totalSignatures + totalSeeds,
    totalBufferedPosts: totalBuffered,
    totalDaysProtected,
    apiCallsSaved,
    dailyApiConsumptionEstimate,
  };
}

// --- STANDARD CORE STORAGE ---

export function getStoredPages(): FacebookPage[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PAGES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.PAGES, JSON.stringify(DEFAULT_PAGES));
      return DEFAULT_PAGES;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_KEYS.PAGES, JSON.stringify(DEFAULT_PAGES));
      return DEFAULT_PAGES;
    }
    // Return the actual stored pages directly so page deletes and custom pages are fully respected
    return parsed;
  } catch (e) {
    console.error('Failed to parse pages from storage', e);
    return DEFAULT_PAGES;
  }
}

export async function importYesterdayAllPagesConfig(): Promise<FacebookPage[]> {
  try {
    const res = await fetch('/api/pages/restore-all-configs', { method: 'POST' });
    let restoredPages = DEFAULT_PAGES;
    if (res.ok) {
      const data = await res.json();
      if (data.pages && Array.isArray(data.pages) && data.pages.length > 0) {
        restoredPages = data.pages;
      }
    }
    localStorage.setItem(STORAGE_KEYS.PAGES, JSON.stringify(restoredPages));
    localStorage.setItem(STORAGE_KEYS.AUTOPILOT_CONFIGS, JSON.stringify(DEFAULT_AUTOPILOT_CONFIGS));
    return restoredPages;
  } catch (e) {
    localStorage.setItem(STORAGE_KEYS.PAGES, JSON.stringify(DEFAULT_PAGES));
    return DEFAULT_PAGES;
  }
}

export function savePages(pages: FacebookPage[]): void {
  localStorage.setItem(STORAGE_KEYS.PAGES, JSON.stringify(pages));
  // Background sync with server
  try {
    fetch('/api/storage/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pages }),
    }).catch((e) => console.warn('Server sync background notice:', e));
  } catch (err) {
    // ignore
  }
}

export function getStoredQuotes(): Quote[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.QUOTES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.QUOTES, JSON.stringify(DEFAULT_QUOTES));
      return DEFAULT_QUOTES;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse quotes from storage', e);
    return DEFAULT_QUOTES;
  }
}

export function saveQuotes(quotes: Quote[]): void {
  localStorage.setItem(STORAGE_KEYS.QUOTES, JSON.stringify(quotes));
  try {
    fetch('/api/storage/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quotes }),
    }).catch(() => {});
  } catch (err) {
    // ignore
  }
}

export function getStoredTemplates(): QuoteTemplate[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TEMPLATES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(DEFAULT_TEMPLATES));
      return DEFAULT_TEMPLATES;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse templates from storage', e);
    return DEFAULT_TEMPLATES;
  }
}

export function saveTemplates(templates: QuoteTemplate[]): void {
  localStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(templates));
}

export function getStoredScheduledPosts(): ScheduledPost[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SCHEDULED_POSTS);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error('Failed to parse scheduled posts from storage', e);
    return [];
  }
}

export function saveScheduledPosts(posts: ScheduledPost[]): void {
  localStorage.setItem(STORAGE_KEYS.SCHEDULED_POSTS, JSON.stringify(posts));
  try {
    fetch('/api/storage/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scheduledPosts: posts }),
    }).catch(() => {});
  } catch (err) {
    // ignore
  }
}

export async function clearAllScheduledPosts(options?: {
  pageId?: string;
  status?: string;
  postIds?: string[];
}): Promise<{ success: boolean; deletedCount: number; remainingCount?: number; scheduledPosts?: ScheduledPost[] }> {
  try {
    const res = await fetch('/api/autopilot/clear-queue', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(options || {}),
    });
    const data = await res.json();
    if (data.success && Array.isArray(data.scheduledPosts)) {
      saveScheduledPosts(data.scheduledPosts);
    }
    return data;
  } catch (err) {
    console.warn('Clear queue API notice:', err);
    return { success: false, deletedCount: 0 };
  }
}

export function getStoredActivePageId(): string {
  const stored = localStorage.getItem(STORAGE_KEYS.ACTIVE_PAGE_ID);
  if (stored) return stored;
  return 'page-army-brotherhood';
}

export function saveActivePageId(id: string): void {
  localStorage.setItem(STORAGE_KEYS.ACTIVE_PAGE_ID, id);
}

export const DEFAULT_TELEGRAM_CONFIG: TelegramConfig = {
  botToken: '',
  chatId: '',
  enabled: false,
  notifyOnPublish: true,
  notifyOnSchedule: true,
  notifyOnError: true,
};

export function getTelegramConfig(): TelegramConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TELEGRAM_CONFIG);
    if (!raw) return DEFAULT_TELEGRAM_CONFIG;
    return { ...DEFAULT_TELEGRAM_CONFIG, ...JSON.parse(raw) };
  } catch (e) {
    return DEFAULT_TELEGRAM_CONFIG;
  }
}

export function saveTelegramConfig(config: TelegramConfig): void {
  localStorage.setItem(STORAGE_KEYS.TELEGRAM_CONFIG, JSON.stringify(config));
  try {
    fetch('/api/telegram/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    }).catch(() => {});
  } catch (err) {
    // ignore
  }
}

// Full State Export / Import for Cross-Environment Sync
export async function syncWithServerState(): Promise<boolean> {
  try {
    const res = await fetch('/api/storage/state');
    if (!res.ok) return false;
    const data = await res.json();
    if (data.pages && Array.isArray(data.pages) && data.pages.length > 0) {
      localStorage.setItem(STORAGE_KEYS.PAGES, JSON.stringify(data.pages));
    }
    if (data.autoPilotConfigs && Object.keys(data.autoPilotConfigs).length > 0) {
      const currentConfigs = getAutoPilotConfigs();
      const mergedConfigs = { ...DEFAULT_AUTOPILOT_CONFIGS, ...data.autoPilotConfigs, ...currentConfigs };
      localStorage.setItem(STORAGE_KEYS.AUTOPILOT_CONFIGS, JSON.stringify(mergedConfigs));
    }
    if (data.scheduledPosts && Array.isArray(data.scheduledPosts)) {
      localStorage.setItem(STORAGE_KEYS.SCHEDULED_POSTS, JSON.stringify(data.scheduledPosts));
    }
    if (data.usedSignatures && Array.isArray(data.usedSignatures)) {
      localStorage.setItem(STORAGE_KEYS.GLOBAL_QUOTE_SIGNATURES, JSON.stringify(data.usedSignatures));
    }
    if (data.telegramConfig) {
      localStorage.setItem(STORAGE_KEYS.TELEGRAM_CONFIG, JSON.stringify(data.telegramConfig));
    }
    return true;
  } catch (e) {
    console.warn('Sync with server storage skipped:', e);
    return false;
  }
}

export function exportFullEnvironmentBackup(): string {
  const backup = {
    pages: getStoredPages(),
    autoPilotConfigs: getAutoPilotConfigs(),
    scheduledPosts: getStoredScheduledPosts(),
    quotes: getStoredQuotes(),
    globalSignatures: Array.from(getAllUsedSignatures()),
    exportedAt: new Date().toISOString(),
    version: '1.2.0',
  };
  return JSON.stringify(backup, null, 2);
}

export function importFullEnvironmentBackup(jsonString: string): boolean {
  try {
    const data = JSON.parse(jsonString);
    if (data.pages && Array.isArray(data.pages)) {
      localStorage.setItem(STORAGE_KEYS.PAGES, JSON.stringify(data.pages));
    }
    if (data.autoPilotConfigs && typeof data.autoPilotConfigs === 'object') {
      localStorage.setItem(STORAGE_KEYS.AUTOPILOT_CONFIGS, JSON.stringify(data.autoPilotConfigs));
    }
    if (data.scheduledPosts && Array.isArray(data.scheduledPosts)) {
      localStorage.setItem(STORAGE_KEYS.SCHEDULED_POSTS, JSON.stringify(data.scheduledPosts));
    }
    if (data.quotes && Array.isArray(data.quotes)) {
      localStorage.setItem(STORAGE_KEYS.QUOTES, JSON.stringify(data.quotes));
    }
    if (data.globalSignatures && Array.isArray(data.globalSignatures)) {
      localStorage.setItem(STORAGE_KEYS.GLOBAL_QUOTE_SIGNATURES, JSON.stringify(data.globalSignatures));
    }
    // Sync with server immediately
    fetch('/api/storage/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pages: data.pages,
        autoPilotConfigs: data.autoPilotConfigs,
        scheduledPosts: data.scheduledPosts,
        quotes: data.quotes,
        usedSignatures: data.globalSignatures,
      }),
    }).catch(() => {});
    return true;
  } catch (err) {
    console.error('Import failed:', err);
    return false;
  }
}
