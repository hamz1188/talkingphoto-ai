import { generateText } from 'ai';
import { google } from '@ai-sdk/google';

export async function POST(request: Request) {
  try {
    const { imageBase64 } = await request.json();

    if (!imageBase64) {
      return Response.json({ error: 'Image is required' }, { status: 400 });
    }

    const { text } = await generateText({
      model: google('gemini-2.0-flash'),
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              image: imageBase64,
            },
            {
              type: 'text',
              text: `Analyze this image and generate a short, funny script (2-3 sentences, max 150 characters) for what the subject in the photo might say.

If it's a pet, make it humorous and relatable (like complaining about food or wanting attention).
If it's a person, make it lighthearted and fun.

Just respond with the script text only, no quotes or attribution.`,
            },
          ],
        },
      ],
    });

    return Response.json({ script: text });
  } catch (error) {
    console.error('Script generation error:', error);
    return Response.json(
      { error: 'Failed to generate script' },
      { status: 500 }
    );
  }
}
