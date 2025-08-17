import type { Meta, StoryObj } from '@storybook/react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';

// Create a ChatMessage component for Storybook
interface ChatMessageProps {
  role: 'user' | 'assistant' | 'system';
  content: string;
  model?: string;
  timestamp?: Date;
  onCopy?: () => void;
}

const ChatMessage = ({ role, content, model, timestamp, onCopy }: ChatMessageProps) => {
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
    <div className="group w-full max-w-2xl">
      <Card className={`p-4 ${getRoleStyle(role)} transition-colors`}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge 
                variant={role === 'user' ? 'default' : 'secondary'}
                className="text-xs capitalize"
              >
                {role}
              </Badge>
              {model && (
                <Badge variant="outline" className="text-xs">
                  {model}
                </Badge>
              )}
              {timestamp && (
                <span className="text-xs text-muted-foreground">
                  {timestamp.toLocaleTimeString()}
                </span>
              )}
            </div>
            <div className="prose prose-sm max-w-none">
              <pre className="whitespace-pre-wrap font-body text-sm leading-relaxed">
                {content}
              </pre>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onCopy}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Copy className="h-3 w-3" />
          </Button>
        </div>
      </Card>
    </div>
  );
};

const meta: Meta<typeof ChatMessage> = {
  title: 'AI Studio/ChatMessage',
  component: ChatMessage,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Chat message component with role-based styling, timestamps, and copy functionality.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    role: {
      control: { type: 'select' },
      options: ['user', 'assistant', 'system'],
    },
    model: {
      control: { type: 'text' },
    },
    content: {
      control: { type: 'text' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const UserMessage: Story = {
  args: {
    role: 'user',
    content: 'Can you help me write a function to calculate the fibonacci sequence in JavaScript?',
    timestamp: new Date(),
    onCopy: () => alert('Message copied!'),
  },
};

export const AssistantMessage: Story = {
  args: {
    role: 'assistant',
    content: `Certainly! Here's a JavaScript function to calculate the Fibonacci sequence:

\`\`\`javascript
function fibonacci(n) {
  if (n <= 1) return n;
  
  let a = 0, b = 1, temp;
  
  for (let i = 2; i <= n; i++) {
    temp = a + b;
    a = b;
    b = temp;
  }
  
  return b;
}

// Example usage:
console.log(fibonacci(10)); // Output: 55
\`\`\`

This iterative approach is efficient with O(n) time complexity and O(1) space complexity.`,
    model: 'GPT-4 Turbo',
    timestamp: new Date(),
    onCopy: () => alert('Assistant message copied!'),
  },
};

export const SystemMessage: Story = {
  args: {
    role: 'system',
    content: 'AI Studio is ready. How can I help you today?',
    timestamp: new Date(),
    onCopy: () => alert('System message copied!'),
  },
};

export const LongMessage: Story = {
  args: {
    role: 'assistant',
    content: `Here's a comprehensive guide to React hooks:

## useState Hook
The useState hook allows you to add state to functional components.

\`\`\`javascript
const [count, setCount] = useState(0);
\`\`\`

## useEffect Hook
The useEffect hook lets you perform side effects in function components.

\`\`\`javascript
useEffect(() => {
  document.title = \`Count: \${count}\`;
}, [count]);
\`\`\`

## useContext Hook
The useContext hook allows you to consume context in functional components.

\`\`\`javascript
const theme = useContext(ThemeContext);
\`\`\`

## Custom Hooks
You can create custom hooks to reuse stateful logic between components.

\`\`\`javascript
function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);
  
  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);
  
  return { count, increment, decrement };
}
\`\`\`

These hooks provide powerful ways to manage state and side effects in React applications.`,
    model: 'Claude 3 Opus',
    timestamp: new Date(),
    onCopy: () => alert('Long message copied!'),
  },
};

export const CodeMessage: Story = {
  args: {
    role: 'assistant',
    content: `// Here's a React component example:

import React, { useState, useEffect } from 'react';

const Timer = () => {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval = null;
    
    if (isActive) {
      interval = setInterval(() => {
        setSeconds(seconds => seconds + 1);
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval);
    }
    
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  const toggle = () => {
    setIsActive(!isActive);
  };

  const reset = () => {
    setSeconds(0);
    setIsActive(false);
  };

  return (
    <div>
      <div>{seconds}s</div>
      <button onClick={toggle}>
        {isActive ? 'Pause' : 'Start'}
      </button>
      <button onClick={reset}>Reset</button>
    </div>
  );
};

export default Timer;`,
    model: 'GPT-4 Turbo',
    timestamp: new Date(),
    onCopy: () => alert('Code copied!'),
  },
};