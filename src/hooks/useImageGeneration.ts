// src/hooks/useImageGeneration.ts
import { useState } from "react";
import { generateDetailedImagePrompt } from "@/utils/imageGenerator";

interface StoryScene {
  id: number;
  text: string;
  title: string;
  imageUrl?: string;
  imagePrompt?: string;
}

interface StoryData {
  idea: string;
  genre: string;
  tone: string;
  audience: string;
}

// --- API call to our Stability backend ---
async function callStabilityAPI(prompt: string, width = 1024, height = 768): Promise<string> {
  const resp = await fetch("/api/image-generation", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, width, height }),
  });
  const json = await resp.json();
  if (!json.success) throw new Error(json.error || "Stability API failed");
  return json.imageUrl; // base64 data URL
}

// --- Artistic Placeholder Fallback ---
async function generatePlaceholder(prompt: string, sceneIndex: number): Promise<string> {
  return `data:image/svg+xml,${encodeURIComponent(`
    <svg width="1024" height="768" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad${sceneIndex}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#8B5CF6;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#EC4899;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="1024" height="768" fill="url(#grad${sceneIndex})" />
      <text x="50%" y="50%" font-size="32" text-anchor="middle" fill="white">
        ${prompt.slice(0, 40)}...
      </text>
    </svg>
  `)}`;
}

// --- Hook ---
export function useImageGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);

  const generateSceneImages = async (
    scenes: StoryScene[],
    storyData: StoryData
  ): Promise<StoryScene[]> => {
    setIsGenerating(true);
    setGenerationProgress(0);

    try {
      const scenesWithImages: StoryScene[] = [];
      const totalScenes = scenes.length;

      for (let i = 0; i < totalScenes; i++) {
        const scene = scenes[i];
        setGenerationProgress(((i + 1) / totalScenes) * 100);

        try {
          const imagePrompt = generateDetailedImagePrompt(scene, storyData);
          const stylePrompt = getArtisticStyle(
            storyData.genre,
            storyData.audience,
            storyData.tone
          );
          const fullPrompt = `${imagePrompt}, ${stylePrompt}, high quality, detailed illustration, storybook art`;

          console.log(`Generating image for scene ${i + 1}:`, fullPrompt);

          // Try Stability API
          let imageUrl: string;
          try {
            imageUrl = await callStabilityAPI(fullPrompt);
          } catch (apiError) {
            console.warn("Stability API failed, using placeholder:", apiError);
            imageUrl = await generatePlaceholder(fullPrompt, i);
          }

          scenesWithImages.push({
            ...scene,
            imageUrl,
            imagePrompt: fullPrompt,
          });
        } catch (sceneError) {
          console.error(`Error generating image for scene ${i + 1}:`, sceneError);
          scenesWithImages.push({
            ...scene,
            imageUrl: undefined,
            imagePrompt: generateDetailedImagePrompt(scene, storyData),
          });
        }

        if (i < totalScenes - 1) {
          await new Promise((resolve) => setTimeout(resolve, 1500));
        }
      }

      return scenesWithImages;
    } finally {
      setIsGenerating(false);
      setTimeout(() => setGenerationProgress(0), 2000);
    }
  };

  const regenerateSceneImage = async (
    sceneId: number,
    scenes: StoryScene[],
    storyData: StoryData
  ): Promise<StoryScene | null> => {
    const scene = scenes.find((s) => s.id === sceneId);
    if (!scene) return null;

    const imagePrompt = generateDetailedImagePrompt(scene, storyData);
    const stylePrompt = getArtisticStyle(
      storyData.genre,
      storyData.audience,
      storyData.tone
    );
    const fullPrompt = `${imagePrompt}, ${stylePrompt}, high quality, detailed illustration, storybook art`;

    let imageUrl: string;
    try {
      imageUrl = await callStabilityAPI(fullPrompt);
    } catch (apiError) {
      console.warn("Stability API failed, using placeholder:", apiError);
      imageUrl = await generatePlaceholder(fullPrompt, sceneId - 1);
    }

    return { ...scene, imageUrl, imagePrompt: fullPrompt };
  };

  return { generateSceneImages, regenerateSceneImage, isGenerating, generationProgress };
}

// --- Artistic style helper ---
function getArtisticStyle(genre: string, audience: string, tone: string): string {
  const styles = {
    fantasy: {
      kids: "whimsical children’s book, bright magical colors",
      teens: "fantasy art, epic, mystical, detailed",
      adults: "dark fantasy, atmospheric, intricate",
    },
    "sci-fi": {
      kids: "cartoon sci-fi, friendly robots, space adventure",
      teens: "cyberpunk, neon, futuristic, dynamic",
      adults: "realistic sci-fi, cinematic lighting, concept art",
    },
    mystery: {
      kids: "gentle mystery, warm colors, cozy detective",
      teens: "noir style, dramatic lighting, intriguing",
      adults: "dark mystery, sophisticated, atmospheric",
    },
    adventure: {
      kids: "bright cartoon adventure, fun and colorful",
      teens: "dynamic action, heroic characters",
      adults: "cinematic adventure, epic composition",
    },
  };

  const genreStyles = styles[genre as keyof typeof styles] || styles.adventure;
  const audienceStyle =
    genreStyles[audience as keyof typeof genreStyles] || genreStyles.kids;

  const toneModifiers = {
    dark: ", moody, dramatic shadows",
    lighthearted: ", cheerful, uplifting",
    epic: ", grand, heroic, majestic",
    mysterious: ", enigmatic, shadowy",
    romantic: ", warm, emotional, soft light",
    adventurous: ", dynamic, exciting action",
    peaceful: ", serene, calm colors",
    intense: ", high energy, powerful composition",
  };

  const toneModifier = toneModifiers[tone as keyof typeof toneModifiers] || "";
  return `${audienceStyle}${toneModifier}`;
}
