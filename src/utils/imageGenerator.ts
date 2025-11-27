interface StoryScene {
  id: number;
  text: string;
  title: string;
}

interface StoryData {
  idea: string;
  genre: string;
  tone: string;
  audience: string;
}

/**
 * Generates a detailed image prompt based on the story scene and overall story data
 */
export function generateDetailedImagePrompt(scene: StoryScene, storyData: StoryData): string {
  // Extract key visual elements from the scene text
  const visualElements = extractVisualElements(scene.text);
  
  // Create base prompt from scene content
  let prompt = createBasePrompt(scene.text, scene.title);
  
  // Add character descriptions
  const characters = extractCharacters(scene.text);
  if (characters.length > 0) {
    prompt += `, featuring ${characters.join(', ')}`;
  }
  
  // Add setting and environment
  const setting = extractSetting(scene.text, storyData.genre);
  if (setting) {
    prompt += `, ${setting}`;
  }
  
  // Add mood and atmosphere
  const atmosphere = createAtmosphere(scene.text, storyData.tone);
  if (atmosphere) {
    prompt += `, ${atmosphere}`;
  }
  
  // Add genre-specific elements
  const genreElements = getGenreElements(storyData.genre);
  if (genreElements) {
    prompt += `, ${genreElements}`;
  }
  
  return prompt.trim();
}

/**
 * Extracts visual elements like colors, objects, actions from text
 */
function extractVisualElements(text: string): string[] {
  const elements: string[] = [];
  
  // Color words
  const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'black', 'white', 'golden', 'silver', 'brown', 'gray', 'crimson', 'azure', 'emerald'];
  const colorMatches = colors.filter(color => text.toLowerCase().includes(color));
  elements.push(...colorMatches);
  
  // Objects and items
  const objects = ['door', 'window', 'tree', 'house', 'castle', 'sword', 'book', 'key', 'flower', 'mountain', 'river', 'forest', 'cave', 'bridge', 'tower', 'ship', 'car', 'horse', 'dragon', 'crown', 'ring', 'mirror', 'chest', 'statue'];
  const objectMatches = objects.filter(obj => text.toLowerCase().includes(obj));
  elements.push(...objectMatches);
  
  return elements;
}

/**
 * Creates a base visual prompt from the scene text
 */
