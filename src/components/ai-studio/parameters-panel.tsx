import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Thermometer, Hash, Target, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ParametersState {
  temperature: number;
  maxTokens: number;
  topP: number;
  frequencyPenalty: number;
  presencePenalty: number;
}

interface ParametersPanelProps {
  onParametersChange: (params: ParametersState) => void;
}

export function ParametersPanel({ onParametersChange }: ParametersPanelProps) {
  const [params, setParams] = useState<ParametersState>({
    temperature: 0.7,
    maxTokens: 2048,
    topP: 1.0,
    frequencyPenalty: 0,
    presencePenalty: 0,
  });

  const updateParameter = (key: keyof ParametersState, value: number) => {
    const newParams = { ...params, [key]: value };
    setParams(newParams);
    onParametersChange(newParams);
  };

  const resetToDefaults = () => {
    const defaults: ParametersState = {
      temperature: 0.7,
      maxTokens: 2048,
      topP: 1.0,
      frequencyPenalty: 0,
      presencePenalty: 0,
    };
    setParams(defaults);
    onParametersChange(defaults);
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Thermometer className="h-4 w-4 text-primary" />
            Model Parameters
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={resetToDefaults}
            className="text-xs"
          >
            <RotateCcw className="h-3 w-3 mr-1" />
            Reset
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Temperature */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="temperature" className="text-sm font-medium">
              Temperature
            </Label>
            <Badge variant="outline" className="text-xs">
              {params.temperature}
            </Badge>
          </div>
          <Slider
            id="temperature"
            min={0}
            max={2}
            step={0.1}
            value={[params.temperature]}
            onValueChange={(value) => updateParameter('temperature', value[0])}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">
            Controls randomness. Lower = more focused, Higher = more creative
          </p>
        </div>

        {/* Max Tokens */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="maxTokens" className="text-sm font-medium flex items-center gap-1">
              <Hash className="h-3 w-3" />
              Max Tokens
            </Label>
            <Input
              type="number"
              value={params.maxTokens}
              onChange={(e) => updateParameter('maxTokens', parseInt(e.target.value) || 0)}
              className="w-20 h-6 text-xs text-right"
              min={1}
              max={8192}
            />
          </div>
          <Slider
            id="maxTokens"
            min={1}
            max={8192}
            step={1}
            value={[params.maxTokens]}
            onValueChange={(value) => updateParameter('maxTokens', value[0])}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">
            Maximum length of the generated response
          </p>
        </div>

        {/* Top P */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="topP" className="text-sm font-medium flex items-center gap-1">
              <Target className="h-3 w-3" />
              Top P
            </Label>
            <Badge variant="outline" className="text-xs">
              {params.topP}
            </Badge>
          </div>
          <Slider
            id="topP"
            min={0}
            max={1}
            step={0.01}
            value={[params.topP]}
            onValueChange={(value) => updateParameter('topP', value[0])}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">
            Nucleus sampling. Alternative to temperature
          </p>
        </div>

        {/* Frequency Penalty */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="frequencyPenalty" className="text-sm font-medium">
              Frequency Penalty
            </Label>
            <Badge variant="outline" className="text-xs">
              {params.frequencyPenalty}
            </Badge>
          </div>
          <Slider
            id="frequencyPenalty"
            min={-2}
            max={2}
            step={0.1}
            value={[params.frequencyPenalty]}
            onValueChange={(value) => updateParameter('frequencyPenalty', value[0])}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">
            Reduces repetition of frequent tokens
          </p>
        </div>

        {/* Presence Penalty */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="presencePenalty" className="text-sm font-medium">
              Presence Penalty
            </Label>
            <Badge variant="outline" className="text-xs">
              {params.presencePenalty}
            </Badge>
          </div>
          <Slider
            id="presencePenalty"
            min={-2}
            max={2}
            step={0.1}
            value={[params.presencePenalty]}
            onValueChange={(value) => updateParameter('presencePenalty', value[0])}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">
            Encourages talking about new topics
          </p>
        </div>
      </CardContent>
    </Card>
  );
}