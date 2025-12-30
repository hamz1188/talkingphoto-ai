import {
  View,
  Text,
  Pressable,
  Modal,
  ScrollView,
  Alert,
  StyleSheet,
  Linking,
  ActivityIndicator,
} from 'react-native';
import { useState } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { PurchasesPackage } from 'react-native-purchases';

import { useSubscriptionContext } from '@/contexts/SubscriptionContext';
import { analytics, AnalyticsEvents } from '@/lib/analytics';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '@/constants/Theme';

const BENEFITS = [
  { icon: 'film', text: 'Unlimited video creations' },
  { icon: 'star', text: 'No watermark on videos' },
  { icon: 'bolt', text: 'Priority processing' },
  { icon: 'magic', text: 'Access to new features first' },
];

interface PaywallProps {
  visible: boolean;
  onClose: () => void;
}

export function Paywall({ visible, onClose }: PaywallProps) {
  const { offerings, purchase, restore, remainingFreeVideos } = useSubscriptionContext();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<'weekly' | 'monthly'>('weekly');

  const weeklyPackage = offerings?.availablePackages.find(
    (pkg) => pkg.packageType === 'WEEKLY'
  );
  const monthlyPackage = offerings?.availablePackages.find(
    (pkg) => pkg.packageType === 'MONTHLY'
  );

  const handlePurchase = async (pkg: PurchasesPackage | undefined) => {
    if (!pkg) {
      Alert.alert('Error', 'Package not available. Please try again later.');
      return;
    }

    setIsLoading(true);
    analytics.track(AnalyticsEvents.PAYWALL_PURCHASE_TAPPED, {
      packageType: pkg.packageType,
      price: pkg.product.priceString,
    });

    const result = await purchase(pkg);
    setIsLoading(false);

    if (result.success) {
      analytics.track(AnalyticsEvents.SUBSCRIPTION_STARTED, {
        packageType: pkg.packageType,
      });
      Alert.alert('Success!', 'Welcome to TalkingPhoto Premium!');
      onClose();
    } else if (result.error && result.error !== 'Purchase cancelled') {
      Alert.alert('Purchase Failed', result.error);
    }
  };

  const handleRestore = async () => {
    setIsLoading(true);
    analytics.track(AnalyticsEvents.PAYWALL_RESTORE_TAPPED);
    const result = await restore();
    setIsLoading(false);

    if (result.success) {
      analytics.track(AnalyticsEvents.SUBSCRIPTION_RESTORED);
      Alert.alert('Restored!', 'Your subscription has been restored.');
      onClose();
    } else {
      Alert.alert(
        'No Subscription Found',
        'We couldn\'t find any previous purchases to restore.'
      );
    }
  };

  const openPrivacyPolicy = () => {
    Linking.openURL('https://talkingphoto.ai/privacy');
  };

  const openTerms = () => {
    Linking.openURL('https://talkingphoto.ai/terms');
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerSpacer} />
          <Text style={styles.headerTitle}>Go Premium</Text>
          <Pressable onPress={onClose} style={styles.closeButton}>
            <FontAwesome name="times" size={24} color={Colors.text.muted} />
          </Pressable>
        </View>

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Hero Section */}
          <View style={styles.heroSection}>
            <View style={styles.iconGlow} />
            <View style={styles.iconContainer}>
              <FontAwesome name="star" size={36} color={Colors.premium.default} />
            </View>
            <Text style={styles.heroTitle}>Unlock Unlimited Creations</Text>
            <Text style={styles.heroSubtitle}>
              {remainingFreeVideos > 0
                ? `You have ${remainingFreeVideos} free video${remainingFreeVideos !== 1 ? 's' : ''} left`
                : 'You\'ve used all your free videos'}
            </Text>
          </View>

          {/* Benefits */}
          <View style={styles.benefitsSection}>
            {BENEFITS.map((benefit, index) => (
              <View key={index} style={styles.benefitRow}>
                <View style={styles.benefitIcon}>
                  <FontAwesome name={benefit.icon as any} size={16} color={Colors.premium.default} />
                </View>
                <Text style={styles.benefitText}>{benefit.text}</Text>
              </View>
            ))}
          </View>

          {/* Pricing Options */}
          <View style={styles.pricingSection}>
            {/* Weekly Option */}
            <Pressable
              style={({ pressed }) => [
                styles.pricingCard,
                selectedPackage === 'weekly' && styles.pricingCardSelected,
                pressed && styles.pricingCardPressed,
              ]}
              onPress={() => setSelectedPackage('weekly')}
            >
              <View style={styles.pricingHeader}>
                <Text style={[
                  styles.pricingTitle,
                  selectedPackage === 'weekly' && styles.pricingTitleSelected,
                ]}>Weekly</Text>
                {selectedPackage === 'weekly' && (
                  <View style={styles.selectedBadge}>
                    <FontAwesome name="check" size={10} color={Colors.text.primary} />
                  </View>
                )}
              </View>
              <Text style={[
                styles.pricingPrice,
                selectedPackage === 'weekly' && styles.pricingPriceSelected,
              ]}>
                {weeklyPackage?.product.priceString || '$4.99'}
              </Text>
              <Text style={styles.pricingPeriod}>per week</Text>
              <View style={styles.trialBadge}>
                <FontAwesome name="gift" size={10} color={Colors.success.default} />
                <Text style={styles.pricingTrial}>3-day free trial</Text>
              </View>
            </Pressable>

            {/* Monthly Option */}
            <Pressable
              style={({ pressed }) => [
                styles.pricingCard,
                selectedPackage === 'monthly' && styles.pricingCardSelected,
                pressed && styles.pricingCardPressed,
              ]}
              onPress={() => setSelectedPackage('monthly')}
            >
              <View style={styles.saveBadge}>
                <Text style={styles.saveBadgeText}>SAVE 50%</Text>
              </View>
              <View style={styles.pricingHeader}>
                <Text style={[
                  styles.pricingTitle,
                  selectedPackage === 'monthly' && styles.pricingTitleSelected,
                ]}>Monthly</Text>
                {selectedPackage === 'monthly' && (
                  <View style={styles.selectedBadge}>
                    <FontAwesome name="check" size={10} color={Colors.text.primary} />
                  </View>
                )}
              </View>
              <Text style={[
                styles.pricingPrice,
                selectedPackage === 'monthly' && styles.pricingPriceSelected,
              ]}>
                {monthlyPackage?.product.priceString || '$9.99'}
              </Text>
              <Text style={styles.pricingPeriod}>per month</Text>
              <Text style={styles.pricingBestValue}>Best value</Text>
            </Pressable>
          </View>

          {/* Subscribe Button */}
          <Pressable
            style={({ pressed }) => [
              styles.subscribeButton,
              isLoading && styles.subscribeButtonDisabled,
              pressed && styles.subscribeButtonPressed,
            ]}
            onPress={() =>
              handlePurchase(selectedPackage === 'weekly' ? weeklyPackage : monthlyPackage)
            }
            disabled={isLoading}
          >
            <LinearGradient
              colors={[Colors.premium.default, Colors.premium.dark]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.subscribeButtonGradient}
            >
              {isLoading ? (
                <ActivityIndicator color={Colors.text.inverse} />
              ) : (
                <>
                  <Text style={styles.subscribeButtonText}>
                    Start Free Trial
                  </Text>
                  <FontAwesome name="arrow-right" size={16} color={Colors.text.inverse} style={{ marginLeft: Spacing.sm }} />
                </>
              )}
            </LinearGradient>
          </Pressable>

          {/* Restore */}
          <Pressable onPress={handleRestore} style={styles.restoreButton}>
            <Text style={styles.restoreButtonText}>Restore Purchases</Text>
          </Pressable>

          {/* Legal */}
          <View style={styles.legalSection}>
            <Text style={styles.legalText}>
              Payment will be charged to your Apple ID account at confirmation of purchase.
              Subscription automatically renews unless canceled at least 24 hours before
              the end of the current period.
            </Text>
            <View style={styles.legalLinks}>
              <Pressable onPress={openTerms}>
                <Text style={styles.legalLink}>Terms of Use</Text>
              </Pressable>
              <Text style={styles.legalSeparator}>•</Text>
              <Pressable onPress={openPrivacyPolicy}>
                <Text style={styles.legalLink}>Privacy Policy</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.default,
  },
  headerSpacer: {
    width: 40,
  },
  headerTitle: {
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.semibold,
    color: Colors.text.primary,
  },
  closeButton: {
    padding: Spacing.sm,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: Spacing.lg,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
    position: 'relative',
  },
  iconGlow: {
    position: 'absolute',
    top: -10,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.premium.glow,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.premium.subtle,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
    borderWidth: 2,
    borderColor: Colors.premium.default,
  },
  heroTitle: {
    fontSize: Typography.size.xxl,
    fontWeight: Typography.weight.bold,
    color: Colors.text.primary,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: Typography.size.md,
    color: Colors.text.secondary,
    marginTop: Spacing.sm,
    textAlign: 'center',
  },
  benefitsSection: {
    marginBottom: Spacing.xl,
    backgroundColor: Colors.surface.default,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border.default,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  benefitIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.premium.subtle,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  benefitText: {
    fontSize: Typography.size.md,
    color: Colors.text.secondary,
    flex: 1,
  },
  pricingSection: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  pricingCard: {
    flex: 1,
    backgroundColor: Colors.surface.default,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 2,
    borderColor: Colors.border.default,
    position: 'relative',
  },
  pricingCardSelected: {
    borderColor: Colors.premium.default,
    backgroundColor: Colors.premium.subtle,
  },
  pricingCardPressed: {
    transform: [{ scale: 0.98 }],
  },
  pricingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  pricingTitle: {
    fontSize: Typography.size.md,
    fontWeight: Typography.weight.semibold,
    color: Colors.text.secondary,
  },
  pricingTitleSelected: {
    color: Colors.text.primary,
  },
  selectedBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.premium.default,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pricingPrice: {
    fontSize: Typography.size.xxl,
    fontWeight: Typography.weight.bold,
    color: Colors.text.secondary,
  },
  pricingPriceSelected: {
    color: Colors.text.primary,
  },
  pricingPeriod: {
    fontSize: Typography.size.sm,
    color: Colors.text.muted,
    marginBottom: Spacing.sm,
  },
  trialBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  pricingTrial: {
    fontSize: Typography.size.xs,
    color: Colors.success.default,
    fontWeight: Typography.weight.medium,
  },
  pricingBestValue: {
    fontSize: Typography.size.xs,
    color: Colors.primary.light,
    fontWeight: Typography.weight.medium,
  },
  saveBadge: {
    position: 'absolute',
    top: -10,
    right: 12,
    backgroundColor: Colors.success.default,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  saveBadgeText: {
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.bold,
    color: Colors.text.primary,
  },
  subscribeButton: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    marginBottom: Spacing.md,
    ...Shadows.md,
  },
  subscribeButtonGradient: {
    paddingVertical: Spacing.md + 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subscribeButtonDisabled: {
    opacity: 0.7,
  },
  subscribeButtonPressed: {
    transform: [{ scale: 0.98 }],
  },
  subscribeButtonText: {
    color: Colors.text.inverse,
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.semibold,
  },
  restoreButton: {
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  restoreButtonText: {
    color: Colors.primary.light,
    fontSize: Typography.size.md,
  },
  legalSection: {
    alignItems: 'center',
  },
  legalText: {
    fontSize: Typography.size.xs,
    color: Colors.text.muted,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: Spacing.sm,
  },
  legalLinks: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legalLink: {
    fontSize: Typography.size.xs,
    color: Colors.primary.light,
  },
  legalSeparator: {
    color: Colors.text.muted,
    marginHorizontal: Spacing.sm,
  },
});
