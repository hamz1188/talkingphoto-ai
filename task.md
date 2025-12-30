# TalkingPhoto AI - App Store Launch Roadmap

## Executive Summary

**Product:** AI-powered app that makes photos talk with generated scripts and lip-sync animation
**Target Launch:** January 31, 2025 (32 days from Dec 30, 2024)
**Revenue Model:** Freemium with $4.99/week subscription
**Platform:** iOS first, then Android

---

## Current State (Completed)

- [x] Core MVP flow working: Photo → Script → Voice → Video → Download
- [x] Expo SDK 54 project with TypeScript
- [x] Google Gemini 2.0 Flash for script generation
- [x] ElevenLabs TTS integration (eleven_turbo_v2_5 model)
- [x] Replicate SadTalker for lip-sync video
- [x] Zustand state management
- [x] Expo Router with API routes
- [x] Web testing functional
- [x] Code pushed to GitHub: hamz1188/talkingphoto-ai

---

## PHASE 1: iOS Native Build & Polish
**Timeline: Dec 30 - Jan 5 (7 days)**

### 1.1 Fix Deprecation Warnings
- [ ] Replace expo-av with expo-video package
- [ ] Fix `props.pointerEvents` deprecation warning
- [ ] Remove any unused dependencies

### 1.2 iOS Configuration
- [ ] Add `NSCameraUsageDescription` to app.json
- [ ] Add `NSPhotoLibraryUsageDescription` to app.json
- [ ] Add `NSMicrophoneUsageDescription` to app.json (if needed for future)
- [ ] Configure iOS bundle identifier
- [ ] Set minimum iOS version (iOS 15+)

### 1.3 App Assets
- [ ] Create 1024x1024 app icon (no alpha, no rounded corners)
- [ ] Create adaptive icon for Android
- [ ] Create splash screen image
- [ ] Create App Store screenshots (6.5", 5.5", iPad if supporting)

### 1.4 EAS Build Setup
- [ ] Install EAS CLI: `npm install -g eas-cli`
- [ ] Login: `eas login`
- [ ] Configure: `eas build:configure`
- [ ] Create Apple Developer account ($99/year) if not exists
- [ ] Configure credentials in EAS
- [ ] Run first build: `eas build --platform ios --profile preview`

### 1.5 TestFlight Testing
- [ ] Upload build to TestFlight
- [ ] Install on physical iPhone
- [ ] Test complete flow on device
- [ ] Fix any iOS-specific bugs

**Testing Gate:**
```
✓ App installs from TestFlight without crashes
✓ Photo picker opens and selects photos
✓ Script generation works
✓ Voice generation works
✓ Video generation completes
✓ Video saves to camera roll
✓ No console errors in release build
```

---

## PHASE 2: Monetization Integration
**Timeline: Jan 6 - Jan 12 (7 days)**

### 2.1 RevenueCat Setup
- [ ] Create RevenueCat account at https://www.revenuecat.com
- [ ] Create new project for TalkingPhoto AI
- [ ] Connect App Store Connect credentials
- [ ] Note public SDK key

### 2.2 App Store Connect Products
- [ ] Create subscription group "TalkingPhoto Premium"
- [ ] Create weekly subscription ($4.99/week)
- [ ] Create monthly subscription ($9.99/month) - optional
- [ ] Configure free trial (3 days)
- [ ] Write subscription description

### 2.3 RevenueCat Integration
- [ ] Install: `npx expo install react-native-purchases`
- [ ] Initialize SDK in app entry point
- [ ] Create `hooks/useSubscription.ts`
- [ ] Create `services/purchases.ts`

### 2.4 Paywall Implementation
- [ ] Create `components/Paywall.tsx`
- [ ] Design paywall UI (benefits, pricing, CTA)
- [ ] Add "Restore Purchases" button
- [ ] Add terms/privacy links

### 2.5 Free Tier Limits
- [ ] Track video creation count in AsyncStorage
- [ ] Limit free users to 2 videos
- [ ] Show paywall after limit reached
- [ ] Premium users: unlimited videos, no watermark

