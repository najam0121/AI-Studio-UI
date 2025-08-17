import type { Meta, StoryObj } from '@storybook/react';
import { ParametersPanel } from '@/components/ai-studio/parameters-panel';
import { useState } from 'react';

const meta: Meta<typeof ParametersPanel> = {
  title: 'AI Studio/ParametersPanel',
  component: ParametersPanel,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Interactive parameters panel for controlling AI model settings with real-time updates.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Wrapper component to handle state
const ParametersPanelWrapper = (args: any) => {
  const [parameters, setParameters] = useState({
    temperature: 0.7,
    maxTokens: 2048,
    topP: 1.0,
    frequencyPenalty: 0,
    presencePenalty: 0,
  });
  
  return (
    <div style={{ width: '350px' }}>
      <ParametersPanel
        {...args}
        onParametersChange={(params) => {
          setParameters(params);
          console.log('Parameters updated:', params);
        }}
      />
      <div style={{ marginTop: '16px', padding: '12px', background: '#f5f5f5', borderRadius: '8px' }}>
        <h4>Current Parameters:</h4>
        <pre style={{ fontSize: '12px' }}>{JSON.stringify(parameters, null, 2)}</pre>
      </div>
    </div>
  );
};

export const Default: Story = {
  render: ParametersPanelWrapper,
  args: {},
};

export const CreativeSettings: Story = {
  render: () => {
    const [parameters, setParameters] = useState({
      temperature: 1.2,
      maxTokens: 4096,
      topP: 0.9,
      frequencyPenalty: 0.3,
      presencePenalty: 0.2,
    });
    
    return (
      <div style={{ width: '350px' }}>
        <ParametersPanel
          onParametersChange={(params) => {
            setParameters(params);
            console.log('Creative parameters:', params);
          }}
        />
        <div style={{ marginTop: '16px', padding: '12px', background: '#e8f4f8', borderRadius: '8px' }}>
          <h4>Creative Writing Preset:</h4>
          <ul style={{ fontSize: '12px', margin: '8px 0' }}>
            <li>High temperature for creativity</li>
            <li>Large token limit for long content</li>
            <li>Penalties to reduce repetition</li>
          </ul>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Parameters optimized for creative writing tasks with higher temperature and penalties.',
      },
    },
  },
};

export const PreciseSettings: Story = {
  render: () => {
    const [parameters, setParameters] = useState({
      temperature: 0.1,
      maxTokens: 1024,
      topP: 0.95,
      frequencyPenalty: 0,
      presencePenalty: 0,
    });
    
    return (
      <div style={{ width: '350px' }}>
        <ParametersPanel
          onParametersChange={(params) => {
            setParameters(params);
            console.log('Precise parameters:', params);
          }}
        />
        <div style={{ marginTop: '16px', padding: '12px', background: '#f0f8e8', borderRadius: '8px' }}>
          <h4>Analytical Preset:</h4>
          <ul style={{ fontSize: '12px', margin: '8px 0' }}>
            <li>Low temperature for consistency</li>
            <li>Moderate token limit</li>
            <li>High Top P for quality</li>
          </ul>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Parameters optimized for analytical and precise tasks with low temperature.',
      },
    },
  },
};