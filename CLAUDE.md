# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

TalkingPhoto AI is an Expo-based mobile app that transforms static photos into talking avatars using AI. Users upload a portrait photo, generate or type a script, and the app creates a lip-synced video with AI-generated voice.

## Development Commands

```bash
# Start development server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Run on web
npm run web
```

## Tech Stack

- **Framework**: Expo SDK 54 with TypeScript
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **State Management**: Zustand
- **Navigation**: Expo Router
- **AI Integration**: Vercel AI SDK (`ai`, `@ai-sdk/google`)
- **Video**: expo-av
- **HTTP Client**: Axios (for Replicate API)

## AI Services

| Service | Purpose | API Route | Cost |
|---------|---------|-----------|------|
| Google Gemini 2.0 Flash | Image analysis, script generation | `/api/generate-script` | Free tier |
| ElevenLabs | Text-to-speech | `/api/generate-voice` | $5/mo or free tier |
| Replicate (SadTalker) | Lip-sync video generation | `/api/generate-video` | ~$0.05/video |

## Project Structure

```
app/
├── (tabs)/
│   ├── index.tsx          # Main creation screen
│   ├── preview.tsx         # Video preview & export
│   └── _layout.tsx         # Tab navigation
├── api/
│   ├── generate-script+api.ts   # OpenAI integration
│   ├── generate-voice+api.ts    # ElevenLabs integration
│   └── generate-video+api.ts    # Replicate integration
├── _layout.tsx             # Root layout
components/
├── ImagePickerButton.tsx   # Photo selection UI
├── VoiceSelector.tsx       # Voice picker UI
├── ScriptInput.tsx         # Script text input
└── LoadingOverlay.tsx      # Processing modal
stores/
└── creationStore.ts        # Zustand state (image, script, voice, video)
services/
└── api.ts                  # Client-side API helpers
types/
└── index.ts                # TypeScript types
```

## Environment Variables

Copy `.env.example` to `.env` and add your API keys:

```
GOOGLE_GENERATIVE_AI_API_KEY=...   # https://aistudio.google.com/app/apikey
ELEVENLABS_API_KEY=...              # https://elevenlabs.io
REPLICATE_API_TOKEN=r8_...          # https://replicate.com
```

## Core User Flow

1. **Upload**: User selects photo from gallery or camera
2. **Script**: User types or AI-generates a script via GPT-4o-mini
3. **Voice**: User selects from 6 ElevenLabs voices
4. **Create**: App generates audio → then lip-sync video via SadTalker
5. **Export**: User can save to camera roll or share

## Key Patterns

- **API Routes**: All AI service calls go through Expo API Routes (`app/api/`) to keep API keys server-side
- **State**: Zustand store (`stores/creationStore.ts`) manages the entire creation flow
- **Styling**: Use NativeWind classes (`className="..."`) for all styling
