import { create } from 'zustand';
import type { CreationState, CreationActions, CreationStatus } from '@/types';

const initialState: CreationState = {
  imageUri: null,
  imageBase64: null,
  script: '',
  selectedVoiceId: 'EXAVITQu4vr4xnSDxMaL', // Default ElevenLabs voice (Sarah)
  audioUrl: null,
  videoUrl: null,
  status: 'idle',
  error: null,
};

export const useCreationStore = create<CreationState & CreationActions>((set) => ({
  ...initialState,

  setImage: (uri: string, base64: string) =>
    set({ imageUri: uri, imageBase64: base64, error: null }),

  setScript: (script: string) => set({ script }),

  setVoice: (voiceId: string) => set({ selectedVoiceId: voiceId }),

  setAudioUrl: (url: string) => set({ audioUrl: url }),

  setVideoUrl: (url: string) => set({ videoUrl: url }),

  setStatus: (status: CreationStatus) => set({ status }),

  setError: (error: string | null) => set({ error, status: 'error' }),

  reset: () => set(initialState),
}));

// Available voices from ElevenLabs
export const AVAILABLE_VOICES = [
  { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Sarah (Female)' },
  { id: '21m00Tcm4TlvDq8ikWAM', name: 'Rachel (Female)' },
  { id: 'AZnzlk1XvdvUeBnXmlld', name: 'Domi (Female)' },
  { id: 'ErXwobaYiN019PkySvjV', name: 'Antoni (Male)' },
  { id: 'VR6AewLTigWG4xSOukaG', name: 'Arnold (Male)' },
  { id: 'pNInz6obpgDQGcFmaJgB', name: 'Adam (Male)' },
];