function createBasePrompt(text: string, title: string): string {
  // Use the title as primary guidance
  let prompt = title;
  
  // Extract key phrases and actions
  const sentences = text.split('.').map(s => s.trim()).filter(s => s.length > 0);
  
  if (sentences.length > 0) {
    // Focus on the first sentence for main visual content
    const firstSentence = sentences[0];
    
    // Remove common story words and focus on visual content
    const visualWords = firstSentence
      .replace(/\b(said|told|thought|felt|knew|realized|remembered|wondered|decided|began|started|continued|finished|ended)\b/gi, '')
      .replace(/\b(the|a|an|and|or|but|in|on|at|to|for|of|with|by)\b/gi, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    
    if (visualWords.length > 10) {
      prompt = visualWords;
    }
  }
  
  return prompt;
}

/**
 * Extracts character descriptions from text
 */
function extractCharacters(text: string): string[] {
  const characters: string[] = [];
  
  // Common character types
  const characterTypes = [
    'girl', 'boy', 'woman', 'man', 'child', 'children', 'person', 'people',
    'princess', 'prince', 'king', 'queen', 'knight', 'wizard', 'witch',
    'hero', 'heroine', 'villain', 'warrior', 'mage', 'archer', 'thief',
    'dragon', 'unicorn', 'fairy', 'elf', 'dwarf', 'giant', 'monster',
    'robot', 'alien', 'android', 'cyborg', 'detective', 'scientist',
    'pirate', 'sailor', 'captain', 'traveler', 'explorer', 'adventurer'
  ];
  
  const lowerText = text.toLowerCase();
  characterTypes.forEach(type => {
    if (lowerText.includes(type)) {
      characters.push(type);
    }
  });
  
  // Remove duplicates
  return [...new Set(characters)];
}

/**
 * Extracts setting and environment from text
 */
function extractSetting(text: string, genre: string): string {
  const lowerText = text.toLowerCase();
  
  // Location-based settings
  const locations = {
    forest: ['forest', 'woods', 'jungle', 'trees'],
    castle: ['castle', 'palace', 'fortress', 'tower'],
    city: ['city', 'town', 'street', 'building'],
    ocean: ['ocean', 'sea', 'beach', 'shore', 'waves'],
    mountain: ['mountain', 'hill', 'peak', 'cliff'],
    cave: ['cave', 'cavern', 'underground', 'tunnel'],
    sky: ['sky', 'clouds', 'flying', 'floating'],
    desert: ['desert', 'sand', 'dunes', 'oasis'],
    space: ['space', 'stars', 'planet', 'galaxy', 'spaceship'],
    house: ['house', 'home', 'room', 'attic', 'basement'],
    garden: ['garden', 'park', 'meadow', 'field'],
    laboratory: ['laboratory', 'lab', 'experiment', 'research']
  };
  
  for (const [setting, keywords] of Object.entries(locations)) {
    if (keywords.some(keyword => lowerText.includes(keyword))) {
      return getSettingDescription(setting, genre);
    }
  }
  
  // Default setting based on genre
  return getDefaultSetting(genre);
}

/**
 * Gets detailed setting description based on location and genre
 */
function getSettingDescription(setting: string, genre: string): string {
  const descriptions: Record<string, Record<string, string>> = {
    forest: {
      fantasy: 'mystical enchanted forest with magical glowing elements',
      'sci-fi': 'alien forest with bioluminescent plants and strange trees',
      mystery: 'dark mysterious forest with fog and shadows',
      adventure: 'lush adventure forest with ancient trees and hidden paths',
      comedy: 'cheerful cartoon forest with friendly animals'
    },
    castle: {
      fantasy: 'majestic fantasy castle with towers and magical aura',
      'sci-fi': 'futuristic fortress with advanced technology',
      mystery: 'gothic castle with mysterious shadows and secrets',
      adventure: 'grand adventure castle on a hilltop',
      comedy: 'whimsical cartoon castle with bright colors'
    },
    city: {
      fantasy: 'magical medieval city with fantasy architecture',
      'sci-fi': 'futuristic cyberpunk city with neon lights and flying vehicles',
      mystery: 'noir city streets with dramatic lighting',
      adventure: 'bustling adventure city with diverse architecture',
      comedy: 'colorful cartoon city with funny buildings'
    }
  };
  
  return descriptions[setting]?.[genre] || `${setting} environment with ${genre} elements`;
}

/**
 * Gets default setting based on genre
 */
function getDefaultSetting(genre: string): string {
  const defaultSettings: Record<string, string> = {
    fantasy: 'magical fantasy realm with enchanted elements',
    'sci-fi': 'futuristic sci-fi environment with advanced technology',
    mystery: 'mysterious atmospheric setting with dramatic lighting',
    adventure: 'exciting adventure landscape with epic scale',
    comedy: 'bright cheerful setting with whimsical elements',
    drama: 'emotional dramatic setting with meaningful atmosphere'
  };
  
  return defaultSettings[genre] || 'beautiful detailed environment';
}

/**
 * Creates atmosphere description based on text content and tone
 */
function createAtmosphere(text: string, tone: string): string {
  const lowerText = text.toLowerCase();
  
  // Emotion and mood keywords
  const moodKeywords = {
    happy: ['happy', 'joy', 'smile', 'laugh', 'cheerful', 'bright', 'wonderful'],
    sad: ['sad', 'cry', 'tear', 'sorrow', 'melancholy', 'gloomy'],
    scared: ['scared', 'afraid', 'fear', 'terrified', 'frightened', 'nervous'],
    excited: ['excited', 'thrilled', 'eager', 'enthusiastic', 'energetic'],
    peaceful: ['peaceful', 'calm', 'serene', 'quiet', 'tranquil', 'gentle'],
    dramatic: ['dramatic', 'intense', 'powerful', 'strong', 'urgent', 'critical'],
    mysterious: ['mysterious', 'secret', 'hidden', 'unknown', 'strange', 'puzzling']
  };
  
  // Find mood from text
  let detectedMood = '';
  for (const [mood, keywords] of Object.entries(moodKeywords)) {
    if (keywords.some(keyword => lowerText.includes(keyword))) {
      detectedMood = mood;
      break;
    }
  }
  
  // Combine detected mood with tone
  const atmospheres: Record<string, string> = {
    happy: 'bright cheerful atmosphere with warm lighting',
    sad: 'melancholic atmosphere with soft muted colors',
    scared: 'tense atmospheric lighting with dramatic shadows',
    excited: 'dynamic energetic atmosphere with vibrant colors',
    peaceful: 'serene calm atmosphere with gentle lighting',
    dramatic: 'intense dramatic atmosphere with powerful composition',
    mysterious: 'mysterious atmospheric mood with intriguing shadows'
  };
  
  const toneAtmospheres: Record<string, string> = {
    dark: 'dark moody atmosphere with dramatic lighting',
    lighthearted: 'bright uplifting atmosphere with cheerful mood',
    epic: 'epic grandiose atmosphere with dramatic scale',
    mysterious: 'mysterious enigmatic atmosphere',
    romantic: 'romantic soft atmosphere with warm gentle lighting',
    adventurous: 'adventurous dynamic atmosphere with exciting energy'
  };
  
  return detectedMood ? atmospheres[detectedMood] : toneAtmospheres[tone] || 'beautiful atmospheric lighting';
}

/**
 * Gets genre-specific visual elements
 */
function getGenreElements(genre: string): string {
  const genreElements: Record<string, string> = {
    fantasy: 'magical sparkles, mystical aura, fantasy elements',
    'sci-fi': 'futuristic technology, sci-fi elements, advanced design',
    mystery: 'mysterious shadows, noir elements, investigative mood',
    adventure: 'epic adventure elements, heroic composition, dynamic action',
    comedy: 'humorous visual elements, cartoonish style, playful details',
    drama: 'emotional depth, character-focused composition, meaningful details',
    horror: 'spooky atmospheric elements, dark mood, eerie details',
    romance: 'romantic soft elements, warm colors, tender mood'
  };
  
  return genreElements[genre] || '';
}

/**
 * Optimizes prompt for better image generation
 */
export function optimizePromptForGeneration(prompt: string): string {
  // Remove redundant words and optimize for AI image generation
  let optimized = prompt
    .replace(/\b(very|really|quite|somewhat|rather)\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
  
  // Ensure prompt is not too long (most AI models work better with concise prompts)
  if (optimized.length > 200) {
    const sentences = optimized.split(',').map(s => s.trim());
    optimized = sentences.slice(0, 4).join(', ');
  }
  
  return optimized;
}