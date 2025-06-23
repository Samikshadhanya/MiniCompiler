
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Token, ASTNode, SymbolTable, IntermediateCode, OptimizedCode, TargetCode } from '@/utils/compiler';

interface PhaseOutputProps {
  phaseName: string;
  description: string;
  tokens?: Token[];
  ast?: ASTNode;
  symbolTable?: SymbolTable;
  semanticErrors?: string[];
  intermediateCode?: IntermediateCode[];
  optimizedCode?: OptimizedCode;
  targetCode?: TargetCode[];
  isActive: boolean;
}

const PhaseOutput: React.FC<PhaseOutputProps> = ({
  phaseName,
  description,
  tokens,
  ast,
  symbolTable,
  semanticErrors,
  intermediateCode,
  optimizedCode,
  targetCode,
  isActive
}) => {
  // Render tokens with highlighting
  const renderTokens = () => {
    if (!tokens || tokens.length === 0) return <div className="text-muted-foreground">No tokens to display</div>;

    return (
      <div className="font-mono text-sm">
        {tokens.map((token, index) => (
          <div key={index} className="mb-1">
            <Badge variant="outline" className="mr-2 font-mono text-xs">
              {token.line}:{token.column}
            </Badge>
            <Badge 
              variant="secondary" 
              className={cn({
                'bg-purple-900/20 text-purple-400': token.type === 'KEYWORD',
                'bg-blue-900/20 text-blue-400': token.type === 'IDENTIFIER',
                'bg-green-900/20 text-green-400': token.type === 'NUMBER',
                'bg-yellow-900/20 text-yellow-400': token.type === 'STRING',
                'bg-pink-900/20 text-pink-400': token.type === 'OPERATOR',
                'bg-gray-900/20 text-gray-400': token.type === 'COMMENT',
                'bg-red-900/20 text-red-400': token.type === 'ERROR',
              })}
            >
              {token.type}
            </Badge>
            <span className="ml-2 font-mono">{token.value}</span>
          </div>
        ))}
      </div>
    );
  };

  // Recursively render AST nodes
  const renderASTNode = (node: ASTNode, level: number = 0) => {
    const indent = '  '.repeat(level);
    
    return (
      <div className="font-mono text-sm" key={`${node.type}-${level}-${node.value}`}>
        <div>
          {indent}
          <Badge className="bg-slate-800 text-white font-mono text-xs mr-2">
            {node.type}
          </Badge>
          {node.value && <span className="text-blue-400">{node.value}</span>}
        </div>
        {node.children && node.children.map(child => (
          renderASTNode(child, level + 1)
        ))}
      </div>
    );
  };

  // Render symbol table
  const renderSymbolTable = () => {
    if (!symbolTable || Object.keys(symbolTable).length === 0) {
      return <div className="text-muted-foreground">No symbol table entries</div>;
    }

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 px-4 font-medium">Name</th>
              <th className="text-left py-2 px-4 font-medium">Type</th>
              <th className="text-left py-2 px-4 font-medium">Scope</th>
              <th className="text-left py-2 px-4 font-medium">Line</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(symbolTable).map(([key, entry], index) => {
              const [name, scope] = key.split('@');
              return (
                <tr key={index} className="border-b border-border">
                  <td className="py-2 px-4 font-mono">{name}</td>
                  <td className="py-2 px-4">
                    <Badge variant="outline">{entry.type}</Badge>
                  </td>
                  <td className="py-2 px-4 font-mono text-xs">{entry.scope}</td>
                  <td className="py-2 px-4">{entry.line}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  // Render semantic errors
  const renderSemanticErrors = () => {
    if (!semanticErrors || semanticErrors.length === 0) {
      return <div className="text-green-500">No semantic errors found</div>;
    }

    return (
      <div className="space-y-2">
        {semanticErrors.map((error, index) => (
          <div key={index} className="p-2 rounded bg-red-900/20 text-red-400 font-mono text-sm">
            {error}
          </div>
        ))}
      </div>
    );
  };

  // Render intermediate code
  const renderIntermediateCode = () => {
    if (!intermediateCode || intermediateCode.length === 0) {
      return <div className="text-muted-foreground">No intermediate code generated</div>;
    }

    return (
      <div className="font-mono text-sm">
        {intermediateCode.map((instr, index) => (
          <div key={index} className="mb-1">
            <Badge variant="outline" className="mr-2 font-mono text-xs">
              {index}
            </Badge>
            <span className="font-medium text-purple-400">{instr.operation}</span>
            <span className="text-muted-foreground mx-1">
              {instr.args.length > 0 ? `(${instr.args.join(', ')})` : '()'}
            </span>
            {instr.result && (
              <>
                <span className="text-muted-foreground mx-1">→</span>
                <span className="text-blue-400">{instr.result}</span>
              </>
            )}
          </div>
        ))}
      </div>
    );
  };

  // Render optimized code
  const renderOptimizedCode = () => {
    if (!optimizedCode || optimizedCode.length === 0) {
      return <div className="text-muted-foreground">No optimized code available</div>;
    }

    return (
      <div className="font-mono text-sm">
        {optimizedCode.map((instr, index) => (
          <div key={index} className="mb-1">
            <Badge variant="outline" className="mr-2 font-mono text-xs">
              {index}
            </Badge>
            <span className="font-medium text-purple-400">{instr.operation}</span>
            <span className="text-muted-foreground mx-1">
              {instr.args.length > 0 ? `(${instr.args.join(', ')})` : '()'}
            </span>
            {instr.result && (
              <>
                <span className="text-muted-foreground mx-1">→</span>
                <span className="text-blue-400">{instr.result}</span>
              </>
            )}
          </div>
        ))}
      </div>
    );
  };

  // Render target code
  const renderTargetCode = () => {
    if (!targetCode || targetCode.length === 0) {
      return <div className="text-muted-foreground">No target code generated</div>;
    }

    return (
      <Tabs defaultValue="text">
        <TabsList className="mb-2">
          <TabsTrigger value="data">Data Section</TabsTrigger>
          <TabsTrigger value="text">Text Section</TabsTrigger>
        </TabsList>
        
        <TabsContent value="data">
          <div className="font-mono text-sm whitespace-pre">
            {targetCode[0]?.instructions.join('\n')}
          </div>
        </TabsContent>
        
        <TabsContent value="text">
          <div className="font-mono text-sm whitespace-pre">
            {targetCode[1]?.instructions.join('\n')}
          </div>
        </TabsContent>
      </Tabs>
    );
  };

  // Determine which content to render based on the phase
  const renderPhaseContent = () => {
    switch (phaseName) {
      case "Lexical Analysis":
        return renderTokens();
      case "Syntax Analysis":
        return ast ? renderASTNode(ast) : <div className="text-muted-foreground">No AST to display</div>;
      case "Semantic Analysis":
        return (
          <Tabs defaultValue="symbol-table">
            <TabsList className="mb-2">
              <TabsTrigger value="symbol-table">Symbol Table</TabsTrigger>
              <TabsTrigger value="errors">Semantic Errors</TabsTrigger>
            </TabsList>
            <TabsContent value="symbol-table">
              {renderSymbolTable()}
            </TabsContent>
            <TabsContent value="errors">
              {renderSemanticErrors()}
            </TabsContent>
          </Tabs>
        );
      case "Intermediate Code":
        return renderIntermediateCode();
      case "Code Optimization":
        return renderOptimizedCode();
      case "Code Generation":
        return renderTargetCode();
      default:
        return <div className="text-muted-foreground">No data to display</div>;
    }
  };

  return (
    <Card className={cn("phase-card", isActive && "active-phase", "h-full")}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          {phaseName}
          {isActive && (
            <Badge variant="default" className="bg-blue-600 text-white">
              Active
            </Badge>
          )}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <ScrollArea className="h-[300px] rounded-md border p-2">
          {renderPhaseContent()}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default PhaseOutput;
