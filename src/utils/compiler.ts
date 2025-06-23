// Types for compiler phases
export type Token = {
  type: string;
  value: string;
  line: number;
  column: number;
};

export type ASTNode = {
  type: string;
  value?: string;
  children?: ASTNode[];
  line?: number;
  column?: number;
};

export type SymbolTable = {
  [key: string]: {
    type: string;
    scope: string;
    line: number;
  };
};

export type IntermediateCode = {
  operation: string;
  args: string[];
  result: string;
};

export type OptimizedCode = IntermediateCode[];

export type TargetCode = {
  section: string;
  instructions: string[];
};

// Lexical Analysis (Tokenization)
export const lexicalAnalysis = (code: string): Token[] => {
  const tokens: Token[] = [];
  const lines = code.split('\n');
  
  const patterns = [
    { regex: /^\/\/.*$/, type: 'COMMENT' },
    { regex: /^program\b/, type: 'KEYWORD' },
    { regex: /^function\b/, type: 'KEYWORD' },
    { regex: /^return\b/, type: 'KEYWORD' },
    { regex: /^var\b/, type: 'KEYWORD' },
    { regex: /^if\b/, type: 'KEYWORD' },
    { regex: /^else\b/, type: 'KEYWORD' },
    { regex: /^for\b/, type: 'KEYWORD' },
    { regex: /^while\b/, type: 'KEYWORD' },
    { regex: /^print\b/, type: 'KEYWORD' },
    { regex: /^[a-zA-Z_][a-zA-Z0-9_]*/, type: 'IDENTIFIER' },
    { regex: /^[0-9]+/, type: 'NUMBER' },
    { regex: /^"[^"]*"/, type: 'STRING' },
    { regex: /^'[^']*'/, type: 'STRING' },
    { regex: /^[\+\-\*\/\=\<\>\!\&\|\(\)\{\}\[\]\;\:\,]/, type: 'OPERATOR' },
    { regex: /^\s+/, type: 'WHITESPACE' }, // Ignore whitespace
  ];
  
  lines.forEach((line, lineIdx) => {
    let column = 0;
    
    while (column < line.length) {
      const currentLine = line.substring(column);
      let matched = false;
      
      for (const pattern of patterns) {
        const match = currentLine.match(pattern.regex);
        if (match && match.index === 0) {
          const value = match[0];
          if (pattern.type !== 'WHITESPACE') {
            tokens.push({
              type: pattern.type,
              value,
              line: lineIdx + 1,
              column
            });
          }
          column += value.length;
          matched = true;
          break;
        }
      }
      
      if (!matched) {
        // Handle unrecognized token
        tokens.push({
          type: 'ERROR',
          value: currentLine[0],
          line: lineIdx + 1,
          column
        });
        column++;
      }
    }
  });
  
  return tokens;
};

