import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { ModelSelector } from "@/components/ai-studio/model-selector";
import { ParametersPanel } from "@/components/ai-studio/parameters-panel";
import { PromptTemplates } from "@/components/ai-studio/prompt-templates";
import { ChatInterface } from "@/components/ai-studio/chat-interface";
import { CanvasPanel } from "@/components/ai-studio/canvas-panel";
import { 
  Brain, 
  Settings, 
  MessageSquare, 
  Edit3, 
  Layers,
  Github,
  ExternalLink,
  Palette
} from "lucide-react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

interface AIModel {
  id: string;
  name: string;
  provider: string;
  description: string;
  capabilities: string[];
  tier: 'free' | 'pro' | 'premium';
  icon: React.ComponentType<{ className?: string }>;
}

interface ParametersState {
  temperature: number;
  maxTokens: number;
  topP: number;
  frequencyPenalty: number;
  presencePenalty: number;
}

const Index = () => {
  const [selectedModel, setSelectedModel] = useState<AIModel | null>(null);
  const [parameters, setParameters] = useState<ParametersState>({
    temperature: 0.7,
    maxTokens: 2048,
    topP: 1.0,
    frequencyPenalty: 0,
    presencePenalty: 0,
  });
  const [activePanel, setActivePanel] = useState<'chat' | 'canvas'>('chat');

  const handleTemplateSelect = (template: any) => {
    // In a real implementation, this would populate the chat input
    console.log('Template selected:', template);
  };

  return (
    <div className="min-h-screen bg-gradient-surface">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-2 sm:px-4 h-14 sm:h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                <Brain className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
              </div>
              <div>
                <h1 className="text-lg sm:text-2xl font-extrabold gradient-text">AI Studio</h1>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-4">
            <div className="flex items-center gap-1 sm:gap-2">
              <Button
                variant={activePanel === 'chat' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActivePanel('chat')}
                className="gap-1 sm:gap-2 h-8 px-2 sm:px-3"
              >
                <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Chat</span>
              </Button>
              <Button
                variant={activePanel === 'canvas' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActivePanel('canvas')}
                className="gap-1 sm:gap-2 h-8 px-2 sm:px-3"
              >
                <Edit3 className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Canvas</span>
              </Button>
            </div>

            <div className="flex items-center gap-1 sm:gap-2">
              <Button variant="ghost" size="sm" asChild className="hidden sm:flex">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gap-2"
                >
                  <Github className="h-4 w-4" />
                  <ExternalLink className="h-3 w-3" />
                </a>
              </Button>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-2 sm:p-4 h-[calc(100vh-5rem)] overflow-hidden">
        {/* Desktop Layout - Horizontal Resizable Panels */}
        <div className="hidden lg:block h-full">
          <ResizablePanelGroup direction="horizontal" className="h-full rounded-lg border overflow-hidden">
            {/* Left Sidebar - Controls */}
            <ResizablePanel defaultSize={30} minSize={25} maxSize={35}>
              <div className="h-full bg-background/50 p-4 space-y-4 overflow-y-auto">
                {/* Model Selection */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-semibold flex items-center gap-2 pointer-events-none">
                      <Brain className="h-4 w-4 text-primary" />
                      AI Configuration
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ModelSelector onModelChange={setSelectedModel} />
                  </CardContent>
                </Card>

                {/* Parameters */}
                <ParametersPanel onParametersChange={setParameters} />

                {/* Quick Stats */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-semibold flex items-center gap-2 pointer-events-none">
                      <Palette className="h-4 w-4 text-primary" />
                      Session Info
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 pointer-events-none">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Active Model:</span>
                      <Badge variant="outline" className="text-xs">
                        {selectedModel?.name || 'None'}
                      </Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Temperature:</span>
                      <span className="font-mono text-xs">{parameters.temperature}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Max Tokens:</span>
                      <span className="font-mono text-xs">{parameters.maxTokens}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Mode:</span>
                      <Badge variant="secondary" className="text-xs capitalize">
                        {activePanel}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </ResizablePanel>

            <ResizableHandle withHandle />

            {/* Middle Panel - Templates */}
            <ResizablePanel defaultSize={30} minSize={25} maxSize={35}>
              <div className="h-full bg-background/30 p-4">
                <PromptTemplates onTemplateSelect={handleTemplateSelect} />
              </div>
            </ResizablePanel>

            <ResizableHandle withHandle />

            {/* Right Panel - Chat or Canvas */}
            <ResizablePanel defaultSize={40} minSize={35}>
              <div className="h-full bg-background">
                {activePanel === 'chat' ? (
                  <ChatInterface
                    selectedModel={selectedModel}
                    parameters={parameters}
                  />
                ) : (
                  <CanvasPanel />
                )}
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>

        {/* Mobile Layout - Vertical Stack */}
        <div className="lg:hidden h-full flex flex-col space-y-3 overflow-y-auto pb-2">
          {/* AI Configuration Section */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2 pointer-events-none">
                <Brain className="h-4 w-4 text-primary" />
                AI Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ModelSelector onModelChange={setSelectedModel} />
            </CardContent>
          </Card>

          {/* Parameters Section */}
          <ParametersPanel onParametersChange={setParameters} />

          {/* Session Info Section */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2 pointer-events-none">
                <Palette className="h-4 w-4 text-primary" />
                Session Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex flex-col">
                  <span className="text-muted-foreground">Active Model:</span>
                  <Badge variant="outline" className="text-xs mt-1 w-fit">
                    {selectedModel?.name || 'None'}
                  </Badge>
                </div>
                <div className="flex flex-col">
                  <span className="text-muted-foreground">Temperature:</span>
                  <span className="font-mono text-xs mt-1">{parameters.temperature}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-muted-foreground">Max Tokens:</span>
                  <span className="font-mono text-xs mt-1">{parameters.maxTokens}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-muted-foreground">Mode:</span>
                  <Badge variant="secondary" className="text-xs capitalize mt-1 w-fit">
                    {activePanel}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Prompt Templates Section */}
          <div className="bg-background/30 rounded-lg border p-4">
            <PromptTemplates onTemplateSelect={handleTemplateSelect} />
          </div>

          {/* Chat/Canvas Section */}
          <div className="bg-background rounded-lg border ">
            {activePanel === 'chat' ? (
              <ChatInterface
                selectedModel={selectedModel}
                parameters={parameters}
              />
            ) : (
              <CanvasPanel />
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 mt-4">
        <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-3">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-xs sm:text-sm text-muted-foreground">
            <p className="text-center">
              © {new Date().getFullYear()} AI Studio. All rights reserved.
            </p>
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline">•</span>
              <span>Developed By</span>
              <Badge variant="outline" className="text-xs">
                <Settings className="h-3 w-3 mr-1" />
                Md. Najam
              </Badge>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;