/**
 * Analytics Module - Reusable analytics wrapper
 *
 * This abstraction allows easy switching between analytics providers
 * (Mixpanel, Amplitude, PostHog, etc.) without changing app code.
 *
 * Usage:
 *   import { analytics } from '@/lib/analytics';
 *   analytics.track('video_created', { duration: 30 });
 */

type EventProperties = Record<string, string | number | boolean | null>;
type UserProperties = Record<string, string | number | boolean | null>;

// Analytics provider interface - implement for each provider
interface AnalyticsProvider {
  init: (apiKey: string) => Promise<void>;
  identify: (userId: string, properties?: UserProperties) => void;
  track: (event: string, properties?: EventProperties) => void;
  screen: (name: string, properties?: EventProperties) => void;
  reset: () => void;
}

// Console logger for development
const consoleProvider: AnalyticsProvider = {
  init: async () => {
    console.log('[Analytics] Initialized (console mode)');
  },
  identify: (userId, properties) => {
    console.log('[Analytics] Identify:', userId, properties);
  },
  track: (event, properties) => {
    console.log('[Analytics] Track:', event, properties);
  },
  screen: (name, properties) => {
    console.log('[Analytics] Screen:', name, properties);
  },
  reset: () => {
    console.log('[Analytics] Reset');
  },
};

// Current provider (default to console in development)
let currentProvider: AnalyticsProvider = consoleProvider;
let isInitialized = false;

// Event names for type safety
export const AnalyticsEvents = {
  // Onboarding
  ONBOARDING_STARTED: 'onboarding_started',
  ONBOARDING_SLIDE_VIEWED: 'onboarding_slide_viewed',
  ONBOARDING_COMPLETED: 'onboarding_completed',
  ONBOARDING_SKIPPED: 'onboarding_skipped',

  // Creation Flow
  PHOTO_SELECTED: 'photo_selected',
  PHOTO_SELECTION_CANCELLED: 'photo_selection_cancelled',
  SCRIPT_GENERATED: 'script_generated',
  SCRIPT_REGENERATED: 'script_regenerated',
  SCRIPT_EDITED: 'script_edited',
  VOICE_SELECTED: 'voice_selected',
  VIDEO_GENERATION_STARTED: 'video_generation_started',
  VIDEO_GENERATION_COMPLETED: 'video_generation_completed',
  VIDEO_GENERATION_FAILED: 'video_generation_failed',

  // Video Actions
  VIDEO_PLAYED: 'video_played',
  VIDEO_DOWNLOADED: 'video_downloaded',
  VIDEO_SHARED: 'video_shared',
  CREATE_ANOTHER_TAPPED: 'create_another_tapped',

  // Paywall
  PAYWALL_SHOWN: 'paywall_shown',
  PAYWALL_DISMISSED: 'paywall_dismissed',
  PAYWALL_PURCHASE_TAPPED: 'paywall_purchase_tapped',
  PAYWALL_RESTORE_TAPPED: 'paywall_restore_tapped',
  SUBSCRIPTION_STARTED: 'subscription_started',
  SUBSCRIPTION_CANCELLED: 'subscription_cancelled',
  SUBSCRIPTION_RESTORED: 'subscription_restored',
  FREE_LIMIT_REACHED: 'free_limit_reached',

  // Errors
  ERROR_OCCURRED: 'error_occurred',
  API_ERROR: 'api_error',
} as const;

export type AnalyticsEvent = typeof AnalyticsEvents[keyof typeof AnalyticsEvents];

// Main analytics object
export const analytics = {
  /**
   * Initialize analytics with a provider
   * Call this once at app startup
   */
  init: async (provider?: AnalyticsProvider, apiKey?: string): Promise<void> => {
    if (isInitialized) return;

    if (provider) {
      currentProvider = provider;
    }

    if (apiKey) {
      await currentProvider.init(apiKey);
    } else {
      await currentProvider.init('');
    }

    isInitialized = true;
  },

  /**
   * Identify a user (call after login/signup)
   */
  identify: (userId: string, properties?: UserProperties): void => {
    currentProvider.identify(userId, properties);
  },

  /**
   * Track an event
   */
  track: (event: AnalyticsEvent | string, properties?: EventProperties): void => {
    currentProvider.track(event, {
      ...properties,
      timestamp: Date.now(),
    });
  },

  /**
   * Track a screen view
   */
  screen: (name: string, properties?: EventProperties): void => {
    currentProvider.screen(name, properties);
  },

  /**
   * Reset analytics (call on logout)
   */
  reset: (): void => {
    currentProvider.reset();
  },

  /**
   * Set a custom provider (Mixpanel, Amplitude, etc.)
   */
  setProvider: (provider: AnalyticsProvider): void => {
    currentProvider = provider;
  },
};

// Export provider interface for implementing custom providers
export type { AnalyticsProvider, EventProperties, UserProperties };
