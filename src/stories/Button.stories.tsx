import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@/components/ui/button';
import { Download, Send, Settings, Heart } from 'lucide-react';

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
    },
    size: {
      control: { type: 'select' },
      options: ['default', 'sm', 'lg', 'icon'],
    },
    disabled: {
      control: { type: 'boolean' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Button',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary',
  },
};

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Destructive',
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Outline',
  },
};

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Ghost',
  },
};

export const Link: Story = {
  args: {
    variant: 'link',
    children: 'Link',
  },
};

export const WithIcon: Story = {
  args: {
    children: (
      <>
        <Send className="mr-2 h-4 w-4" />
        Send Message
      </>
    ),
  },
};

export const IconOnly: Story = {
  args: {
    variant: 'outline',
    size: 'icon',
    children: <Settings className="h-4 w-4" />,
  },
};

export const Loading: Story = {
  args: {
    disabled: true,
    children: (
      <>
        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        Loading...
      </>
    ),
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    children: (
      <>
        <Download className="mr-2 h-4 w-4" />
        Download Report
      </>
    ),
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
    variant: 'secondary',
    children: (
      <>
        <Heart className="mr-1 h-3 w-3" />
        Like
      </>
    ),
  },
};