// Syntax Analysis (Parsing)
export const syntaxAnalysis = (tokens: Token[]): ASTNode => {
  // Simplified parser that creates a basic AST
  const root: ASTNode = {
    type: 'Program',
    children: []
  };
  
  // Filter out comments for parsing
  const codeTokens = tokens.filter(token => token.type !== 'COMMENT');
  
  let currentIndex = 0;
  
  // Simple recursive descent parsing (simplified)
  const parseProgram = (): ASTNode => {
    const programNode: ASTNode = {
      type: 'Program',
      children: []
    };
    
    // Expect 'program' keyword
    if (currentIndex < codeTokens.length && 
        codeTokens[currentIndex].type === 'KEYWORD' && 
        codeTokens[currentIndex].value === 'program') {
      currentIndex++; // Skip 'program'
      
      // Expect program name
      if (currentIndex < codeTokens.length && codeTokens[currentIndex].type === 'IDENTIFIER') {
        programNode.value = codeTokens[currentIndex].value;
        currentIndex++; // Skip program name
        
        // Expect '{'
        if (currentIndex < codeTokens.length && 
            codeTokens[currentIndex].type === 'OPERATOR' && 
            codeTokens[currentIndex].value === '{') {
          currentIndex++; // Skip '{'
          
          // Parse functions
          while (currentIndex < codeTokens.length && 
                !(codeTokens[currentIndex].type === 'OPERATOR' && 
                  codeTokens[currentIndex].value === '}')) {
            if (codeTokens[currentIndex].type === 'KEYWORD' && 
                codeTokens[currentIndex].value === 'function') {
              programNode.children?.push(parseFunction());
            } else {
              // Skip unexpected tokens
              currentIndex++;
            }
          }
          
          // Expect '}'
          if (currentIndex < codeTokens.length && 
              codeTokens[currentIndex].type === 'OPERATOR' && 
              codeTokens[currentIndex].value === '}') {
            currentIndex++; // Skip '}'
          }
        }
      }
    }
    
    return programNode;
  };
  
  const parseFunction = (): ASTNode => {
    const functionNode: ASTNode = {
      type: 'Function',
      children: []
    };
    
    // Skip 'function' keyword
    currentIndex++;
    
    // Parse function name
    if (currentIndex < codeTokens.length && codeTokens[currentIndex].type === 'IDENTIFIER') {
      functionNode.value = codeTokens[currentIndex].value;
      currentIndex++; // Skip function name
      
      // Skip parameters and return type (simplified)
      while (currentIndex < codeTokens.length && 
            !(codeTokens[currentIndex].type === 'OPERATOR' && 
              codeTokens[currentIndex].value === '{')) {
        currentIndex++;
      }
      
      // Parse function body
      if (currentIndex < codeTokens.length && 
          codeTokens[currentIndex].type === 'OPERATOR' && 
          codeTokens[currentIndex].value === '{') {
        currentIndex++; // Skip '{'
        
        // Parse statements until '}'
        while (currentIndex < codeTokens.length && 
              !(codeTokens[currentIndex].type === 'OPERATOR' && 
                codeTokens[currentIndex].value === '}')) {
          functionNode.children?.push(parseStatement());
        }
        
        // Skip '}'
        if (currentIndex < codeTokens.length) {
          currentIndex++;
        }
      }
    }
    
    return functionNode;
  };
  
  const parseStatement = (): ASTNode => {
    // Simplified statement parsing
    const statementNode: ASTNode = {
      type: 'Statement',
      value: '', 
      children: []
    };
    
    // Collect statement tokens until ';' or '}'
    let statementTokens = [];
    const startIndex = currentIndex;
    
    while (currentIndex < codeTokens.length && 
          !(codeTokens[currentIndex].type === 'OPERATOR' && 
            (codeTokens[currentIndex].value === ';' || 
             codeTokens[currentIndex].value === '}'))) {
      statementTokens.push(codeTokens[currentIndex]);
      currentIndex++;
    }
    
    // Skip ';' if present
    if (currentIndex < codeTokens.length && 
        codeTokens[currentIndex].type === 'OPERATOR' && 
        codeTokens[currentIndex].value === ';') {
      currentIndex++;
    }
    
    // Determine statement type based on first token
    if (statementTokens.length > 0) {
      if (statementTokens[0].type === 'KEYWORD') {
        switch (statementTokens[0].value) {
          case 'var':
            statementNode.type = 'VariableDeclaration';
            break;
          case 'if':
            statementNode.type = 'IfStatement';
            break;
          case 'for':
            statementNode.type = 'ForLoop';
            break;
          case 'while':
            statementNode.type = 'WhileLoop';
            break;
          case 'return':
            statementNode.type = 'ReturnStatement';
            break;
          case 'print':
            statementNode.type = 'PrintStatement';
            break;
          default:
            statementNode.type = 'Statement';
        }
      } else if (statementTokens[0].type === 'IDENTIFIER') {
        statementNode.type = 'Assignment';
      }
    }
    
    // Set statement value as a simplified representation
    statementNode.value = statementTokens.map(t => t.value).join(' ');
    
    return statementNode;
  };
  
  const result = parseProgram();
  return result;
};

