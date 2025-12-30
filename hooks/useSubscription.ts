import { useState, useEffect, useCallback } from 'react';
import { Platform } from 'react-native';
import { PurchasesOffering, PurchasesPackage } from 'react-native-purchases';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getOfferings,
  purchasePackage,
  restorePurchases,
  checkPremiumStatus,
} from '@/lib/purchases';

const FREE_VIDEO_LIMIT = 1;
const VIDEO_COUNT_KEY = '@talkingphoto_video_count';

interface UseSubscriptionReturn {
  // Premium status
  isPremium: boolean;
  isLoading: boolean;

  // Video limits
  videoCount: number;
  remainingFreeVideos: number;
  canCreateVideo: boolean;

  // Offerings
  offerings: PurchasesOffering | null;
  weeklyPackage: PurchasesPackage | null;
  monthlyPackage: PurchasesPackage | null;

  // Actions
  purchase: (pkg: PurchasesPackage) => Promise<boolean>;
  restore: () => Promise<boolean>;
  incrementVideoCount: () => Promise<void>;
  refreshStatus: () => Promise<void>;
}

export function useSubscription(): UseSubscriptionReturn {
  const [isPremium, setIsPremium] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [videoCount, setVideoCount] = useState(0);
  const [offerings, setOfferings] = useState<PurchasesOffering | null>(null);

  // Load initial state
  useEffect(() => {
    loadInitialState();
  }, []);

  const loadInitialState = async () => {
    setIsLoading(true);
    try {
      // Check premium status
      const premium = await checkPremiumStatus();
      setIsPremium(premium);

      // Load video count
      const storedCount = await AsyncStorage.getItem(VIDEO_COUNT_KEY);
      if (storedCount) {
        setVideoCount(parseInt(storedCount, 10));
      }

      // Load offerings
      const currentOfferings = await getOfferings();
      setOfferings(currentOfferings);
    } catch (error) {
      console.error('[useSubscription] Failed to load initial state:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshStatus = useCallback(async () => {
    try {
      const premium = await checkPremiumStatus();
      setIsPremium(premium);
    } catch (error) {
      console.error('[useSubscription] Failed to refresh status:', error);
    }
  }, []);

  const purchase = useCallback(async (pkg: PurchasesPackage): Promise<boolean> => {
    const result = await purchasePackage(pkg);
    if (result.success) {
      setIsPremium(true);
    }
    return result.success;
  }, []);

  const restore = useCallback(async (): Promise<boolean> => {
    const result = await restorePurchases();
    if (result.success) {
      setIsPremium(true);
    }
    return result.success;
  }, []);

  const incrementVideoCount = useCallback(async () => {
    const newCount = videoCount + 1;
    setVideoCount(newCount);
    await AsyncStorage.setItem(VIDEO_COUNT_KEY, newCount.toString());
  }, [videoCount]);

  // Calculate derived values
  const remainingFreeVideos = Math.max(0, FREE_VIDEO_LIMIT - videoCount);
  const canCreateVideo = isPremium || videoCount < FREE_VIDEO_LIMIT;

  // Extract packages from offerings
  const weeklyPackage = offerings?.availablePackages.find(
    (pkg) => pkg.packageType === 'WEEKLY'
  ) || null;
  const monthlyPackage = offerings?.availablePackages.find(
    (pkg) => pkg.packageType === 'MONTHLY'
  ) || null;

  return {
    isPremium,
    isLoading,
    videoCount,
    remainingFreeVideos,
    canCreateVideo,
    offerings,
    weeklyPackage,
    monthlyPackage,
    purchase,
    restore,
    incrementVideoCount,
    refreshStatus,
  };
}
