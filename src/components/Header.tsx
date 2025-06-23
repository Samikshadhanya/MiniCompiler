
import React from 'react';
import { Code2, Github } from 'lucide-react';

const Header = () => {
  return (
    <header className="border-b border-border bg-card py-4">
      <div className="container flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Code2 className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold">Mini Compiler Explorer</h1>
        </div>
        <a
          href="https://github.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <Github className="h-4 w-4" />
          <span>View on GitHub</span>
        </a>
      </div>
    </header>
  );
};

export default Header;
