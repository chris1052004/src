import { ReactNode } from 'react';

interface TimelineProps {
  items: TimelineItem[];
  emptyState?: {
    icon: ReactNode;
    title: string;
    description: string;
  };
}

export interface TimelineItem {
  id: string;
  time: string;
  title: string;
  type: 'inspection' | 'issue' | 'training';
  meta?: string;
  status?: 'completed' | 'pending' | 'overdue';
}

export function Timeline({ items, emptyState }: TimelineProps) {
  if (items.length === 0 && emptyState) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="text-muted-foreground mb-4">{emptyState.icon}</div>
        <h3 className="text-base font-medium mb-2">{emptyState.title}</h3>
        <p className="text-sm text-muted-foreground">{emptyState.description}</p>
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {items.map((item, index) => (
        <div key={item.id} className="flex gap-4">
          {/* Timeline indicator */}
          <div className="flex flex-col items-center">
            <div
              className={`
                w-3 h-3 rounded-full border-2
                ${
                  item.type === 'inspection'
                    ? 'bg-primary-blue border-primary-blue'
                    : item.type === 'issue'
                    ? 'bg-danger-red border-danger-red'
                    : 'bg-success-green border-success-green'
                }
              `}
            />
            {index < items.length - 1 && (
              <div className="w-0.5 h-full min-h-[60px] bg-divider" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 pb-6">
            <div className="text-xs text-muted-foreground mb-1">{item.time}</div>
            <div className="font-medium">{item.title}</div>
            {item.meta && (
              <div className="text-sm text-muted-foreground mt-1">{item.meta}</div>
            )}
            {item.status && (
              <div
                className={`
                  inline-block mt-2 text-xs px-2 py-1 rounded-full
                  ${
                    item.status === 'completed'
                      ? 'bg-success-green/10 text-success-green'
                      : item.status === 'overdue'
                      ? 'bg-danger-red/10 text-danger-red'
                      : 'bg-neutral-200 dark:bg-neutral-800 text-muted-foreground'
                  }
                `}
              >
                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