// Semantic Analysis
export const semanticAnalysis = (ast: ASTNode): { symbolTable: SymbolTable, errors: string[] } => {
  const symbolTable: SymbolTable = {};
  const errors: string[] = [];
  
  // Simplified semantic analysis
  const analyzeNode = (node: ASTNode, scope: string) => {
    if (node.type === 'Function' && node.value) {
      // Add function to symbol table
      symbolTable[`${node.value}@${scope}`] = {
        type: 'function',
        scope,
        line: node.line || 0
      };
      
      // Analyze function body
      node.children?.forEach(child => analyzeNode(child, `${scope}.${node.value}`));
    } 
    else if (node.type === 'VariableDeclaration' && node.value) {
      // Extract variable name (simplified)
      const parts = node.value.split(' ');
      if (parts.length > 1) {
        const varName = parts[1];
        
        // Check for variable redeclaration
        if (symbolTable[`${varName}@${scope}`]) {
          errors.push(`Error: Variable '${varName}' already declared in scope '${scope}'`);
        } else {
          // Extract type if available
          let varType = 'unknown';
          const typeMatch = node.value.match(/:\s*([a-zA-Z\[\]]+)/);
          if (typeMatch) {
            varType = typeMatch[1];
          }
          
          // Add variable to symbol table
          symbolTable[`${varName}@${scope}`] = {
            type: varType,
            scope,
            line: node.line || 0
          };
        }
      }
    }
    else if (node.type === 'Program' || node.children) {
      // Recursively analyze children
      node.children?.forEach(child => analyzeNode(child, scope));
    }
  };
  
  analyzeNode(ast, 'global');
  
  return { symbolTable, errors };
};

// Intermediate Code Generation
export const generateIntermediateCode = (ast: ASTNode): IntermediateCode[] => {
  const intermediateCode: IntermediateCode[] = [];
  let tempCounter = 0;
  
  // Generate a new temporary variable
  const newTemp = () => `t${tempCounter++}`;
  
  // Simplified intermediate code generation
  const generateForNode = (node: ASTNode) => {
    if (node.type === 'Program') {
      // Process program children
      node.children?.forEach(generateForNode);
    } 
    else if (node.type === 'Function' && node.value) {
      // Function declaration
      intermediateCode.push({
        operation: 'FUNC_BEGIN',
        args: [node.value],
        result: ''
      });
      
      // Process function body
      node.children?.forEach(generateForNode);
      
      // Function end
      intermediateCode.push({
        operation: 'FUNC_END',
        args: [node.value],
        result: ''
      });
    }
    else if (node.type === 'PrintStatement' && node.value) {
      // Extract what to print (simplified)
      const printMatch = node.value.match(/print\s*\(\s*(.+)\s*\)/);
      if (printMatch) {
        const printArg = printMatch[1].trim();
        
        // If argument is a string literal
        if (printArg.startsWith('"') && printArg.endsWith('"')) {
          intermediateCode.push({
            operation: 'PRINT_STR',
            args: [printArg],
            result: ''
          });
        } 
        // If argument is an identifier or expression
        else {
          const temp = newTemp();
          intermediateCode.push({
            operation: 'EVAL',
            args: [printArg],
            result: temp
          });
          intermediateCode.push({
            operation: 'PRINT',
            args: [temp],
            result: ''
          });
        }
      }
    }
    else if (node.type === 'ReturnStatement' && node.value) {
      // Extract return value
      const returnMatch = node.value.match(/return\s+(.+)/);
      if (returnMatch) {
        const returnValue = returnMatch[1].trim();
        const temp = newTemp();
        
        // Evaluate return expression
        intermediateCode.push({
          operation: 'EVAL',
          args: [returnValue],
          result: temp
        });
        
        // Return the result
        intermediateCode.push({
          operation: 'RETURN',
          args: [temp],
          result: ''
        });
      } else {
        // Return without value
        intermediateCode.push({
          operation: 'RETURN',
          args: [],
          result: ''
        });
      }
    }
    else if (node.type === 'VariableDeclaration' && node.value) {
      // Extract variable name and initialization value (simplified)
      const match = node.value.match(/var\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*(?::\s*[a-zA-Z\[\]]+)?\s*=\s*(.+)/);
      if (match) {
        const varName = match[1];
        const initValue = match[2].trim();
        
        intermediateCode.push({
          operation: 'ASSIGN',
          args: [initValue],
          result: varName
        });
      } else {
        // Variable declaration without initialization
        const varMatch = node.value.match(/var\s+([a-zA-Z_][a-zA-Z0-9_]*)/);
        if (varMatch) {
          const varName = varMatch[1];
          intermediateCode.push({
            operation: 'DECLARE',
            args: [varName],
            result: ''
          });
        }
      }
    }
    else if (node.type === 'Assignment' && node.value) {
      // Extract variable name and value (simplified)
      const match = node.value.match(/([a-zA-Z_][a-zA-Z0-9_]*(?:\[[^\]]+\])?)\s*=\s*(.+)/);
      if (match) {
        const varName = match[1];
        const assignValue = match[2].trim();
        
        intermediateCode.push({
          operation: 'ASSIGN',
          args: [assignValue],
          result: varName
        });
      }
    }
    else if (node.type === 'Statement' && node.children) {
      // Process any child statements
      node.children.forEach(generateForNode);
    }
  };
  
  generateForNode(ast);
  return intermediateCode;
};

