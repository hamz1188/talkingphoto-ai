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

export async function generateVideo(
  imageUrl: string,
  audioUrl: string
): Promise<string> {
  const response = await fetch(`${API_BASE}/generate-video`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ imageUrl, audioUrl }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to generate video');
  }

  const data = await response.json();
  return data.videoUrl;
}
