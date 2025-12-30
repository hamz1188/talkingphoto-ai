import { Platform } from 'react-native';
import Purchases, {
  PurchasesOffering,
  PurchasesPackage,
  CustomerInfo,
  LOG_LEVEL,
} from 'react-native-purchases';

// RevenueCat API Keys - Replace with your actual keys from RevenueCat dashboard
const REVENUECAT_API_KEY_IOS = 'appl_YOUR_REVENUECAT_IOS_KEY';
const REVENUECAT_API_KEY_ANDROID = 'goog_YOUR_REVENUECAT_ANDROID_KEY';

// Entitlement ID - This should match what you set up in RevenueCat
export const ENTITLEMENT_ID = 'premium';

// Product IDs - These should match your App Store Connect products
export const PRODUCT_IDS = {
  WEEKLY: 'talkingphoto_weekly',
  MONTHLY: 'talkingphoto_monthly',
};

let isInitialized = false;

/**
 * Initialize RevenueCat SDK
 * Call this once when the app starts
 */
export async function initializePurchases(): Promise<void> {
  if (isInitialized) return;

  // Skip on web
  if (Platform.OS === 'web') {
    console.log('[Purchases] Skipping initialization on web');
    return;
  }

  try {
    Purchases.setLogLevel(LOG_LEVEL.DEBUG);

    const apiKey =
      Platform.OS === 'ios' ? REVENUECAT_API_KEY_IOS : REVENUECAT_API_KEY_ANDROID;

    await Purchases.configure({ apiKey });
    isInitialized = true;
    console.log('[Purchases] Initialized successfully');
  } catch (error) {
    console.error('[Purchases] Initialization failed:', error);
  }
}

/**
 * Get available subscription offerings
 */
export async function getOfferings(): Promise<PurchasesOffering | null> {
  if (Platform.OS === 'web') return null;

  try {
    const offerings = await Purchases.getOfferings();
    return offerings.current;
  } catch (error) {
    console.error('[Purchases] Failed to get offerings:', error);
    return null;
  }
}

/**
 * Purchase a subscription package
 */
export async function purchasePackage(
  pkg: PurchasesPackage
): Promise<{ success: boolean; customerInfo?: CustomerInfo; error?: string }> {
  if (Platform.OS === 'web') {
    return { success: false, error: 'Purchases not available on web' };
  }

  try {
    const { customerInfo } = await Purchases.purchasePackage(pkg);
    const isPremium =
      typeof customerInfo.entitlements.active[ENTITLEMENT_ID] !== 'undefined';

    return { success: isPremium, customerInfo };
  } catch (error: any) {
    if (error.userCancelled) {
      return { success: false, error: 'Purchase cancelled' };
    }
    console.error('[Purchases] Purchase failed:', error);
    return { success: false, error: error.message || 'Purchase failed' };
  }
}

/**
 * Restore previous purchases
 */
export async function restorePurchases(): Promise<{
  success: boolean;
  customerInfo?: CustomerInfo;
  error?: string;
}> {
  if (Platform.OS === 'web') {
    return { success: false, error: 'Purchases not available on web' };
  }

  try {
    const customerInfo = await Purchases.restorePurchases();
    const isPremium =
      typeof customerInfo.entitlements.active[ENTITLEMENT_ID] !== 'undefined';

    return { success: isPremium, customerInfo };
  } catch (error: any) {
    console.error('[Purchases] Restore failed:', error);
    return { success: false, error: error.message || 'Restore failed' };
  }
}

/**
 * Check if user has premium entitlement
 */
export async function checkPremiumStatus(): Promise<boolean> {
  if (Platform.OS === 'web') return false;

  try {
    const customerInfo = await Purchases.getCustomerInfo();
    return (
      typeof customerInfo.entitlements.active[ENTITLEMENT_ID] !== 'undefined'
    );
  } catch (error) {
    console.error('[Purchases] Failed to check premium status:', error);
    return false;
  }
}

/**
 * Get customer info
 */
export async function getCustomerInfo(): Promise<CustomerInfo | null> {
  if (Platform.OS === 'web') return null;

  try {
    return await Purchases.getCustomerInfo();
  } catch (error) {
    console.error('[Purchases] Failed to get customer info:', error);
    return null;
  }
}

/**
 * Set user ID for RevenueCat (optional, for user identification)
 */
export async function setUserId(userId: string): Promise<void> {
  if (Platform.OS === 'web') return;

  try {
    await Purchases.logIn(userId);
    console.log('[Purchases] User ID set:', userId);
  } catch (error) {
    console.error('[Purchases] Failed to set user ID:', error);
  }
}

/**
 * Log out user from RevenueCat
 */
export async function logOut(): Promise<void> {
  if (Platform.OS === 'web') return;

  try {
    await Purchases.logOut();
    console.log('[Purchases] User logged out');
  } catch (error) {
    console.error('[Purchases] Failed to log out:', error);
  }
}
