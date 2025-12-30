/**
 * Storage Module - Reusable AsyncStorage wrapper
 *
 * Provides typed storage access with error handling.
 *
 * Usage:
 *   import { storage, StorageKeys } from '@/lib/storage';
 *   await storage.set(StorageKeys.ONBOARDING_COMPLETED, true);
 *   const completed = await storage.get(StorageKeys.ONBOARDING_COMPLETED);
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys for type safety
export const StorageKeys = {
  ONBOARDING_COMPLETED: 'onboarding_completed',
  USER_ID: 'user_id',
  VIDEO_COUNT: 'video_count',
  FREE_VIDEOS_REMAINING: 'free_videos_remaining',
  SUBSCRIPTION_STATUS: 'subscription_status',
  LAST_VIDEO_DATE: 'last_video_date',
} as const;

export type StorageKey = typeof StorageKeys[keyof typeof StorageKeys];

export const storage = {
  /**
   * Get a value from storage
   */
  get: async <T>(key: StorageKey): Promise<T | null> => {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value === null) return null;
      return JSON.parse(value) as T;
    } catch (error) {
      console.error(`[Storage] Error getting ${key}:`, error);
      return null;
    }
  },

  /**
   * Set a value in storage
   */
  set: async <T>(key: StorageKey, value: T): Promise<boolean> => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`[Storage] Error setting ${key}:`, error);
      return false;
    }
  },

  /**
   * Remove a value from storage
   */
  remove: async (key: StorageKey): Promise<boolean> => {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`[Storage] Error removing ${key}:`, error);
      return false;
    }
  },

  /**
   * Clear all storage
   */
  clear: async (): Promise<boolean> => {
    try {
      await AsyncStorage.clear();
      return true;
    } catch (error) {
      console.error('[Storage] Error clearing storage:', error);
      return false;
    }
  },

  /**
   * Get multiple values at once
   */
  getMultiple: async <T extends Record<string, unknown>>(
    keys: StorageKey[]
  ): Promise<Partial<T>> => {
    try {
      const pairs = await AsyncStorage.multiGet(keys);
      const result: Record<string, unknown> = {};
      pairs.forEach(([key, value]) => {
        if (value !== null) {
          result[key] = JSON.parse(value);
        }
      });
      return result as Partial<T>;
    } catch (error) {
      console.error('[Storage] Error getting multiple keys:', error);
      return {};
    }
  },

  /**
   * Increment a numeric value
   */
  increment: async (key: StorageKey, by: number = 1): Promise<number> => {
    try {
      const current = await storage.get<number>(key);
      const newValue = (current ?? 0) + by;
      await storage.set(key, newValue);
      return newValue;
    } catch (error) {
      console.error(`[Storage] Error incrementing ${key}:`, error);
      return 0;
    }
  },
};
