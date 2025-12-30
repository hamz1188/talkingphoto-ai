import axios from 'axios';

const REPLICATE_API_URL = 'https://api.replicate.com/v1/predictions';

interface ReplicatePrediction {
  id: string;
  status: 'starting' | 'processing' | 'succeeded' | 'failed' | 'canceled';
  output?: string | string[] | { video?: string; pose?: string };
  error?: string;
  logs?: string;
  metrics?: {
    predict_time?: number;
  };
}

export async function POST(request: Request) {
  try {
    const { predictionId } = await request.json();

    if (!predictionId) {
      return Response.json(
        { error: 'Prediction ID is required' },
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

    const response = await axios.get<ReplicatePrediction>(
      `${REPLICATE_API_URL}/${predictionId}`,
      {
        headers: {
          Authorization: `Bearer ${apiToken}`,
        },
      }
    );

    const prediction = response.data;
    console.log(`Status check: ${prediction.status}`);

    // Calculate progress percentage based on status
    let progress = 0;
    let message = '';

    switch (prediction.status) {
      case 'starting':
        progress = 10;
        message = 'Starting up GPU...';
        break;
      case 'processing':
        progress = 50;
        message = 'Generating lip-sync video...';
        break;
      case 'succeeded':
        progress = 100;
        message = 'Video ready!';
        break;
      case 'failed':
        progress = 0;
        message = prediction.error || 'Generation failed';
        break;
      case 'canceled':
        progress = 0;
        message = 'Generation canceled';
        break;
    }

    // Get video URL if succeeded
    let videoUrl: string | null = null;
    if (prediction.status === 'succeeded' && prediction.output) {
      // Handle different output formats from various models
      if (typeof prediction.output === 'string') {
        videoUrl = prediction.output;
      } else if (Array.isArray(prediction.output)) {
        videoUrl = prediction.output[0];
      } else if (typeof prediction.output === 'object' && prediction.output.video) {
        // AniPortrait returns { video, pose }
        videoUrl = prediction.output.video;
      }
    }

    return Response.json({
      status: prediction.status,
      progress,
      message,
      videoUrl,
      error: prediction.status === 'failed' ? prediction.error : null,
    });
  } catch (error) {
    console.error('Status check error:', error);
    const message =
      error instanceof Error ? error.message : 'Failed to check status';
    return Response.json({ error: message }, { status: 500 });
  }
}