### 2.6 Entitlement Checking
- [ ] Create `contexts/SubscriptionContext.tsx`
- [ ] Check entitlement before video generation
- [ ] Gate premium features appropriately

**Files to Create:**
```
lib/
├── purchases.ts              # RevenueCat service
├── hooks/useSubscription.ts  # Subscription hook
components/
├── Paywall.tsx              # Paywall UI
contexts/
└── SubscriptionContext.tsx  # Subscription state
```

**Testing Gate:**
```
✓ RevenueCat SDK initializes without errors
✓ Products display correctly on paywall
✓ Sandbox purchase completes successfully
✓ Entitlement granted after purchase
✓ Paywall appears after 2 free videos
✓ Premium user bypasses paywall
✓ Restore purchases works
✓ Subscription persists after app restart
```

---

## PHASE 3: Viral Features & Polish
**Timeline: Jan 13 - Jan 19 (7 days)**

### 3.1 Video Watermark
- [ ] Add subtle "Made with TalkingPhoto" watermark for free tier
- [ ] Position in bottom-right corner
- [ ] Remove watermark for premium users
- [ ] Consider Replicate output modification or overlay

### 3.2 Share Functionality
- [ ] Implement native share sheet
- [ ] Include App Store link in share text
- [ ] Pre-fill share message: "Check out my talking photo! Made with TalkingPhoto AI"
- [ ] Track share events for analytics

### 3.3 Onboarding Flow
- [ ] Create `app/onboarding.tsx`
- [ ] Design 3-4 intro slides:
  - Slide 1: "Make any photo talk"
  - Slide 2: "AI writes the script for you"
  - Slide 3: "Choose from realistic voices"
  - Slide 4: "Share with friends"
- [ ] Store completion in AsyncStorage
- [ ] Skip for returning users

### 3.4 Error Handling & UX
- [ ] Add user-friendly error messages
- [ ] Add retry buttons for failed operations
- [ ] Add loading states with progress indicators
- [ ] Add haptic feedback on iOS

### 3.5 Analytics Setup
- [ ] Choose analytics provider (Mixpanel, Amplitude, or PostHog)
- [ ] Create `lib/analytics.ts` wrapper
- [ ] Track key events:
  - `onboarding_complete`
  - `photo_selected`
  - `script_generated`
  - `video_created`
  - `video_shared`
  - `paywall_shown`
  - `subscription_started`
  - `subscription_cancelled`

### 3.6 UI Polish
- [ ] Add loading skeleton states
- [ ] Smooth animations/transitions
- [ ] Consistent spacing and typography
- [ ] Dark mode support (optional)

**Files to Create:**
```
app/
├── onboarding.tsx           # Onboarding screens
components/
├── OnboardingSlide.tsx     # Reusable slide component
├── Watermark.tsx           # Video watermark overlay
lib/
└── analytics.ts            # Analytics wrapper
```

**Testing Gate:**
```
✓ Onboarding shows only on first launch
✓ Watermark visible on free tier videos
✓ Share sheet opens with correct content
✓ Analytics events fire correctly
✓ No UI glitches or layout issues
✓ Error states handled gracefully
```

---

## PHASE 4: App Store Submission
**Timeline: Jan 20 - Jan 26 (7 days)**

### 4.1 App Store Connect Setup
- [ ] Create app in App Store Connect
- [ ] Fill in app name: "TalkingPhoto - AI Photo Animator"
- [ ] Set primary category: Entertainment
- [ ] Set secondary category: Photo & Video

### 4.2 App Metadata
- [ ] Write compelling app description (max 4000 chars)
- [ ] Write promotional text (max 170 chars)
- [ ] Choose keywords (100 char limit)
- [ ] Set app rating (likely 4+)
- [ ] Add support URL
- [ ] Add privacy policy URL
- [ ] Add marketing URL (optional)

