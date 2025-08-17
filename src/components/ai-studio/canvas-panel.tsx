import { useState, useRef } from "react";
import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Edit3, 
  Save, 
  Download, 
  Copy, 
  Undo, 
  Redo, 
  Type, 
  Code,
  FileText,
  Wand2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CanvasItem {
  id: string;
  type: 'text' | 'code' | 'markdown';
  title: string;
  content: string;
  lastModified: Date;
}

interface CanvasPanelProps {
  onContentChange?: (content: string) => void;
}

export function CanvasPanel({ onContentChange }: CanvasPanelProps) {
  const [canvasItems, setCanvasItems] = useState<CanvasItem[]>([
    {
      id: '1',
      type: 'text',
      title: 'Welcome Document',
      content: 'Welcome to AI Studio Canvas!\n\nThis is your collaborative editing space where you can:\n• Edit and refine AI-generated content\n• Work with text, code, and markdown\n• Save and export your work\n• Maintain version history\n\nStart by creating a new document or selecting an existing one from the dropdown above.',
      lastModified: new Date(),
    }
  ]);
  
  const [activeItemId, setActiveItemId] = useState<string>('1');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isEditing, setIsEditing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  const activeItem = canvasItems.find(item => item.id === activeItemId);

  const updateContent = (newContent: string) => {
    if (!activeItem) return;

    // Add to history for undo/redo
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(activeItem.content);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);

    // Update the item
    setCanvasItems(prev => 
      prev.map(item => 
        item.id === activeItemId 
          ? { ...item, content: newContent, lastModified: new Date() }
          : item
      )
    );

    onContentChange?.(newContent);
  };

  const handleUndo = () => {
    if (historyIndex > 0 && activeItem) {
      const prevContent = history[historyIndex - 1];
      setCanvasItems(prev => 
        prev.map(item => 
          item.id === activeItemId 
            ? { ...item, content: prevContent, lastModified: new Date() }
            : item
        )
      );
      setHistoryIndex(historyIndex - 1);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1 && activeItem) {
      const nextContent = history[historyIndex + 1];
      setCanvasItems(prev => 
        prev.map(item => 
          item.id === activeItemId 
            ? { ...item, content: nextContent, lastModified: new Date() }
            : item
        )
      );
      setHistoryIndex(historyIndex + 1);
    }
  };

  const createNewDocument = (type: 'text' | 'code' | 'markdown') => {
    const templates = {
      text: 'New text document\n\nStart writing here...',
      code: '// New code document\nfunction example() {\n  console.log("Hello, World!");\n}\n\nexample();',
      markdown: '# New Markdown Document\n\n## Overview\n\nStart writing your markdown here...\n\n- List item 1\n- List item 2\n\n```javascript\n// Code example\nconsole.log("Hello, World!");\n```'
    };

    const newItem: CanvasItem = {
      id: Date.now().toString(),
      type,
      title: `New ${type} document`,
      content: templates[type],
      lastModified: new Date(),
    };

    setCanvasItems(prev => [...prev, newItem]);
    setActiveItemId(newItem.id);
    setHistory([]);
    setHistoryIndex(-1);
  };

  const exportDocument = () => {
    if (!activeItem) return;

    const extension = activeItem.type === 'code' ? 'js' : 
                     activeItem.type === 'markdown' ? 'md' : 'txt';
    
    const blob = new Blob([activeItem.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeItem.title.replace(/\s+/g, '-').toLowerCase()}.${extension}`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Document exported",
      description: `${activeItem.title} has been downloaded.`,
    });
  };

  const copyToClipboard = async () => {
    if (!activeItem) return;

    try {
      await navigator.clipboard.writeText(activeItem.content);
      toast({
        title: "Copied to clipboard",
        description: "Document content has been copied.",
      });
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Could not copy to clipboard.",
        variant: "destructive",
      });
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'code': return Code;
      case 'markdown': return FileText;
      default: return Type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'code': return 'bg-primary text-primary-foreground';
      case 'markdown': return 'bg-accent text-accent-foreground';
      default: return 'bg-success text-success-foreground';
    }
  };

  if (!activeItem) return null;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between mb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Edit3 className="h-4 w-4 text-primary" />
            Canvas Editor
          </CardTitle>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => createNewDocument('text')}
              className="h-8 px-2"
            >
              <Type className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => createNewDocument('code')}
              className="h-8 px-2"
            >
              <Code className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => createNewDocument('markdown')}
              className="h-8 px-2"
            >
              <FileText className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Document Selector */}
        <Select value={activeItemId} onValueChange={setActiveItemId}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select document" />
          </SelectTrigger>
          <SelectContent>
            {canvasItems.map((item) => {
              const Icon = getTypeIcon(item.type);
              return (
                <SelectItem key={item.id} value={item.id}>
                  <div className="flex items-center gap-2">
                    <Icon className="h-3 w-3" />
                    <span>{item.title}</span>
                    <Badge 
                      variant="secondary" 
                      className={`text-xs ml-auto ${getTypeColor(item.type)}`}
                    >
                      {item.type}
                    </Badge>
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>

        {/* Toolbar */}
        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleUndo}
              disabled={historyIndex <= 0}
              className="h-8 px-2"
            >
              <Undo className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
              className="h-8 px-2"
            >
              <Redo className="h-3 w-3" />
            </Button>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={copyToClipboard}
              className="h-8 px-2"
            >
              <Copy className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={exportDocument}
              className="h-8 px-2"
            >
              <Download className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
              className={`h-8 px-2 ${isEditing ? 'bg-primary text-primary-foreground' : ''}`}
            >
              <Wand2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-0">
        <div className="h-full flex flex-col">
          {/* Document Info */}
          <div className="px-4 py-2 border-b bg-muted/30">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                {React.createElement(getTypeIcon(activeItem.type), { className: "h-3 w-3" })}
                <span>{activeItem.title}</span>
              </div>
              <span>Modified: {activeItem.lastModified.toLocaleTimeString()}</span>
            </div>
          </div>

          {/* Editor */}
          <div className="flex-1 p-4">
            <Textarea
              ref={textareaRef}
              value={activeItem.content}
              onChange={(e) => updateContent(e.target.value)}
              className={`w-full h-full resize-none border-0 bg-transparent focus:ring-0 focus:outline-none ${
                activeItem.type === 'code' ? 'font-mono text-sm' : 'font-body'
              }`}
              placeholder="Start editing your document..."
            />
          </div>

          {/* Footer Stats */}
          <div className="px-4 py-2 border-t bg-muted/30">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                {activeItem.content.length} characters • {activeItem.content.split('\n').length} lines
              </span>
              <span>
                Words: {activeItem.content.split(/\s+/).filter(word => word.length > 0).length}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}