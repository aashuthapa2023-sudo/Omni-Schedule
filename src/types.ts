export type AspectRatio = '1:1' | '4:5' | '9:16' | '16:9';

export interface PageTemplateCustomization {
  templateId?: string;
  fontFamily?: string;
  fontSize?: number; // In px e.g. 20 to 72
  fontWeight?: '300' | '400' | '600' | '700' | '900';
  fontStyle?: 'normal' | 'italic';
  textAlign?: 'left' | 'center' | 'right';
  textColor?: string;
  lineHeight?: number; // 1.1 to 2.2
  letterSpacing?: number; // -1 to 8
  verticalOffset?: number; // -180 to +180
  verticalPosition?: 'top' | 'center' | 'bottom';
  authorColor?: string;
  authorFontSize?: number;
  overlayOpacity?: number; // 0 to 1
  vignetteStrength?: number; // 0 to 1
  overlayType?: 'gradient-bottom' | 'radial-vignette' | 'dark-blur' | 'tint-solid' | 'cinematic-cinemascope' | 'paper-texture';
  dropShadow?: boolean;
  dropShadowBlur?: number;
  accentColor?: string;
}

export interface FacebookPage {
  id: string;
  name: string;
  handle: string;
  niche: string;
  nicheCategory: 'atheism' | 'stoicism' | 'science' | 'cyberpunk' | 'existentialism' | 'mindfulness' | 'military' | 'poetry' | 'hollywood' | 'gym' | 'sigma' | 'academia' | 'nature' | 'custom';
  fbPageId?: string; // Facebook Graph Page ID (e.g. 1048291048)
  fbPageAccessToken?: string; // Facebook Page Access Token (e.g. EAAB...)
  brandName?: string; // Brand name used for headers/watermarks (defaults to page name)
  autoPilotEnabled?: boolean; // Autopilot master switch
  preferredPostingHours?: number[]; // e.g. [9, 13, 18, 21]
  avatarUrl: string;
  coverColor: string;
  brandColor: string;
  defaultTemplateId: string;
  templateCustomization?: PageTemplateCustomization;
  watermarkText: string;
  watermarkPosition: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'bottom-center';
  watermarkOpacity: number;
  postingCadence: {
    postsPerDay: number;
    preferredTimes: string[]; // e.g. ["09:00", "15:00", "21:00"]
    autoScheduleEnabled: boolean;
  };
  connectedStatus: 'active' | 'demo' | 'disconnected';
  tokenVerified?: boolean;
  lastRefillDate?: string;
  createdAt: string;
}

export interface Quote {
  id: string;
  quote: string;
  author: string;
  niche: string;
  pageId?: string; // If specific to one page, or undefined for global
  tags: string[];
  mood: string;
  isFavorite?: boolean;
  usedCount: number;
  source?: string;
  createdAt: string;
}

export interface QuoteTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  fontFamily: string;
  fontSize: number; // base size
  lineHeight: number;
  letterSpacing: number;
  fontStyle: 'normal' | 'italic';
  fontWeight: '300' | '400' | '600' | '700' | '900';
  textAlign: 'center' | 'left' | 'right';
  quoteMarkStyle: 'classic-giant' | 'modern-accent' | 'minimal-quotes' | 'none' | 'subtle-corner';
  authorStyle: 'serif-italic' | 'sans-caps-spaced' | 'mono-dash' | 'gold-accent' | 'pill-badge' | 'tactical-gold-tag' | 'typewriter-minimal' | 'typewriter-tag';
  authorPrefix: string; // e.g. "— ", "BY ", "~ "
  overlayType: 'gradient-bottom' | 'radial-vignette' | 'dark-blur' | 'tint-solid' | 'cinematic-cinemascope' | 'paper-texture';
  overlayColor: string;
  overlayOpacity: number;
  vignetteStrength: number;
  defaultImageUrl?: string;
  cardBackground?: {
    enabled: boolean;
    color: string;
    opacity: number;
    blur: number;
    borderRadius: number;
    borderWidth: number;
    borderColor: string;
  };
  textColor: string;
  accentColor: string;
  dropShadow: boolean;
  dropShadowBlur: number;
  borderOrnament: 'none' | 'double-frame' | 'corner-accents' | 'top-bottom-lines' | 'gold-border' | 'tactical-brackets' | 'military-stencil-frame';
}