### 4.3 Screenshots & Preview
- [ ] Create 6.7" iPhone screenshots (1290 x 2796px) - 3-5 images
- [ ] Create 6.5" iPhone screenshots (1242 x 2688px) - 3-5 images
- [ ] Create 5.5" iPhone screenshots (1242 x 2208px) - 3-5 images
- [ ] Record app preview video (15-30 seconds)
- [ ] Add captions to screenshots

### 4.4 Build & Submit
- [ ] Run production build: `eas build --platform ios --profile production`
- [ ] Submit to App Store: `eas submit --platform ios`
- [ ] Complete App Store Connect review information
- [ ] Submit for review

### 4.5 Review Preparation
- [ ] Prepare demo account credentials (if needed)
- [ ] Write review notes explaining AI features
- [ ] Ensure all links work (privacy, terms, support)
- [ ] Test production API endpoints

**App Store Description Template:**
```
Make your photos come alive with TalkingPhoto AI!

Simply upload any photo and our AI will:
• Analyze the image and write a funny script
• Generate a realistic voice reading the script
• Create a lip-synced video that makes your photo talk

Perfect for:
- Making your pets "talk"
- Creating funny memes
- Surprising friends and family
- Social media content

Features:
✓ AI-powered script generation
✓ Multiple voice options
✓ High-quality lip-sync animation
✓ Easy sharing to social media

Try it free - create your first talking photo today!
```

**Testing Gate:**
```
✓ Production build runs without crashes
✓ All API endpoints work in production
✓ Screenshots render correctly
✓ Preview video plays correctly
✓ All links accessible
✓ App submitted successfully
```

---

## PHASE 5: Launch & Monitor
**Timeline: Jan 27 - Jan 31 (5 days)**

### 5.1 Review Response
- [ ] Monitor App Review status daily
- [ ] Respond promptly to any rejection feedback
- [ ] Resubmit with fixes if needed (usually 24-48h turnaround)

### 5.2 Launch Day Checklist
- [ ] Verify app live on App Store
- [ ] Test download from App Store
- [ ] Test in-app purchase in production
- [ ] Monitor crash reports (Sentry/Crashlytics)

### 5.3 Monitoring Setup
- [ ] Set up crash reporting alerts
- [ ] Monitor RevenueCat dashboard
- [ ] Track daily active users
- [ ] Monitor API costs (Gemini, ElevenLabs, Replicate)

### 5.4 User Support
- [ ] Set up support email
- [ ] Create FAQ document
- [ ] Monitor App Store reviews
- [ ] Respond to user feedback

### 5.5 Soft Launch Marketing
- [ ] Post on personal social media
- [ ] Create TikTok showcase video
- [ ] Submit to Product Hunt (consider timing)
- [ ] Reach out to micro-influencers

**Testing Gate:**
```
✓ App approved and live on App Store
✓ Purchases processing in production
✓ No critical crashes reported
✓ API costs within budget
✓ First organic downloads coming in
```

---

## Reusable Code Modules

Extract these into shareable packages for future products:

### @lib/purchases (RevenueCat Wrapper)
```typescript
// lib/purchases.ts - Reusable subscription management
- initializePurchases()
- getOfferings()
- purchasePackage()
- restorePurchases()
- checkEntitlement()
- useSubscription() hook
```

### @lib/media (Media Utilities)
```typescript
// lib/media.ts - Reusable media handling
- pickImage()
- compressImage()
- saveToLibrary()
- shareMedia()
- usePermissions() hook
```

### @lib/ai-services (AI API Clients)
```typescript
// lib/ai-services.ts - Reusable AI wrappers
- generateWithGemini()
- synthesizeVoice()
- createLipSyncVideo()
- Retry logic and error handling
```

### @components/Paywall (Paywall UI)
```typescript
// components/Paywall.tsx - Reusable paywall
- Configurable pricing display
- Benefit list
- Purchase buttons
- Restore purchases
- Close button
```

