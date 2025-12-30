export type CreationStatus =
  | 'idle'
  | 'generating-script'
  | 'generating-voice'
  | 'generating-video'
  | 'complete'
  | 'error';

export interface Voice {
  id: string;
  name: string;
  previewUrl?: string;
}

export interface CreationState {
  // Image
  imageUri: string | null;
  imageBase64: string | null;

  // Script
  script: string;

  // Voice
  selectedVoiceId: string;
  audioUrl: string | null;

  // Video
  videoUrl: string | null;

  // Status
  status: CreationStatus;
  error: string | null;
}

export interface CreationActions {
  setImage: (uri: string, base64: string) => void;
  setScript: (script: string) => void;
  setVoice: (voiceId: string) => void;
  setAudioUrl: (url: string) => void;
  setVideoUrl: (url: string) => void;
  setStatus: (status: CreationStatus) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}
