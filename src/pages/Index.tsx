
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import CodeEditor from '@/components/CodeEditor';
import CompilationPhases from '@/components/CompilationPhases';
import { compileCode } from '@/utils/compiler';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import samplePrograms from '@/utils/sampleCode';

const Index = () => {
  const { toast } = useToast();
  const [code, setCode] = useState(samplePrograms[0].code);
  const [compilationResults, setCompilationResults] = useState<any>({});
  const [activePhase, setActivePhase] = useState(-1);
  const [isCompiling, setIsCompiling] = useState(false);
  const [compilationError, setCompilationError] = useState<string | null>(null);

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
  };

  const handleCompile = async () => {
    setIsCompiling(true);
    setCompilationError(null);
    setActivePhase(-1);
    setCompilationResults({});

    // Simulate different phases of compilation with delays
    try {
      // Clear previous results
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Start compilation
      const results = compileCode(code);
      
      if (results.error) {
        setCompilationError(results.error);
        toast({
          variant: "destructive",
          title: "Compilation Failed",
          description: results.error,
        });
      } else {
        // Animate through the phases
        const animatePhases = async () => {
          for (let i = 0; i < 6; i++) {
            await new Promise(resolve => setTimeout(resolve, 300));
            setActivePhase(i);
          }
        };
        
        await animatePhases();
        setCompilationResults(results);
        
        toast({
          title: "Compilation Complete",
          description: "All phases of compilation have been executed successfully.",
        });
      }
    } catch (error) {
      setCompilationError(`Unexpected error: ${error instanceof Error ? error.message : String(error)}`);
      toast({
        variant: "destructive",
        title: "Compilation Failed",
        description: "An unexpected error occurred during compilation.",
      });
    } finally {
      setIsCompiling(false);
    }
  };

  // Set default code when component mounts
  useEffect(() => {
    // This is now done with the initial state
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            Design and Implementation of a Mini Compiler
          </h1>
          <p className="text-muted-foreground max-w-3xl">
            Explore the phases of compilation for a custom programming language targeting machine architecture.
            Write code in the editor and observe how it's processed through each compilation stage.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5">
            <CodeEditor
              code={code}
              onCodeChange={handleCodeChange}
              onCompile={handleCompile}
              isCompiling={isCompiling}
            />
          </div>
          
          <div className="lg:col-span-7">
            <Tabs defaultValue="visualize" className="mb-6">
              <TabsList>
                <TabsTrigger value="visualize">Compilation Phases</TabsTrigger>
                <TabsTrigger value="about">About the Compiler</TabsTrigger>
              </TabsList>
              
              <TabsContent value="visualize">
                {compilationError ? (
                  <Alert variant="destructive" className="mb-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Compilation Error</AlertTitle>
                    <AlertDescription>{compilationError}</AlertDescription>
                  </Alert>
                ) : null}
                
                <CompilationPhases
                  compilationResults={compilationResults}
                  activePhase={activePhase}
                />
              </TabsContent>
              
              <TabsContent value="about">
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-semibold mb-2">About this Mini Compiler</h3>
                    
                    <p className="mb-4">
                      This application demonstrates the process of compiling a custom programming language
                      through the standard phases of compilation:
                    </p>
                    
                    <ol className="list-decimal list-inside space-y-3 mb-4">
                      <li>
                        <strong>Lexical Analysis (Scanning)</strong>: Converts the source code into tokens
                        such as keywords, identifiers, literals, and operators.
                      </li>
                      <li>
                        <strong>Syntax Analysis (Parsing)</strong>: Organizes tokens into a hierarchical
                        structure called an Abstract Syntax Tree (AST).
                      </li>
                      <li>
                        <strong>Semantic Analysis</strong>: Checks for semantic errors and creates a symbol
                        table to track variables, functions, and their properties.
                      </li>
                      <li>
                        <strong>Intermediate Code Generation</strong>: Translates the AST into an
                        architecture-independent intermediate representation.
                      </li>
                      <li>
                        <strong>Code Optimization</strong>: Improves the intermediate code to enhance
                        execution efficiency without changing its behavior.
                      </li>
                      <li>
                        <strong>Code Generation</strong>: Translates the optimized intermediate code into
                        target machine code or assembly language.
                      </li>
                    </ol>
                    
                    <p>
                      The custom language demonstrated here is a simplified imperative language with C-like
                      syntax, supporting basic constructs like variables, functions, conditionals, and loops.
                      The target architecture is a simplified x86-64 assembly language.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      
      <footer className="py-6 border-t border-border">
        <div className="container text-center text-sm text-muted-foreground">
          <p>
            Mini Compiler Explorer &copy; {new Date().getFullYear()} - Educational Tool for Understanding Compilation Phases
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
