import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  return (
    <div className={cn(
      "prose prose-slate prose-sm md:prose-base dark:prose-invert max-w-none",
      "prose-headings:font-semibold prose-headings:tracking-tight",
      "prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg",
      "prose-p:leading-7",
      "prose-a:text-primary prose-a:no-underline hover:prose-a:underline",
      "prose-blockquote:border-l-4 prose-blockquote:border-primary/50 prose-blockquote:pl-4 prose-blockquote:italic",
      "prose-ul:my-4 prose-li:my-1",
      "prose-table:overflow-hidden prose-table:border prose-table:border-border prose-table:rounded-lg",
      "prose-th:bg-muted/50 prose-th:p-2 prose-th:text-left",
      "prose-td:p-2 prose-td:border-t prose-td:border-border",
      className
    )}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
