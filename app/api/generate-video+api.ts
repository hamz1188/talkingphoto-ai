import axios from 'axios';

const REPLICATE_API_URL = 'https://api.replicate.com/v1/predictions';
const REPLICATE_FILES_URL = 'https://api.replicate.com/v1/files';

interface ReplicatePrediction {
  id: string;
  status: 'starting' | 'processing' | 'succeeded' | 'failed' | 'canceled';
  output?: string | string[];
  error?: string;
  logs?: string;
}

interface ReplicateFile {
  id: string;
  urls: {
    get: string;
  };
}

// Upload a data URL to Replicate and get an HTTP URL back
async function uploadToReplicate(
  dataUrl: string,
  filename: string,
  apiToken: string
): Promise<string> {
  const matches = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!matches) {
    throw new Error('Invalid data URL format');
  }

  const mimeType = matches[1];
  const base64Data = matches[2];
  const buffer = Buffer.from(base64Data, 'base64');

  const FormData = (await import('form-data')).default;
  const form = new FormData();
  form.append('content', buffer, {
    filename,
    contentType: mimeType,
  });

  const response = await axios.post<ReplicateFile>(REPLICATE_FILES_URL, form, {
    headers: {
      Authorization: `Bearer ${apiToken}`,
      ...form.getHeaders(),
    },
  });

  return response.data.urls.get;
}

export async function POST(request: Request) {
  try {
    const { imageUrl, audioUrl } = await request.json();

    if (!imageUrl || !audioUrl) {
      return Response.json(
        { error: 'Image URL and audio URL are required' },
        { status: 400 }
      );
    }

    const apiToken = process.env.REPLICATE_API_TOKEN;
    if (!apiToken) {
      return Response.json(
        { error: 'Replicate API token not configured' },
        { status: 500 }
      );
    }

    console.log('Starting video generation...');

    // Upload files to Replicate if they are data URLs
    let imageHttpUrl = imageUrl;
    let audioHttpUrl = audioUrl;

    if (imageUrl.startsWith('data:')) {
      console.log('Uploading image to Replicate...');
      imageHttpUrl = await uploadToReplicate(imageUrl, 'image.jpg', apiToken);
      console.log('Image uploaded:', imageHttpUrl);
    }

    if (audioUrl.startsWith('data:')) {
      console.log('Uploading audio to Replicate...');
      audioHttpUrl = await uploadToReplicate(audioUrl, 'audio.mp3', apiToken);
      console.log('Audio uploaded:', audioHttpUrl);
    }

    // Use Wan-2.2-S2V for audio-driven video generation from image
    const createResponse = await axios.post<ReplicatePrediction>(
      REPLICATE_API_URL,
      {
        version: '09607e6e761d2f015b0d740f938ec59199f54aa623384465a5054b230405acf4',
        input: {
          image: imageHttpUrl,
          audio: audioHttpUrl,
          prompt: 'A person talking naturally with lip sync to the audio',
          num_frames_per_chunk: 81,
          interpolate: true,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${apiToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const predictionId = createResponse.data.id;
    console.log('Prediction started:', predictionId);

    // Return prediction ID immediately - client will poll for status
    return Response.json({
      predictionId,
      status: 'starting',
      message: 'Video generation started'
    });
  } catch (error) {
    console.error('Video generation error:', error);
    const message =
      error instanceof Error ? error.message : 'Failed to generate video';
    return Response.json({ error: message }, { status: 500 });
  }
}
