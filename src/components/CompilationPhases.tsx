
import React, { useState, useEffect } from 'react';
import PhaseOutput from './PhaseOutput';
import { Token, ASTNode, SymbolTable, IntermediateCode, OptimizedCode, TargetCode } from '@/utils/compiler';

interface CompilationPhasesProps {
  compilationResults: {
    tokens?: Token[];
    ast?: ASTNode;
    symbolTable?: SymbolTable;
    semanticErrors?: string[];
    intermediateCode?: IntermediateCode[];
    optimizedCode?: OptimizedCode;
    targetCode?: TargetCode[];
    error?: string;
  };
  activePhase: number;
}

const CompilationPhases: React.FC<CompilationPhasesProps> = ({
  compilationResults,
  activePhase
}) => {
  const [phases, setPhases] = useState<Array<{ name: string; description: string; }>>(
    [
      {
        name: "Lexical Analysis",
        description: "Breaks down the source code into tokens like keywords, identifiers, and operators."
      },
      {
        name: "Syntax Analysis",
        description: "Parses the tokens into an abstract syntax tree (AST) representing the program structure."
      },
      {
        name: "Semantic Analysis",
        description: "Checks for semantic errors and builds the symbol table with variable and function information."
      },
      {
        name: "Intermediate Code",
        description: "Generates an intermediate representation of the program that is architecture-independent."
      },
      {
        name: "Code Optimization",
        description: "Improves the intermediate code for better performance by eliminating redundancies."
      },
      {
        name: "Code Generation",
        description: "Translates the optimized code into target machine code or assembly language."
      }
    ]
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {phases.map((phase, index) => (
        <PhaseOutput
          key={index}
          phaseName={phase.name}
          description={phase.description}
          tokens={index === 0 ? compilationResults.tokens : undefined}
          ast={index === 1 ? compilationResults.ast : undefined}
          symbolTable={index === 2 ? compilationResults.symbolTable : undefined}
          semanticErrors={index === 2 ? compilationResults.semanticErrors : undefined}
          intermediateCode={index === 3 ? compilationResults.intermediateCode : undefined}
          optimizedCode={index === 4 ? compilationResults.optimizedCode : undefined}
          targetCode={index === 5 ? compilationResults.targetCode : undefined}
          isActive={index === activePhase}
        />
      ))}
    </div>
  );
};

export default CompilationPhases;
