/**
 * Real AI Image Generation Service using Stability.ai API (through our Next.js route)
 */

export class RealImageGenerationService {
  private static instance: RealImageGenerationService;

  static getInstance(): RealImageGenerationService {
    if (!RealImageGenerationService.instance) {
      RealImageGenerationService.instance = new RealImageGenerationService();
    }
    return RealImageGenerationService.instance;
  }

  /**
   * Generate a real AI image using our Next.js API route
   */
  async generateStoryImage(prompt: string, sceneIndex: number): Promise<string> {
    try {
      console.log(`Requesting AI image for scene ${sceneIndex + 1}:`, prompt);

      const resp = await fetch("/api/image-generation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, width: 1024, height: 768 }),
      });

      const data = await resp.json();

      if (!data.success) {
        console.error("Image generation failed:", data.error);
        return "";
      }

      // Stability API returns base64 as data URL
      return data.imageUrl;
    } catch (error) {
      console.error("Error generating real image:", error);
      return "";
    }
  }
}

export const realImageService = RealImageGenerationService.getInstance();
