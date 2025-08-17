import type { Meta, StoryObj } from '@storybook/react';
import { ModelSelector } from '@/components/ai-studio/model-selector';
import { useState } from 'react';

const meta: Meta<typeof ModelSelector> = {
  title: 'AI Studio/ModelSelector',
  component: ModelSelector,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A comprehensive model selector with search, categories, and detailed model information.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Wrapper component to handle state
const ModelSelectorWrapper = (args: any) => {
  const [selectedModel, setSelectedModel] = useState(null);
  
  return (
    <div style={{ width: '400px' }}>
      <ModelSelector
        {...args}
        onModelChange={(model) => {
          setSelectedModel(model);
          console.log('Selected model:', model);
        }}
      />
      {selectedModel && (
        <div style={{ marginTop: '16px', padding: '12px', background: '#f5f5f5', borderRadius: '8px' }}>
          <h4>Selected Model:</h4>
          <pre>{JSON.stringify(selectedModel, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export const Default: Story = {
  render: ModelSelectorWrapper,
  args: {},
};

export const WithSelection: Story = {
  render: ModelSelectorWrapper,
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Shows the model selector with an initial selection and search functionality.',
      },
    },
  },
};

export const Interactive: Story = {
  render: ModelSelectorWrapper,
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Fully interactive model selector demonstrating search, filtering, and selection features.',
      },
    },
  },
};