// src/pages/api/image-generation.ts
// API route for Stability.ai image generation

export async function POST(request: Request) {
  try {
    const { prompt, width = 1024, height = 768 } = await request.json();

    if (!prompt) {
      return new Response(JSON.stringify({ success: false, error: "Missing prompt" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const STABILITY_API_KEY = process.env.STABILITY_API_KEY;
    if (!STABILITY_API_KEY) {
      return new Response(JSON.stringify({ success: false, error: "Server missing STABILITY_API_KEY" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Call Stability API
    const resp = await fetch("https://api.stability.ai/v1/generation/stable-diffusion-v1-5/text-to-image", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${STABILITY_API_KEY}`,
      },
      body: JSON.stringify({
        text_prompts: [{ text: prompt }],
        cfg_scale: 7,
        height,
        width,
        samples: 1,
      }),
    });

    if (!resp.ok) {
      const errorText = await resp.text();
      console.error("Stability error:", errorText);
      return new Response(JSON.stringify({ success: false, error: "Stability API error", details: errorText }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const json = await resp.json();

    if (!json.artifacts || json.artifacts.length === 0) {
      return new Response(JSON.stringify({ success: false, error: "No image returned from Stability" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const base64Image = json.artifacts[0].base64;
    const imageUrl = `data:image/png;base64,${base64Image}`;

    return new Response(JSON.stringify({
      success: true,
      imageUrl,
      prompt,
    }), {
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Image generation error:", error);
    return new Response(JSON.stringify({
      success: false,
      error: "Failed to generate image",
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
