
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Play, PanelRightOpen, Copy, RefreshCw } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import samplePrograms from '@/utils/sampleCode';

interface CodeEditorProps {
  code: string;
  onCodeChange: (code: string) => void;
  onCompile: () => void;
  isCompiling: boolean;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  onCodeChange,
  onCompile,
  isCompiling
}) => {
  const { toast } = useToast();
  const [lineNumbers, setLineNumbers] = useState<string>('');

  useEffect(() => {
    // Generate line numbers based on code content
    const lines = code.split('\n');
    const numbers = lines.map((_, i) => i + 1).join('\n');
    setLineNumbers(numbers);
  }, [code]);

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onCodeChange(e.target.value);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Code copied",
      description: "The code has been copied to your clipboard",
      duration: 2000,
    });
  };

  const loadSample = (program: string) => {
    const selectedProgram = samplePrograms.find(p => p.name === program);
    if (selectedProgram) {
      onCodeChange(selectedProgram.code);
      toast({
        title: `Loaded ${selectedProgram.name}`,
        description: "Sample program loaded into the editor",
        duration: 2000,
      });
    }
  };

  return (
    <div className="rounded-md border border-border bg-card overflow-hidden">
      <div className="bg-muted p-2 border-b border-border flex justify-between items-center">
        <Label className="text-sm font-medium">Source Code</Label>
        <div className="flex items-center gap-2">
          <Select onValueChange={loadSample}>
            <SelectTrigger className="h-8 w-[180px]">
              <SelectValue placeholder="Load Sample Program" />
            </SelectTrigger>
            <SelectContent>
              {samplePrograms.map(program => (
                <SelectItem key={program.name} value={program.name}>
                  {program.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button size="sm" variant="ghost" onClick={copyCode}>
            <Copy className="h-4 w-4 mr-1" />
            Copy
          </Button>
        </div>
      </div>
      <div className="flex">
        <div className="bg-muted py-1 px-2 select-none text-right text-muted-foreground font-mono text-sm overflow-hidden">
          {lineNumbers}
        </div>
        <Textarea
          value={code}
          onChange={handleCodeChange}
          className="min-h-[400px] resize-none rounded-none border-0 font-mono text-sm font-medium bg-card flex-1 focus-visible:ring-0 code-editor"
          placeholder="Enter your code here..."
        />
      </div>
      <div className="p-2 border-t border-border flex justify-between items-center">
        <div className="text-xs text-muted-foreground">Custom Programming Language</div>
        <div className="flex items-center gap-2">
          <Button 
            onClick={() => onCodeChange('')} 
            size="sm" 
            variant="outline"
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Clear
          </Button>
          <Button 
            onClick={onCompile} 
            size="sm" 
            variant="default"
            disabled={isCompiling}
          >
            {isCompiling ? (
              <span className="animate-pulse">Compiling...</span>
            ) : (
              <>
                <Play className="h-4 w-4 mr-1" />
                Compile
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
