import { useState, useRef, useEffect } from "react";
import { Send, Copy, Download, RotateCcw, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  model?: string;
}

interface ChatInterfaceProps {
  selectedModel: any;
  parameters: any;
  onExport?: (messages: Message[]) => void;
}

export function ChatInterface({ selectedModel, parameters, onExport }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'system',
      content: 'AI Studio is ready. How can I help you today?',
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I understand you're asking about: "${userMessage.content}"\n\nThis is a simulated response from ${selectedModel?.name || 'the AI model'}. In a real implementation, this would connect to the actual AI API with the following parameters:\n\n• Temperature: ${parameters?.temperature || 0.7}\n• Max Tokens: ${parameters?.maxTokens || 2048}\n• Top P: ${parameters?.topP || 1.0}\n\nThe response would be generated based on your prompt and the configured parameters.`,
        timestamp: new Date(),
        model: selectedModel?.name,
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const copyMessage = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      toast({
        title: "Copied to clipboard",
        description: "Message content has been copied.",
      });
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Could not copy to clipboard.",
        variant: "destructive",
      });
    }
  };

  const clearChat = () => {
    setMessages([{
      id: '1',
      role: 'system',
      content: 'Chat cleared. How can I help you?',
      timestamp: new Date(),
    }]);
  };

  const exportChat = () => {
    const chatData = {
      messages,
      model: selectedModel?.name,
      parameters,
      timestamp: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(chatData, null, 2)], {
      type: 'application/json',
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-chat-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Chat exported",
      description: "Chat history has been downloaded as JSON.",
    });
  };

  const getRoleStyle = (role: string) => {
    switch (role) {
      case 'user':
        return 'chat-message-user border-l-4 border-l-primary';
      case 'assistant':
        return 'chat-message-assistant border-l-4 border-l-accent';
      case 'system':
        return 'chat-message-system border-l-4 border-l-success';
      default:
        return 'bg-muted';
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-2 sm:p-4 border-b bg-gradient-surface">
        <div className="flex items-center gap-2 sm:gap-3">
          <h2 className="text-sm sm:text-base font-semibold pointer-events-none">Chat Interface</h2>
          {selectedModel && (
            <Badge variant="outline" className="text-xs hidden sm:inline-flex">
              {selectedModel.name}
            </Badge>
          )}
        </div>
        <div className="flex gap-1 sm:gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={exportChat}
            disabled={messages.length <= 1}
            className="h-8 w-8 sm:h-9 sm:w-auto sm:px-3"
          >
            <Download className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline ml-2">Export</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearChat}
            disabled={messages.length <= 1}
            className="h-8 w-8 sm:h-9 sm:w-auto sm:px-3"
          >
            <RotateCcw className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline ml-2">Clear</span>
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-3 sm:space-y-4 min-h-[40vh] sm:min-h-0">
        {messages.map((message) => (
          <div key={message.id} className="group">
            <Card className={`p-2 sm:p-4 ${getRoleStyle(message.role)} transition-colors`}>
              <div className="flex items-start justify-between gap-2 sm:gap-3">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <Badge
                      variant={message.role === 'user' ? 'default' : 'secondary'}
                      className="text-xs capitalize"
                    >
                      {message.role}
                    </Badge>
                    {message.model && (
                      <Badge variant="outline" className="text-xs hidden sm:inline-flex">
                        {message.model}
                      </Badge>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="prose prose-sm max-w-none">
                    <pre className="whitespace-pre-wrap font-body text-sm leading-relaxed">
                      {message.content}
                    </pre>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyMessage(message.content)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </Card>
          </div>
        ))}
        
        {isLoading && (
          <Card className="p-4 chat-message-assistant border-l-4 border-l-accent">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" className="text-xs">
                assistant
              </Badge>
              <Badge variant="outline" className="text-xs">
                {selectedModel?.name}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
              <span className="text-sm">Generating response...</span>
            </div>
          </Card>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t p-2 sm:p-4 bg-gradient-surface">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type your message..."
              className="min-h-[60px] sm:min-h-[80px] resize-none pr-10 sm:pr-12 text-sm"
              disabled={isLoading}
            />
            <Button
              variant="ghost"
              size="sm"
              className="absolute bottom-1 sm:bottom-2 right-1 sm:right-2 h-6 w-6 sm:h-8 sm:w-8 p-0"
              disabled
            >
              <Paperclip className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="self-end h-[60px] sm:h-[80px] px-3 sm:px-6"
          >
            <Send className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        </div>
        <div className="flex flex-row justify-between sm:flex-row sm:items-start mt-2 gap-1 sm:gap-0 text-xs text-muted-foreground">
  <div className="flex gap-1">

  <span>{input.length} chars</span>
  <span>~{Math.ceil(input.length / 4)} tokens</span>
  </div>
  <div>

  <span className="sm:mt-1">Max: {parameters?.maxTokens || 2048} tokens</span>
  </div>
</div>

      </div>
    </div>
  );
}