### @components/Onboarding (Onboarding Flow)
```typescript
// components/Onboarding.tsx - Reusable onboarding
- Swipeable slides
- Progress dots
- Skip button
- Get Started CTA
```

---

## Monetization Strategy

### Pricing Structure
| Plan | Price | Value Prop |
|------|-------|------------|
| Free | $0 | 2 videos with watermark |
| Weekly | $4.99/week | Unlimited + no watermark |
| Monthly | $9.99/month | Best value for regular users |

### Revenue Projections (Month 1)
| Metric | Conservative | Target | Optimistic |
|--------|--------------|--------|------------|
| Downloads | 500 | 1,000 | 2,500 |
| Conversion Rate | 3% | 5% | 8% |
| Paid Subscribers | 15 | 50 | 200 |
| Weekly Revenue | $75 | $250 | $1,000 |
| Monthly Revenue | $300 | $1,000 | $4,000 |

### Cost Structure
| Service | Per Video Cost | Monthly (1000 videos) |
|---------|---------------|----------------------|
| Gemini | ~$0.001 | $1 |
| ElevenLabs | ~$0.02 | $20 |
| Replicate | ~$0.10 | $100 |
| **Total** | **~$0.12** | **$121** |

### Break-Even Analysis
- Cost per video: ~$0.12
- Free tier: 2 videos = $0.24 customer acquisition cost
- Need ~25 paying subscribers to cover 1000 free videos/month

---

## Viral Growth Mechanics

### Built-in Virality
1. **Watermarked Videos** - Free videos include "Made with TalkingPhoto AI"
2. **One-Tap Sharing** - Share directly to TikTok, Instagram, Twitter
3. **Shareable Content** - Talking photos are inherently share-worthy

### Referral System (V2)
- "Invite a friend, both get 3 free premium videos"
- Unique referral codes/links
- Track referral conversions

### Content Flywheel
1. User creates funny talking photo
2. Shares on social media (with watermark)
3. Friends see and want to try
4. Download app from App Store
5. Create their own, share, repeat

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| App Store rejection | Submit by Jan 24 for buffer time |
| RevenueCat issues | Test sandbox thoroughly before submission |
| API costs spike | Implement rate limiting, monitor daily |
| Replicate outage | Add fallback model or graceful error |
| Negative reviews | Respond quickly, fix issues in updates |

---

## Success Metrics

### Week 1 Goals
- [ ] 100+ downloads
- [ ] 5+ paid subscribers
- [ ] 4.0+ star rating
- [ ] <1% crash rate

### Month 1 Goals
- [ ] 1,000+ downloads
- [ ] 50+ paid subscribers
- [ ] $250+/week revenue
- [ ] 4.5+ star rating

---

## Critical Files to Modify

| File | Changes Needed |
|------|----------------|
| `app.json` | iOS permissions, bundle ID, version |
| `app/(tabs)/preview.tsx` | expo-video migration, watermark |
| `app/_layout.tsx` | RevenueCat init, analytics |
| `components/LoadingOverlay.tsx` | Better progress states |
| `eas.json` | Build profiles (new file) |
| `lib/purchases.ts` | RevenueCat service (new file) |
| `components/Paywall.tsx` | Paywall UI (new file) |
| `app/onboarding.tsx` | Onboarding flow (new file) |

---

## Quick Reference Commands

```bash
# Development
npm start                           # Start Expo dev server

# Building
eas build --platform ios --profile preview    # TestFlight build
eas build --platform ios --profile production # App Store build

# Submitting
eas submit --platform ios           # Submit to App Store

# Testing
eas build --platform ios --profile development # Dev build for testing
```

---

## Next Immediate Actions

1. **Today (Dec 30):** Set up Apple Developer account if not done
2. **Tomorrow (Dec 31):** Configure EAS Build and run first iOS build
3. **Jan 1-2:** Test on physical iPhone, fix any iOS-specific issues
4. **Jan 3-5:** Create app icons and splash screens
5. **Jan 6:** Begin RevenueCat integration
