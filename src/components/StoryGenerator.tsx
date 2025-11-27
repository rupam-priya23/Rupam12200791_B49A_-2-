import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Loader2, Sparkles, BookOpen, Image as ImageIcon, ArrowLeft, ArrowRight } from 'lucide-react';
import { useImageGeneration } from '@/hooks/useImageGeneration';
import { toast } from 'sonner';

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

const StoryGenerator = () => {
  const [storyIdea, setStoryIdea] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedTone, setSelectedTone] = useState('');
  const [selectedAudience, setSelectedAudience] = useState('');
  const [isGeneratingStory, setIsGeneratingStory] = useState(false);
  const [generatedStory, setGeneratedStory] = useState<StoryScene[]>([]);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [step, setStep] = useState<'input' | 'story' | 'complete'>('input');
  
  const { generateSceneImages, isGenerating: isGeneratingImages, generationProgress } = useImageGeneration();

  const genres = [
    'fantasy', 'sci-fi', 'mystery', 'adventure', 'comedy', 'drama', 'horror', 'romance'
  ];

  const tones = [
    'lighthearted', 'dark', 'epic', 'mysterious', 'adventurous', 'romantic', 'peaceful', 'intense'
  ];

  const audiences = [
    'kids', 'teens', 'adults'
  ];

  const generateStory = async () => {
    if (!storyIdea.trim()) {
      toast.error('Please enter a story idea');
      return;
    }

    setIsGeneratingStory(true);
    
    try {
      // Enhanced story generation with better structure and creativity
      const storyData: StoryData = {
        idea: storyIdea,
        genre: selectedGenre || 'adventure',
        tone: selectedTone || 'lighthearted',
        audience: selectedAudience || 'kids'
      };

      // Generate 5 comprehensive story scenes
      const scenes = await generateEnhancedStory(storyData);
      setGeneratedStory(scenes);
      setStep('story');
      
      toast.success('Story generated successfully!');
      
      // Generate images for all scenes
      toast.info('Generating beautiful illustrations...');
      const scenesWithImages = await generateSceneImages(scenes, storyData);
      setGeneratedStory(scenesWithImages);
      setStep('complete');
      
      toast.success('Story complete with illustrations!');
      
    } catch (error) {
      console.error('Error generating story:', error);
      toast.error('Failed to generate story. Please try again.');
    } finally {
      setIsGeneratingStory(false);
    }
  };

  const generateEnhancedStory = async (storyData: StoryData): Promise<StoryScene[]> => {
    // Simulate API call with enhanced story generation logic
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const { idea, genre, tone, audience } = storyData;
    
    // Create more sophisticated and engaging narratives
    const storyTemplates = {
      fantasy: {
        kids: [
          {
            title: "The Discovery",
            template: "In a magical land where {idea}, a young hero discovers something extraordinary that will change everything. The air shimmers with possibility as they take their first steps into adventure."
          },
          {
            title: "The Challenge Appears",
            template: "But not all is as peaceful as it seems. A great challenge emerges that threatens the harmony of this magical world. Our hero must find courage they never knew they had."
          },
          {
            title: "The Journey Begins",
            template: "With determination in their heart, our hero sets out on an incredible journey. Along the way, they meet wonderful friends who join them in their quest to save their world."
          },
          {
            title: "The Great Test",
            template: "At the moment when all seems lost, our hero faces the greatest test of all. Using everything they've learned and with the help of their friends, they discover the true power of believing in themselves."
          },
          {
            title: "The Happy Ending",
            template: "Peace and joy return to the magical land. Our hero has grown wise and brave, and the world is more beautiful than ever before. The adventure has ended, but the magic lives on forever."
          }
        ],
        teens: [
          {
            title: "The Awakening",
            template: "In a world where {idea}, everything changes when ancient powers awaken. The balance between light and darkness hangs in the balance as destiny calls to unlikely heroes."
          },
          {
            title: "The Prophecy Unfolds",
            template: "An ancient prophecy speaks of a time when heroes must rise to face an emerging darkness. As evil forces gather strength, the chosen ones must embrace their destiny."
          },
          {
            title: "Trials of Power",
            template: "The heroes face trials that test not only their magical abilities but their bonds of friendship. Each challenge reveals deeper truths about their powers and their purpose."
          },
          {
            title: "The Final Battle",
            template: "In an epic confrontation between good and evil, our heroes must use everything they've learned. The fate of both worlds hangs in the balance as they make their ultimate stand."
          },
          {
            title: "New Beginnings",
            template: "With victory achieved and wisdom gained, our heroes look toward a future full of possibility. They have grown into the legends they were meant to become."
          }
        ]
      },
      'sci-fi': {
        kids: [
          {
            title: "Future Discovery",
            template: "In the amazing world of tomorrow where {idea}, a curious young explorer makes a discovery that could change everything. Technology and wonder go hand in hand in this bright future."
          },
          {
            title: "The Problem",
            template: "But even in this advanced world, problems arise. A malfunction in the great machines threatens the peaceful life everyone enjoys, and someone needs to find a solution."
          },
          {
            title: "Teamwork and Innovation",
            template: "Working together with their robot friends and using incredible future technology, our young hero starts to unravel the mystery and find creative solutions."
          },
          {
            title: "The Big Fix",
            template: "Using their intelligence, creativity, and the help of artificial intelligence friends, our hero implements a brilliant solution that saves the day and makes things even better."
          },
          {
            title: "A Brighter Tomorrow",
            template: "The future is brighter than ever as harmony is restored. Technology and humanity work together perfectly, creating endless possibilities for adventure and discovery."
          }
        ]
      },
      // Add more genre templates...
    };

    // Get appropriate template based on genre and audience
    const genreTemplates = storyTemplates[genre as keyof typeof storyTemplates];
    const templates = genreTemplates?.[audience as keyof typeof genreTemplates] || storyTemplates.fantasy.kids;

    // Generate scenes with rich, contextual content
    return templates.map((template, index) => ({
      id: index + 1,
      title: template.title,
      text: template.template.replace('{idea}', idea) + 
            ` The ${tone} atmosphere fills this ${genre} tale, making it perfect for ${audience} who love stories full of wonder and excitement.`
    }));
  };

  const nextScene = () => {
    if (currentSceneIndex < generatedStory.length - 1) {
      setCurrentSceneIndex(currentSceneIndex + 1);
    }
  };

  const prevScene = () => {
    if (currentSceneIndex > 0) {
      setCurrentSceneIndex(currentSceneIndex - 1);
    }
  };

  const resetGenerator = () => {
    setStep('input');
    setGeneratedStory([]);
    setCurrentSceneIndex(0);
    setStoryIdea('');
    setSelectedGenre('');
    setSelectedTone('');
    setSelectedAudience('');
  };

  if (step === 'input') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-story-primary via-story-secondary to-story-accent">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-2">
                <Sparkles className="h-8 w-8" />
                AI Story Generator
              </h1>
              <p className="text-story-muted text-lg">
                Transform your ideas into beautiful illustrated stories
              </p>
            </div>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Create Your Story
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="story-idea" className="text-sm font-medium">
                    Story Idea *
                  </Label>
                  <Textarea
                    id="story-idea"
                    placeholder="e.g., A lonely robot finds a flower in a post-apocalyptic city..."
                    value={storyIdea}
                    onChange={(e) => setStoryIdea(e.target.value)}
                    className="mt-1 min-h-[100px]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Genre</Label>
                    <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Choose genre" />
                      </SelectTrigger>
                      <SelectContent>
                        {genres.map((genre) => (
                          <SelectItem key={genre} value={genre}>
                            {genre.charAt(0).toUpperCase() + genre.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Tone</Label>
                    <Select value={selectedTone} onValueChange={setSelectedTone}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Choose tone" />
                      </SelectTrigger>
                      <SelectContent>
                        {tones.map((tone) => (
                          <SelectItem key={tone} value={tone}>
                            {tone.charAt(0).toUpperCase() + tone.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Audience</Label>
                    <Select value={selectedAudience} onValueChange={setSelectedAudience}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Choose audience" />
                      </SelectTrigger>
                      <SelectContent>
                        {audiences.map((audience) => (
                          <SelectItem key={audience} value={audience}>
                            {audience.charAt(0).toUpperCase() + audience.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button 
                  onClick={generateStory}
                  disabled={isGeneratingStory || !storyIdea.trim()}
                  className="w-full story-button"
                  size="lg"
                >
                  {isGeneratingStory ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Your Story...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate Story
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  const currentScene = generatedStory[currentSceneIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-story-primary via-story-secondary to-story-accent">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <Button
              variant="ghost"
              onClick={resetGenerator}
              className="mb-4 text-white hover:bg-white/10"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Create New Story
            </Button>
            <h1 className="text-3xl font-bold text-white mb-2">Your Generated Story</h1>
            <div className="flex justify-center gap-2 mb-4">
              <Badge variant="secondary">{selectedGenre || 'Adventure'}</Badge>
              <Badge variant="secondary">{selectedTone || 'Lighthearted'}</Badge>
              <Badge variant="secondary">{selectedAudience || 'Kids'}</Badge>
            </div>
          </div>

          {/* Progress for image generation */}
          {isGeneratingImages && (
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-2">
                  <ImageIcon className="h-5 w-5 text-story-accent" />
                  <span className="font-medium">Generating Illustrations...</span>
                </div>
                <Progress value={generationProgress} className="h-2" />
                <p className="text-sm text-muted-foreground mt-2">
                  Creating beautiful AI-generated artwork for your story
                </p>
              </CardContent>
            </Card>
          )}

          {/* Story Display */}
          {currentScene && (
            <Card className="glass-card mb-6">
              <CardContent className="pt-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Story Text */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-story-accent border-story-accent">
                        Scene {currentScene.id} of {generatedStory.length}
                      </Badge>
                    </div>
                    <h2 className="text-2xl font-bold text-story-primary">
                      {currentScene.title}
                    </h2>
                    <p className="text-lg leading-relaxed text-gray-700">
                      {currentScene.text}
                    </p>
                  </div>

                  {/* Image */}
                  <div className="relative">
                    <div className="aspect-[4/3] bg-gradient-to-br from-story-primary/10 to-story-secondary/10 rounded-lg flex items-center justify-center overflow-hidden">
                      {currentScene.imageUrl ? (
                        <img
                          src={currentScene.imageUrl}
                          alt={currentScene.title}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : isGeneratingImages ? (
                        <div className="text-center p-4">
                          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-story-accent" />
                          <p className="text-sm text-gray-600">Generating artwork...</p>
                        </div>
                      ) : (
                        <div className="text-center p-4">
                          <ImageIcon className="h-12 w-12 mx-auto mb-2 text-story-accent" />
                          <p className="text-sm text-gray-600">
                            Illustration for "{currentScene.title}"
                          </p>
                        </div>
                      )}
                    </div>
                    {currentScene.imagePrompt && (
                      <p className="text-xs text-gray-500 mt-2 italic">
                        {currentScene.imagePrompt}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={prevScene}
              disabled={currentSceneIndex === 0}
              className="story-nav-button"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous Scene
            </Button>

            <div className="flex gap-2">
              {generatedStory.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSceneIndex(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentSceneIndex 
                      ? 'bg-story-accent' 
                      : 'bg-white/30 hover:bg-white/50'
                  }`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              onClick={nextScene}
              disabled={currentSceneIndex === generatedStory.length - 1}
              className="story-nav-button"
            >
              Next Scene
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryGenerator;