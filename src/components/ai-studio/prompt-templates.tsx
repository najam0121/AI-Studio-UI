import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BookOpen,
  Code,
  PenTool,
  MessageSquare,
  Plus,
  Search,
  Star,
  Trash2,
  Brain,
  Lightbulb,
  Target,
  Zap,
  FileText,
  Mail,
  Users,
  TrendingUp,
  Shield,
  Database,
  Globe,
  Camera,
  Music,
  Palette,
  Calculator,
  Heart,
  Rocket,
  Coffee,
  Book,
  Briefcase,
  Settings,
  Award,
  Clock,
  Map,
  Smartphone,
  Headphones,
  Video,
  Image,
  Mic,
  Edit,
  Layout,
  Layers,
  Grid,
  Compass,
  Flag,
  Gift,
  Home,
  Key,
  Lock,
  Megaphone,
  Monitor,
  Package,
  Phone,
  Printer,
  Radio,
  Scissors,
  Server,
  Shuffle,
  Sliders,
  Tablet,
  Tag,
  Thermometer,
  Truck,
  Umbrella,
  Watch,
  Wifi,
  Wind,
  Wrench
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface PromptTemplate {
  id: string;
  title: string;
  category: string;
  content: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  favorite: boolean;
}

const defaultTemplates: PromptTemplate[] = [
  {
    id: "1",
    title: "Code Review",
    category: "Development",
    content: "Please review the following code for:\n- Best practices\n- Performance optimization\n- Security concerns\n- Readability improvements\n\nCode:\n```\n[Your code here]\n```",
    description: "Comprehensive code review template",
    icon: Code,
    favorite: false,
  },
  {
    id: "2",
    title: "Creative Writing",
    category: "Writing",
    content: "Write a creative story with the following parameters:\n- Genre: [Specify genre]\n- Setting: [Describe setting]\n- Main character: [Character description]\n- Conflict: [Central conflict]\n- Tone: [Desired tone]\n\nLength: Approximately [word count] words.",
    description: "Structured creative writing prompt",
    icon: PenTool,
    favorite: true,
  },
  {
    id: "3",
    title: "Learning Assistant",
    category: "Education",
    content: "Explain [topic] to me as if I'm a [beginner/intermediate/advanced] learner. Include:\n- Key concepts\n- Real-world examples\n- Common misconceptions\n- Practice questions\n\nMake it engaging and easy to understand.",
    description: "Educational content creation",
    icon: BookOpen,
    favorite: false,
  },
  {
    id: "4",
    title: "Brainstorming Session",
    category: "Strategy",
    content: "Help me brainstorm ideas for: [Your topic/challenge]\n\nContext: [Provide relevant background]\nGoals: [What you want to achieve]\nConstraints: [Any limitations]\n\nGenerate 10 creative and practical solutions.",
    description: "Structured brainstorming template",
    icon: MessageSquare,
    favorite: false,
  },
];

interface PromptTemplatesProps {
  onTemplateSelect: (template: PromptTemplate) => void;
}

