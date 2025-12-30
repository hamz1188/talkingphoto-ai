const API_BASE = '/api';

export async function generateScript(imageBase64: string): Promise<string> {
  const response = await fetch(`${API_BASE}/generate-script`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ imageBase64 }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to generate script');
  }

  const data = await response.json();
  return data.script;
}

export async function generateVoice(
  text: string,
  voiceId: string
): Promise<string> {
  const response = await fetch(`${API_BASE}/generate-voice`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text, voiceId }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to generate voice');
  }

  const data = await response.json();
  return data.audioUrl;
}

export interface VideoGenerationResult {
  predictionId: string;
  status: string;
  message: string;
}

export interface VideoStatusResult {
  status: 'starting' | 'processing' | 'succeeded' | 'failed' | 'canceled';
  progress: number;
  message: string;
  videoUrl: string | null;
  error: string | null;
}

// Start video generation - returns immediately with prediction ID
export async function startVideoGeneration(
  imageUrl: string,
  audioUrl: string
): Promise<VideoGenerationResult> {
  const response = await fetch(`${API_BASE}/generate-video`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ imageUrl, audioUrl }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to start video generation');
  }

  return response.json();
}

// Check video generation status
export async function checkVideoStatus(
  predictionId: string
): Promise<VideoStatusResult> {
  const response = await fetch(`${API_BASE}/video-status`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ predictionId }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to check video status');
  }

  return response.json();
}

// Legacy function for backward compatibility - polls until complete
export async function generateVideo(
  imageUrl: string,
  audioUrl: string,
  onProgress?: (progress: number, message: string) => void
): Promise<string> {
  // Start generation
  const result = await startVideoGeneration(imageUrl, audioUrl);

  if (onProgress) {
    onProgress(10, 'Video generation started...');
  }

  // Poll for completion
  const maxAttempts = 120; // 10 minutes max
  let attempts = 0;

  while (attempts < maxAttempts) {
    const status = await checkVideoStatus(result.predictionId);

    if (onProgress) {
      onProgress(status.progress, status.message);
    }

    if (status.status === 'succeeded' && status.videoUrl) {
      return status.videoUrl;
    }

    if (status.status === 'failed' || status.status === 'canceled') {
      throw new Error(status.error || status.message);
    }

    // Wait 3 seconds before next poll
    await new Promise((resolve) => setTimeout(resolve, 3000));
    attempts++;
  }

  throw new Error('Video generation timed out');
}
