import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  BookOpen, 
  Code, 
  PenTool, 
  MessageSquare, 
  Plus, 
  Search,
  Star,
  Trash2
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

    const template: PromptTemplate = {
      id: Date.now().toString(),
      ...newTemplate,
      icon: MessageSquare,
      favorite: false,
    };

    setTemplates((prev) => [...prev, template]);
    setNewTemplate({ title: "", category: "", content: "", description: "" });
    setIsCreateDialogOpen(false);
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Development: "bg-primary text-primary-foreground",
      Writing: "bg-accent text-accent-foreground",
      Education: "bg-success text-success-foreground",
      Strategy: "bg-warning text-warning-foreground",
    };
    return colors[category] || "bg-muted text-muted-foreground";
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between mb-3">
          <CardTitle className="text-base font-semibold">Prompt Templates</CardTitle>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline">
                <Plus className="h-3 w-3 mr-1" />
                New
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
                  <Input
                    value={newTemplate.title}
                    onChange={(e) =>
                      setNewTemplate((prev) => ({ ...prev, title: e.target.value }))
                    }
                    placeholder="Template title"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Input
                    value={newTemplate.category}
                    onChange={(e) =>
                      setNewTemplate((prev) => ({ ...prev, category: e.target.value }))
                    }
                    placeholder="e.g., Development, Writing"
                  />
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
      <CardContent className="space-y-4 max-h-[500px] overflow-y-auto">
        {favoriteTemplates.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-1">
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
    <div className="border rounded-lg p-3 hover:bg-muted/50 transition-colors group">
      <div className="flex items-start gap-3">
        <template.icon className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <h5 className="font-medium text-sm">{template.title}</h5>
            <Badge variant="secondary" className={`text-xs ${getCategoryColor(template.category)}`}>
              {template.category}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2">
            {template.description}
          </p>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onSelect(template)}
              className="h-6 px-2 text-xs"
            >
              Use Template
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