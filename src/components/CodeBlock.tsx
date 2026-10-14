import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
  highlightLine?: number;
  className?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = 'python',
  filename,
  showLineNumbers = true,
  className = ''
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = code.trim().split('\n');

  // Simple, elegant syntax color tokenizer
  const formatCodeLine = (line: string) => {
    // Comment
    if (line.trim().startsWith('#') || line.trim().startsWith('//') || line.trim().startsWith('--')) {
      return <span className="text-neutral-500 italic">{line}</span>;
    }

    // Basic syntax highlighting with regex replacement
    const parts = line.split(/(\b(?:def|class|return|if|elif|else|for|in|while|import|from|as|print|SELECT|FROM|WHERE|JOIN|GROUP BY|ORDER BY|HAVING|COUNT|ROUND|AVG|const|let|var|function|interface|export)\b|"[^"]*"|'[^']*'|\b\d+\b)/g);

    return parts.map((part, i) => {
      if (/^(def|class|return|if|elif|else|for|in|while|import|from|as|print|SELECT|FROM|WHERE|JOIN|GROUP BY|ORDER BY|HAVING|COUNT|ROUND|AVG|const|let|var|function|interface|export)$/.test(part)) {
        return <span key={i} className="text-purple font-bold">{part}</span>;
      }
      if (/^["'].*["']$/.test(part)) {
        return <span key={i} className="text-green font-medium">{part}</span>;
      }
      if (/^\d+$/.test(part)) {
        return <span key={i} className="text-gold font-bold">{part}</span>;
      }
      return <span key={i} className="text-navy">{part}</span>;
    });
  };

  return (
    <div className={`rounded-xl overflow-hidden border-2 border-border bg-card-subtle text-navy text-xs sm:text-sm font-mono shadow-sm ${className}`}>
      {filename && (
        <div className="flex items-center justify-between px-4 py-2 bg-card border-b-2 border-border text-muted">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red/60 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-gold/60 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-green/60 inline-block" />
            </div>
            <span className="ml-2 font-mono text-xs text-navy font-bold">{filename}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] uppercase tracking-wider text-muted font-heading font-bold">{language}</span>
            <button
              onClick={handleCopy}
              className="p-1 rounded text-muted hover:text-navy hover:bg-card-subtle transition-colors cursor-pointer"
              title="Copy code"
              aria-label="Copy code"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-green" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      )}

      <div className="p-4 overflow-x-auto selection:bg-purple/30">
        <pre className="leading-relaxed">
          {lines.map((line, idx) => (
            <div key={idx} className="table-row">
              {showLineNumbers && (
                <span className="table-cell pr-4 select-none text-right text-muted/60 text-xs font-mono tabular-nums">
                  {idx + 1}
                </span>
              )}
              <span className="table-cell whitespace-pre font-mono">
                {formatCodeLine(line)}
              </span>
            </div>
          ))}
        </pre>
      </div>
    </div>
  );
};
