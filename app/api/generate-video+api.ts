import axios from 'axios';

const REPLICATE_API_URL = 'https://api.replicate.com/v1/predictions';

interface ReplicatePrediction {
  id: string;
  status: 'starting' | 'processing' | 'succeeded' | 'failed' | 'canceled';
  output?: string | string[];
  error?: string;
}

async function waitForPrediction(
  predictionId: string,
  apiToken: string
): Promise<ReplicatePrediction> {
  const maxAttempts = 60; // Max 5 minutes (60 * 5 seconds)
  let attempts = 0;

  while (attempts < maxAttempts) {
    const response = await axios.get<ReplicatePrediction>(
      `${REPLICATE_API_URL}/${predictionId}`,
      {
        headers: {
          Authorization: `Bearer ${apiToken}`,
        },
      }
    );

    const prediction = response.data;

    if (prediction.status === 'succeeded') {
      return prediction;
    }

    if (prediction.status === 'failed' || prediction.status === 'canceled') {
      throw new Error(prediction.error || 'Prediction failed');
    }

    // Wait 5 seconds before polling again
    await new Promise((resolve) => setTimeout(resolve, 5000));
    attempts++;
  }

  throw new Error('Prediction timed out');
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

    // Start the prediction using SadTalker model
    const createResponse = await axios.post<ReplicatePrediction>(
      REPLICATE_API_URL,
      {
        // SadTalker model for lip-sync animation
        version:
          'cjwbw/sadtalker:3aa3dac9353cc4d6bd62a8f95957bd844003b401ca4e4a9b33baa574c549d376',
        input: {
          source_image: imageUrl,
          driven_audio: audioUrl,
          enhancer: 'gfpgan', // Face enhancement
          preprocess: 'crop', // Crop face from image
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

    // Poll for completion
    const result = await waitForPrediction(predictionId, apiToken);

    // Get the video URL from output
    const videoUrl = Array.isArray(result.output)
      ? result.output[0]
      : result.output;

    if (!videoUrl) {
      return Response.json(
        { error: 'No video URL in response' },
        { status: 500 }
      );
    }

    return Response.json({ videoUrl });
  } catch (error) {
    console.error('Video generation error:', error);
    const message =
      error instanceof Error ? error.message : 'Failed to generate video';
    return Response.json({ error: message }, { status: 500 });
  }
}
