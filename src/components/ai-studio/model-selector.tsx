import { useState } from "react";
import { Check, ChevronDown, Cpu, Zap, Brain, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

interface AIModel {
  id: string;
  name: string;
  provider: string;
  description: string;
  capabilities: string[];
  tier: 'free' | 'pro' | 'premium';
  icon: React.ComponentType<{ className?: string }>;
}

const models: AIModel[] = [
  {
    id: "gpt-4-turbo",
    name: "GPT-4 Turbo",
    provider: "OpenAI",
    description: "Most capable model for complex tasks",
    capabilities: ["reasoning", "coding", "analysis"],
    tier: "premium",
    icon: Brain,
  },
  {
    id: "gpt-3.5-turbo",
    name: "GPT-3.5 Turbo",
    provider: "OpenAI",
    description: "Fast and efficient for most tasks",
    capabilities: ["chat", "coding", "writing"],
    tier: "pro",
    icon: Zap,
  },
  {
    id: "claude-3-opus",
    name: "Claude 3 Opus",
    provider: "Anthropic",
    description: "Advanced reasoning and analysis",
    capabilities: ["reasoning", "analysis", "writing"],
    tier: "premium",
    icon: Sparkles,
  },
  {
    id: "claude-3-sonnet",
    name: "Claude 3 Sonnet",
    provider: "Anthropic",
    description: "Balanced performance and speed",
    capabilities: ["chat", "analysis", "coding"],
    tier: "pro",
    icon: Cpu,
  },
];

interface ModelSelectorProps {
  onModelChange: (model: AIModel) => void;
}

export function ModelSelector({ onModelChange }: ModelSelectorProps) {
  const [open, setOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState<AIModel>(models[0]);

  const handleModelSelect = (model: AIModel) => {
    setSelectedModel(model);
    onModelChange(model);
    setOpen(false);
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'premium':
        return 'bg-accent text-accent-foreground';
      case 'pro':
        return 'bg-primary text-primary-foreground';
      default:
        return 'bg-success text-success-foreground';
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-muted-foreground">
        AI Model
      </label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between h-auto p-3 hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <selectedModel.icon className="h-4 w-4 text-primary" />
              <div className="text-left">
                <div className="font-medium">{selectedModel.name}</div>
                <div className="text-xs text-muted-foreground">
                  {selectedModel.provider}
                </div>
              </div>
            </div>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Search models..." className="h-9" />
            <CommandList>
              <CommandEmpty>No models found.</CommandEmpty>
              <CommandGroup>
                {models.map((model) => (
                  <CommandItem
                    key={model.id}
                    value={model.id}
                    onSelect={() => handleModelSelect(model)}
                    className="flex items-start gap-3 p-3 cursor-pointer"
                  >
                    <model.icon className="h-4 w-4 text-primary mt-0.5" />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{model.name}</span>
                        <Badge 
                          variant="secondary" 
                          className={`text-xs ${getTierColor(model.tier)}`}
                        >
                          {model.tier}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {model.description}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {model.capabilities.map((cap) => (
                          <Badge 
                            key={cap} 
                            variant="outline" 
                            className="text-xs"
                          >
                            {cap}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Check
                      className={`ml-2 h-4 w-4 ${
                        selectedModel.id === model.id ? "opacity-100" : "opacity-0"
                      }`}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}