export interface TypographyCustomization {
  fontFamily?: string;
  fontSize?: number; // In px e.g. 24 to 68
  fontWeight?: '300' | '400' | '600' | '700' | '900';
  fontStyle?: 'normal' | 'italic';
  textAlign?: 'left' | 'center' | 'right';
  textColor?: string;
  lineHeight?: number; // 1.2 to 2.2
  letterSpacing?: number; // -1 to 4
  verticalOffset?: number; // -150 to +150
  verticalPosition?: 'top' | 'center' | 'bottom';
  authorColor?: string;
  authorFontSize?: number;
  overlayOpacity?: number;
  overlayType?: 'vignette' | 'gradient-bottom' | 'solid-dark' | 'none';
  vignetteStrength?: number;
  accentColor?: string;
  dropShadow?: boolean;
  dropShadowBlur?: number;
}

export interface ScheduledPost {
  id: string;
  pageId: string;
  quoteId?: string;
  quoteText: string;
  author: string;
  subTopic?: string;
  hookLine?: string;
  firstComment?: string;
  brandWatermark?: string;
  renderedImageUrl: string;
  rawImageUrl: string;
  imagePrompt: string;
  caption: string;
  hashtags: string[];
  templateId: string;
  typography?: TypographyCustomization;
  aspectRatio: AspectRatio;
  scheduledTime: string; // ISO string
  status: 'scheduled' | 'published' | 'draft' | 'failed';
  metrics?: {
    likes: number;
    comments: number;
    shares: number;
    reach: number;
  };
  publishedAt?: string;
  createdAt: string;
}

export interface AestheticStyle {
  id: string;
  name: string;
  niche: string;
  promptModifier: string;
  negativeModifier: string;
  recommendedAspect: AspectRatio;
  previewUrl: string;
  tags: string[];
}

export interface SubTopic {
  id: string;
  name: string;
  description: string;
  keywords: string[];
}

export type PostingHabitPreset = 'hourly-24' | 'hourly-waking' | 'peak-3' | 'peak-4' | 'steady-2' | 'custom';

export interface AutoPilotPageConfig {
  pageId: string;
  enabled: boolean;
  targetBufferDays: number; // e.g. 1, 3, 7, 14, 30 days
  postingHabit: PostingHabitPreset;
  postsPerDay: number;
  preferredHours: number[]; // e.g. [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]
  subTopics: string[]; // List of rotated topic themes
  usedQuoteSignatures: string[]; // SHA/Normalized text fingerprints to prevent duplicates
  usedImageSeeds: number[];
  templateRotation: string[]; // List of template IDs to cycle through
  aspectRatioPreference: AspectRatio;
  lastRefillAt?: string;
}

export interface FactoryLog {
  id: string;
  timestamp: string;
  pageId: string;
  pageName: string;
  action: 'auto_refill' | 'scheduled_post' | 'dedup_verified' | 'batch_generated';
  quoteSnippet: string;
  author: string;
  subTopic: string;
  seed: number;
  scheduledFor: string;
  hookSnippet?: string;
}

export interface FactoryStats {
  totalUniqueQuotesIndexed: number;
  totalUniqueImagesSynthesized: number;
  zeroDuplicatesEnforced: number;
  totalBufferedPosts: number;
  totalDaysProtected: number;
  apiCallsSaved: number;
  dailyApiConsumptionEstimate: number;
}

export interface TelegramConfig {
  botToken: string;
  chatId: string;
  enabled: boolean;
  notifyOnPublish: boolean;
  notifyOnSchedule: boolean;
  notifyOnError: boolean;
  connectedBotUsername?: string;
  lastTestedAt?: string;
}

export interface FacebookLivePost {
  id: string;
  message?: string;
  created_time: string;
  full_picture?: string;
  permalink_url?: string;
  likesCount?: number;
  commentsCount?: number;
  sharesCount?: number;
  is_published?: boolean;
}

export interface FacebookLivePageDetails {
  id: string;
  name: string;
  fan_count?: number;
  followers_count?: number;
  pictureUrl?: string;
  about?: string;
  link?: string;
}
