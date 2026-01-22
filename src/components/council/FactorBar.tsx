import { Factor } from '@/types/council';
import { Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FactorBarProps {
  factors: Factor[];
}

export function FactorBar({ factors }: FactorBarProps) {
  if (factors.length === 0) return null;

  return (
    <div className="glass-surface rounded-xl p-4">
      <div className="water-highlight" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider text-frosted/60 font-medium">
              Analyzing Factors
            </span>
            <span className="text-xs text-muted-foreground px-2 py-0.5 rounded-full bg-muted/50">
              {factors.length} total
            </span>
          </div>
          
          <button className="flex items-center gap-1.5 text-xs text-frosted/60 hover:text-frosted transition-colors">
            <Globe className="w-3.5 h-3.5" />
            <span>Web Scraper</span>
          </button>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {factors.map((factor, index) => (
            <div
              key={factor.id}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-lg",
                "bg-muted/30 border border-frosted/10",
                "animate-fade-in-up"
              )}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <span className="w-5 h-5 flex items-center justify-center rounded-md bg-teal/20 text-primary text-xs font-medium">
                {index + 1}
              </span>
              <span className="text-xs text-frosted/80 max-w-[200px] truncate">
                {factor.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
