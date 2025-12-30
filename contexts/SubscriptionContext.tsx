import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { Platform } from 'react-native';
import { PurchasesOffering, PurchasesPackage } from 'react-native-purchases';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  initializePurchases,
  getOfferings,
  purchasePackage,
  restorePurchases,
  checkPremiumStatus,
} from '@/lib/purchases';

const FREE_VIDEO_LIMIT = 1;
const VIDEO_COUNT_KEY = '@talkingphoto_video_count';

interface SubscriptionContextType {
  // State
  isPremium: boolean;
  isLoading: boolean;
  videoCount: number;
  remainingFreeVideos: number;
  canCreateVideo: boolean;
  offerings: PurchasesOffering | null;

  // Actions
  purchase: (pkg: PurchasesPackage) => Promise<{ success: boolean; error?: string }>;
  restore: () => Promise<{ success: boolean; error?: string }>;
  incrementVideoCount: () => Promise<void>;
  refreshStatus: () => Promise<void>;
  showPaywall: () => void;
  hidePaywall: () => void;

  // Paywall visibility
  isPaywallVisible: boolean;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

interface SubscriptionProviderProps {
  children: ReactNode;
}

export function SubscriptionProvider({ children }: SubscriptionProviderProps) {
  const [isPremium, setIsPremium] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [videoCount, setVideoCount] = useState(0);
  const [offerings, setOfferings] = useState<PurchasesOffering | null>(null);
  const [isPaywallVisible, setIsPaywallVisible] = useState(false);

  // Initialize on mount
  useEffect(() => {
    initialize();
  }, []);

  const initialize = async () => {
    setIsLoading(true);
    try {
      // Initialize RevenueCat
      await initializePurchases();

      // Check premium status
      if (Platform.OS !== 'web') {
        const premium = await checkPremiumStatus();
        setIsPremium(premium);

        // Load offerings
        const currentOfferings = await getOfferings();
        setOfferings(currentOfferings);
      }

      // Load video count from storage
      const storedCount = await AsyncStorage.getItem(VIDEO_COUNT_KEY);
      if (storedCount) {
        setVideoCount(parseInt(storedCount, 10));
      }
    } catch (error) {
      console.error('[SubscriptionContext] Initialization failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshStatus = useCallback(async () => {
    if (Platform.OS === 'web') return;
    
    try {
      const premium = await checkPremiumStatus();
      setIsPremium(premium);
    } catch (error) {
      console.error('[SubscriptionContext] Failed to refresh status:', error);
    }
  }, []);

  const purchase = useCallback(async (pkg: PurchasesPackage) => {
    const result = await purchasePackage(pkg);
    if (result.success) {
      setIsPremium(true);
      setIsPaywallVisible(false);
    }
    return { success: result.success, error: result.error };
  }, []);

  const restore = useCallback(async () => {
    const result = await restorePurchases();
    if (result.success) {
      setIsPremium(true);
      setIsPaywallVisible(false);
    }
    return { success: result.success, error: result.error };
  }, []);

  const incrementVideoCount = useCallback(async () => {
    const newCount = videoCount + 1;
    setVideoCount(newCount);
    await AsyncStorage.setItem(VIDEO_COUNT_KEY, newCount.toString());
  }, [videoCount]);

  const showPaywall = useCallback(() => {
    setIsPaywallVisible(true);
  }, []);

  const hidePaywall = useCallback(() => {
    setIsPaywallVisible(false);
  }, []);

  // Derived values
  const remainingFreeVideos = Math.max(0, FREE_VIDEO_LIMIT - videoCount);
  const canCreateVideo = isPremium || videoCount < FREE_VIDEO_LIMIT;

  const value: SubscriptionContextType = {
    isPremium,
    isLoading,
    videoCount,
    remainingFreeVideos,
    canCreateVideo,
    offerings,
    purchase,
    restore,
    incrementVideoCount,
    refreshStatus,
    showPaywall,
    hidePaywall,
    isPaywallVisible,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscriptionContext(): SubscriptionContextType {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscriptionContext must be used within a SubscriptionProvider');
  }
  return context;
}
