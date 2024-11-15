"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { BaseAIItem, SpecializedPrompt } from "@/types/registry";
import { PromptBuilder } from "@fatduckai/ai";
import { AlertTriangle, Check } from "lucide-react";
import { useEffect, useState } from "react";

interface PromptEditorProps {
  item: BaseAIItem | SpecializedPrompt;
  className?: string;
  onUpdate?: (template: string) => void;
}

function extractVariables(template: string): string[] {
  const variableRegex = /<([^>]+)>/g;
  const matches = template.match(variableRegex) || [];
  return matches
    .map((match) => match.replace(/<|>/g, ""))
    .filter(
      (name) =>
        ![
          "system",
          "user",
          "assistant",
          "/system",
          "/user",
          "/assistant",
        ].includes(name)
    )
    .filter((name, index, self) => self.indexOf(name) === index);
}

export function PromptEditor({ item, className, onUpdate }: PromptEditorProps) {
  const [template, setTemplate] = useState(item.template);
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [allowEmptyContent, setAllowEmptyContent] = useState(true);
  const [validation, setValidation] = useState<{
    isValid: boolean;
    errors: string[];
    warnings: string[];
  }>({
    isValid: true,
    errors: [],
    warnings: [],
  });
  const [output, setOutput] = useState<Array<{
    role: string;
    content: string;
  }> | null>(null);

  useEffect(() => {
    const extractedVars = extractVariables(template);
    const newVars: Record<string, string> = {};

    extractedVars.forEach((name) => {
      newVars[name] = variables[name] || getDefaultForVariable(name);
    });

    setVariables(newVars);
  }, [template]);

  function getDefaultForVariable(name: string): string {
    switch (name) {
      case "tone":
        return "professional";
      case "includeHashtags":
        return "true";
      case "includeEmojis":
        return "true";
      case "topic":
        return "artificial intelligence";
      case "task":
        return "writing code";
      case "name":
        return "Alice";
      case "btc_price":
        return "45000.00";
      case "market_sentiment":
        return "bullish";
      case "priceEmphasis":
        return "high";
      default:
        return `[${name}]`;
    }
  }

  const handleTemplateChange = (newTemplate: string) => {
    setTemplate(newTemplate);
    onUpdate?.(newTemplate);
  };

  const handleVariableChange = (name: string, value: string) => {
    setVariables((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleVerify = async () => {
    try {
      console.log("template", template);
      const builder = new PromptBuilder(template, {
        allowEmptyContent,
      }).withContext(variables);
      console.log("variables", variables);

      const validationResult = await builder.validate();
      console.log("validationResult", validationResult);
      const missingVars = extractVariables(template).filter(
        (name) =>
          !variables[name] && !["system", "user", "assistant"].includes(name)
      );

      if (!validationResult.isValid) {
        validationResult.errors.push(
          `Variables not defined: ${missingVars.join(", ")}`
        );
      }

      setValidation(validationResult);

      if (validationResult.isValid) {
        const messages = await builder.withContext(variables).build();
        setOutput(messages);
      }
    } catch (error) {
      setValidation({
        isValid: false,
        errors: [error instanceof Error ? error.message : "Unknown error"],
        warnings: [],
      });
    }
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Template Editor</CardTitle>
          <Badge variant={validation.isValid ? "default" : "destructive"}>
            {validation.isValid ? "Valid" : "Invalid"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="allow-empty"
              checked={allowEmptyContent}
              onCheckedChange={setAllowEmptyContent}
            />
            <Label htmlFor="allow-empty">Allow Empty Content</Label>
          </div>

          <textarea
            value={template}
            onChange={(e) => handleTemplateChange(e.target.value)}
            className="w-full h-64 p-4 font-mono text-sm rounded-md border bg-background resize-none"
            placeholder="Enter prompt template..."
          />

          {Object.keys(variables).length > 0 && (
            <div className="grid gap-4 md:grid-cols-2">
              {Object.entries(variables).map(([name, value]) => (
                <div key={name} className="flex gap-2 items-center">
                  <label className="text-sm font-medium min-w-[100px]">
                    {name}:
                  </label>
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => handleVariableChange(name, e.target.value)}
                    className="flex-1 p-2 text-sm rounded-md border bg-background"
                    placeholder={`Enter ${name}...`}
                  />
                </div>
              ))}
            </div>
          )}

          {validation.errors.length > 0 && (
            <div className="flex items-start gap-2 text-destructive">
              <AlertTriangle className="h-4 w-4 mt-0.5" />
              <ul className="text-sm space-y-1">
                {validation.errors.map((error, i) => (
                  <li key={i}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          <Button onClick={handleVerify} className="w-full">
            <Check className="mr-2 h-4 w-4" />
            Verify Template
          </Button>
        </div>

        {output && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Preview</h3>
            <pre className="p-4 rounded-md bg-muted overflow-auto max-h-96 whitespace-pre-wrap break-all">
              <code className="text-sm">{JSON.stringify(output, null, 2)}</code>
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