// Code Optimization
export const optimizeCode = (intermediateCode: IntermediateCode[]): OptimizedCode => {
  // Simplified optimization: eliminate redundant assignments
  const optimizedCode: OptimizedCode = [];
  const processed = new Set<number>();
  
  for (let i = 0; i < intermediateCode.length; i++) {
    if (processed.has(i)) continue;
    
    const current = intermediateCode[i];
    
    // Check for consecutive assignments to the same variable
    if (i < intermediateCode.length - 1 && 
        current.operation === 'ASSIGN' && 
        intermediateCode[i+1].operation === 'ASSIGN' && 
        current.result === intermediateCode[i+1].result) {
      // Skip the first assignment
      processed.add(i);
    }
    // Eliminate unnecessary temporary variables
    else if (current.operation === 'EVAL' && 
             i < intermediateCode.length - 1 && 
             intermediateCode[i+1].operation === 'PRINT' && 
             intermediateCode[i+1].args[0] === current.result) {
      optimizedCode.push({
        operation: 'PRINT_EXPR',
        args: current.args,
        result: ''
      });
      processed.add(i);
      processed.add(i+1);
    }
    // Keep other instructions
    else {
      optimizedCode.push(current);
    }
  }
  
  return optimizedCode;
};

// Target Code Generation
export const generateTargetCode = (optimizedCode: OptimizedCode): TargetCode[] => {
  const targetCode: TargetCode[] = [
    {
      section: 'data',
      instructions: []
    },
    {
      section: 'text',
      instructions: []
    }
  ];
  
  // Add standard data section entries
  targetCode[0].instructions.push('# Data section');
  targetCode[0].instructions.push('format_int: .asciiz "%d\\n"');
  targetCode[0].instructions.push('format_str: .asciiz "%s\\n"');
  targetCode[0].instructions.push('');
  
  // Start text section
  targetCode[1].instructions.push('# Text section');
  targetCode[1].instructions.push('.globl main');
  
  let currentFunction = '';
  let stringCounter = 0;
  
  for (const instruction of optimizedCode) {
    switch (instruction.operation) {
      case 'FUNC_BEGIN':
        currentFunction = instruction.args[0];
        targetCode[1].instructions.push('');
        targetCode[1].instructions.push(`${currentFunction}:`);
        targetCode[1].instructions.push('    # Function prologue');
        targetCode[1].instructions.push('    pushq %rbp');
        targetCode[1].instructions.push('    movq %rsp, %rbp');
        break;
        
      case 'FUNC_END':
        targetCode[1].instructions.push('    # Function epilogue');
        targetCode[1].instructions.push('    movq %rbp, %rsp');
        targetCode[1].instructions.push('    popq %rbp');
        targetCode[1].instructions.push('    ret');
        break;
        
      case 'DECLARE':
        // Local variable declaration
        targetCode[1].instructions.push(`    # Declare ${instruction.args[0]}`);
        targetCode[1].instructions.push(`    subq $8, %rsp    # Allocate space for ${instruction.args[0]}`);
        break;
        
      case 'ASSIGN':
        // Assignment
        targetCode[1].instructions.push(`    # ${instruction.result} = ${instruction.args[0]}`);
        if (/^[0-9]+$/.test(instruction.args[0])) {
          // Numeric literal
          targetCode[1].instructions.push(`    movq $${instruction.args[0]}, %rax`);
        } else if (instruction.args[0].startsWith('"')) {
          // String literal
          const stringLabel = `str_${stringCounter++}`;
          targetCode[0].instructions.push(`${stringLabel}: .asciiz ${instruction.args[0]}`);
          targetCode[1].instructions.push(`    leaq ${stringLabel}(%rip), %rax`);
        } else {
          // Variable or expression
          targetCode[1].instructions.push(`    # Load ${instruction.args[0]}`);
          targetCode[1].instructions.push(`    movq -8(%rbp), %rax    # Simplified: assumes ${instruction.args[0]} is at -8(%rbp)`);
        }
        targetCode[1].instructions.push(`    movq %rax, -8(%rbp)    # Simplified: assumes ${instruction.result} is at -8(%rbp)`);
        break;
        
      case 'PRINT_STR':
        // Print string literal
        const stringLabel = `str_${stringCounter++}`;
        targetCode[0].instructions.push(`${stringLabel}: .asciiz ${instruction.args[0]}`);
        targetCode[1].instructions.push(`    # Print string "${instruction.args[0]}"`);
        targetCode[1].instructions.push(`    leaq ${stringLabel}(%rip), %rsi`);
        targetCode[1].instructions.push(`    leaq format_str(%rip), %rdi`);
        targetCode[1].instructions.push(`    xorq %rax, %rax`);
        targetCode[1].instructions.push(`    call printf`);
        break;
        
      case 'PRINT':
        // Print variable value
        targetCode[1].instructions.push(`    # Print ${instruction.args[0]}`);
        targetCode[1].instructions.push(`    movq -8(%rbp), %rsi    # Simplified: assumes ${instruction.args[0]} is at -8(%rbp)`);
        targetCode[1].instructions.push(`    leaq format_int(%rip), %rdi`);
        targetCode[1].instructions.push(`    xorq %rax, %rax`);
        targetCode[1].instructions.push(`    call printf`);
        break;
        
      case 'PRINT_EXPR':
        // Print expression result directly
        targetCode[1].instructions.push(`    # Print expression ${instruction.args[0]}`);
        targetCode[1].instructions.push(`    # (Evaluate expression, simplified implementation)`);
        targetCode[1].instructions.push(`    movq $1, %rsi    # Simplified: dummy value for expression result`);
        targetCode[1].instructions.push(`    leaq format_int(%rip), %rdi`);
        targetCode[1].instructions.push(`    xorq %rax, %rax`);
        targetCode[1].instructions.push(`    call printf`);
        break;
        
      case 'RETURN':
        // Return statement
        if (instruction.args.length > 0) {
          targetCode[1].instructions.push(`    # Return ${instruction.args[0]}`);
          targetCode[1].instructions.push(`    movq -8(%rbp), %rax    # Simplified: assumes ${instruction.args[0]} is at -8(%rbp)`);
        } else {
          targetCode[1].instructions.push(`    # Return void`);
          targetCode[1].instructions.push(`    xorq %rax, %rax`);
        }
        break;
        
      default:
        // Unknown instruction, add as comment
        targetCode[1].instructions.push(`    # Unsupported operation: ${instruction.operation}`);
    }
  }
  
  return targetCode;
};

// Main compilation function that ties everything together
export const compileCode = (code: string) => {
  try {
    // Phase 1: Lexical Analysis
    const tokens = lexicalAnalysis(code);
    
    // Phase 2: Syntax Analysis
    const ast = syntaxAnalysis(tokens);
    
    // Phase 3: Semantic Analysis
    const { symbolTable, errors } = semanticAnalysis(ast);
    
    // Phase 4: Intermediate Code Generation
    const intermediateCode = generateIntermediateCode(ast);
    
    // Phase 5: Code Optimization
    const optimizedCode = optimizeCode(intermediateCode);
    
    // Phase 6: Target Code Generation
    const targetCode = generateTargetCode(optimizedCode);
    
    return {
      tokens,
      ast,
      symbolTable,
      semanticErrors: errors,
      intermediateCode,
      optimizedCode,
      targetCode
    };
  } catch (error) {
    console.error("Compilation error:", error);
    return {
      error: `Compilation failed: ${error instanceof Error ? error.message : String(error)}`
    };
  }
};