export function PromptTemplates({ onTemplateSelect }: PromptTemplatesProps) {
  const [templates, setTemplates] = useState<PromptTemplate[]>(defaultTemplates);
  const [searchQuery, setSearchQuery] = useState("");
  const [newTemplate, setNewTemplate] = useState({
    title: "",
    category: "",
    content: "",
    description: "",
  });
  const [customCategoryInput, setCustomCategoryInput] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const filteredTemplates = templates.filter(
    (template) =>
      template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const favoriteTemplates = filteredTemplates.filter((t) => t.favorite);
  const otherTemplates = filteredTemplates.filter((t) => !t.favorite);

  const toggleFavorite = (id: string) => {
    setTemplates((prev) =>
      prev.map((t) => (t.id === id ? { ...t, favorite: !t.favorite } : t))
    );
  };

  const deleteTemplate = (id: string) => {
    setTemplates((prev) => prev.filter((t) => t.id !== id));
  };

  const createTemplate = () => {
    if (!newTemplate.title || !newTemplate.content) return;

    // Use custom category input if "custom" was selected, otherwise use selected category
    const finalCategory = newTemplate.category === "custom" ? customCategoryInput.trim() : newTemplate.category;

    if (!finalCategory) return; // Don't create template without category

    const template: PromptTemplate = {
      id: Date.now().toString(),
      ...newTemplate,
      category: finalCategory,
      icon: generateIconForTitle(newTemplate.title),
      favorite: false,
    };

    setTemplates((prev) => [...prev, template]);
    setNewTemplate({ title: "", category: "", content: "", description: "" });
    setCustomCategoryInput("");
    setIsCreateDialogOpen(false);
  };

  const predefinedCategories = [
    { name: "Development", color: "bg-primary text-primary-foreground" },
    { name: "Writing", color: "bg-accent text-accent-foreground" },
    { name: "Education", color: "bg-success text-success-foreground" },
    { name: "Strategy", color: "bg-warning text-warning-foreground" },
    { name: "Analysis", color: "bg-blue-500 text-white" },
    { name: "Creative", color: "bg-purple-500 text-white" },
    { name: "Business", color: "bg-green-500 text-white" },
    { name: "Research", color: "bg-orange-500 text-white" },
  ];

  const getCategoryColor = (category: string) => {
    const predefined = predefinedCategories.find(cat => cat.name === category);
    if (predefined) return predefined.color;

    // Generate color for custom categories based on hash
    const hash = category.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);

    const colors = [
      "bg-red-500 text-white",
      "bg-blue-500 text-white",
      "bg-green-500 text-white",
      "bg-yellow-500 text-black",
      "bg-purple-500 text-white",
      "bg-pink-500 text-white",
      "bg-indigo-500 text-white",
      "bg-teal-500 text-white"
    ];

    return colors[Math.abs(hash) % colors.length];
  };

  // Icon pool for template generation
  const availableIcons = [
    Brain, Lightbulb, Target, Zap, FileText, Mail, Users, TrendingUp,
    Shield, Database, Globe, Camera, Music, Palette, Calculator, Heart,
    Rocket, Coffee, Book, Briefcase, Settings, Award, Clock, Map,
    Smartphone, Headphones, Video, Image, Mic, Edit, Layout, Layers,
    Grid, Compass, Flag, Gift, Home, Key, Lock, Megaphone, Monitor,
    Package, Phone, Printer, Radio, Scissors, Server, Shuffle, Sliders,
    Tablet, Tag, Thermometer, Truck, Umbrella, Watch, Wifi, Wind, Wrench
  ];

  // Get used icons from existing templates
  const getUsedIcons = () => {
    return templates.map(template => template.icon);
  };

  // Generate icon based on title keywords
  const generateIconForTitle = (title: string) => {
    const usedIcons = getUsedIcons();
    const availableUnusedIcons = availableIcons.filter(icon => !usedIcons.includes(icon));

    // If all icons are used, use any icon
    const iconPool = availableUnusedIcons.length > 0 ? availableUnusedIcons : availableIcons;

    const titleLower = title.toLowerCase();

    // Keyword-based icon mapping
    const keywordIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
      // Development & Code
      'code': Code, 'develop': Code, 'program': Code, 'script': Code, 'api': Code,
      'debug': Code, 'function': Code, 'algorithm': Code, 'software': Code,

      // Writing & Content
      'write': PenTool, 'content': PenTool, 'blog': PenTool, 'article': PenTool,
      'story': BookOpen, 'book': Book, 'documentation': FileText, 'manual': FileText,

      // Business & Strategy
      'business': Briefcase, 'strategy': Target, 'plan': Target, 'goal': Target,
      'meeting': Users, 'team': Users, 'project': Briefcase, 'proposal': FileText,

      // Communication
      'email': Mail, 'message': MessageSquare, 'chat': MessageSquare, 'call': Phone,
      'presentation': Monitor, 'announcement': Megaphone, 'marketing': TrendingUp,

      // Creative & Design
      'design': Palette, 'creative': Lightbulb, 'art': Palette, 'visual': Image,
      'photo': Camera, 'video': Video, 'music': Music, 'audio': Headphones,

      // Analysis & Research
      'analysis': TrendingUp, 'research': Search, 'data': Database, 'report': FileText,
      'study': BookOpen, 'review': Star, 'feedback': MessageSquare, 'survey': FileText,

      // Technology & Tools
      'app': Smartphone, 'mobile': Smartphone, 'web': Globe, 'website': Globe,
      'server': Server, 'database': Database, 'security': Shield, 'backup': Package,

      // Personal & Lifestyle
      'health': Heart, 'fitness': TrendingUp, 'travel': Map, 'food': Coffee,
      'home': Home, 'personal': Users, 'habit': Clock, 'routine': Clock,

      // Education & Learning
      'learn': BookOpen, 'teach': Users, 'course': Book, 'tutorial': Video,
      'guide': Map, 'training': Award, 'skill': Target, 'knowledge': Brain,

      // Innovation & Ideas
      'idea': Lightbulb, 'innovation': Rocket, 'brainstorm': Brain, 'creativity': Palette,
      'solution': Key, 'problem': Target, 'improvement': TrendingUp, 'optimize': Zap
    };

    // Find matching icon based on keywords
    for (const [keyword, icon] of Object.entries(keywordIconMap)) {
      if (titleLower.includes(keyword)) {
        // Check if this icon is available in our pool by comparing function names
        const matchingIcon = iconPool.find(poolIcon => poolIcon.name === icon.name);
        if (matchingIcon) {
          return matchingIcon;
        }
      }
    }

    // If no keyword match, generate based on title hash
    const hash = title.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);

    return iconPool[Math.abs(hash) % iconPool.length];
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3 flex-shrink-0">
        <div className="flex items-center justify-between mb-3">
          <CardTitle className="text-sm sm:text-base font-semibold pointer-events-none">Prompt Templates</CardTitle>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline" className="h-8 px-2 sm:px-3">
                <Plus className="h-3 w-3 sm:mr-1" />
                <span className="hidden sm:inline">New</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create New Template</DialogTitle>
                <DialogDescription>
                  Create a reusable prompt template for your workflow.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Title</label>
                  <div className="flex gap-2">
                    <Input
                      value={newTemplate.title}
                      onChange={(e) =>
                        setNewTemplate((prev) => ({ ...prev, title: e.target.value }))
                      }
                      placeholder="Template title"
                      className="flex-1"
                    />
                    {newTemplate.title && (
                      <div className="flex items-center gap-2 px-3 py-2 border rounded-md bg-muted/50">
                        {React.createElement(generateIconForTitle(newTemplate.title), {
                          className: "h-4 w-4 text-primary"
                        })}
                        <span className="text-xs text-muted-foreground">Auto-generated icon</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Select
                    value={newTemplate.category}
                    onValueChange={(value) =>
                      setNewTemplate((prev) => ({ ...prev, category: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category">
                        {newTemplate.category && newTemplate.category !== "custom" && (
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className={`text-xs ${getCategoryColor(newTemplate.category)}`}>
                              {newTemplate.category}
                            </Badge>
                          </div>
                        )}
                        {newTemplate.category === "custom" && (
                          <span className="text-sm text-muted-foreground">Custom Category</span>
                        )}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {predefinedCategories.map((category) => (
                        <SelectItem key={category.name} value={category.name}>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className={`text-xs ${category.color}`}>
                              {category.name}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                      <SelectItem value="custom">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">+ Custom Category</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {newTemplate.category === "custom" && (
                    <div className="mt-2 space-y-2">
                      <Input
                        value={customCategoryInput}
                        placeholder="Enter custom category name (e.g., Marketing, Finance)"
                        onChange={(e) => setCustomCategoryInput(e.target.value)}
                        className="w-full"
                      />
                      {customCategoryInput.trim() && (
                        <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-md">
                          <Badge variant="secondary" className={`text-xs ${getCategoryColor(customCategoryInput.trim())}`}>
                            {customCategoryInput.trim()}
                          </Badge>
                          <span className="text-xs text-muted-foreground">Preview with auto-generated color</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Input
                    value={newTemplate.description}
                    onChange={(e) =>
                      setNewTemplate((prev) => ({ ...prev, description: e.target.value }))
                    }
                    placeholder="Brief description"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Template Content</label>
                  <Textarea
                    value={newTemplate.content}
                    onChange={(e) =>
                      setNewTemplate((prev) => ({ ...prev, content: e.target.value }))
                    }
                    placeholder="Enter your prompt template..."
                    rows={6}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={createTemplate}>Create Template</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </CardHeader>
      <CardContent className="flex-1 space-y-3 sm:space-y-4 overflow-y-auto min-h-0 ">
        {favoriteTemplates.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-1 pointer-events-none">
              <Star className="h-3 w-3" />
              Favorites
            </h4>
            {favoriteTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onSelect={onTemplateSelect}
                onToggleFavorite={toggleFavorite}
                onDelete={deleteTemplate}
                getCategoryColor={getCategoryColor}

              />
            ))}
          </div>
        )}

        {otherTemplates.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">
              All Templates
            </h4>
            {otherTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onSelect={onTemplateSelect}
                onToggleFavorite={toggleFavorite}
                onDelete={deleteTemplate}
                getCategoryColor={getCategoryColor}
              />
            ))}
          </div>
        )}

        {filteredTemplates.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No templates found</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface TemplateCardProps {
  template: PromptTemplate;
  onSelect: (template: PromptTemplate) => void;
  onToggleFavorite: (id: string) => void;
  onDelete: (id: string) => void;
  getCategoryColor: (category: string) => string;
}

function TemplateCard({
  template,
  onSelect,
  onToggleFavorite,
  onDelete,
  getCategoryColor,
}: TemplateCardProps) {
  return (
    <div className="border rounded-lg p-2 sm:p-3 hover:bg-muted/50 transition-colors group">
      <div className="flex items-start gap-2 sm:gap-3">
        <template.icon className="h-3 w-3 sm:h-4 sm:w-4 text-primary mt-0.5 flex-shrink-0" />
        <div className="flex-1 space-y-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
            <h5 className="font-medium text-xs sm:text-sm">{template.title}</h5>
            <Badge variant="secondary" className={`text-xs w-fit ${getCategoryColor(template.category)} pointer-events-none`}>
              {template.category}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2">
            {template.description}
          </p>
          <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onSelect(template)}
              className="h-6 px-2 text-xs"
            >
              <span className="hidden sm:inline">Use Template</span>
              <span className="sm:hidden">Use</span>
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onToggleFavorite(template.id)}
              className="h-6 w-6 p-0"
            >
              <Star className={`h-3 w-3 ${template.favorite ? 'fill-current text-yellow-500' : ''}`} />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDelete(template.id)}
              className="h-6 w-6 p-0 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}