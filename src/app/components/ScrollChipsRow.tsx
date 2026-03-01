import { clsx } from 'clsx';

interface ScrollChipsRowProps {
  items?: string[];
  activeItem: string;
  onSelect?: (item: string) => void;
  ariaLabel?: string;
  className?: string;
  showEdgeFade?: boolean;
}

export function ScrollChipsRow({
  items,
  activeItem,
  onSelect,
  ariaLabel = 'Filter chips',
  className,
  showEdgeFade = true,
}: ScrollChipsRowProps) {
  const safeItems = Array.isArray(items) ? items : [];

  if (safeItems.length === 0) return null;

  return (
    <div className={clsx('relative -mx-4', className)}>
      {showEdgeFade && (
        <>
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-card to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-card to-transparent z-10 pointer-events-none" />
        </>
      )}

      <div className="overflow-x-auto scrollbar-hide">
        <div
          role="tablist"
          aria-label={ariaLabel}
          className="flex min-w-max gap-2 py-1 pl-4 pr-4 snap-x snap-mandatory"
        >
          {safeItems.map((item) => {
            const active = activeItem === item;
            return (
              <button
                key={item}
                role="tab"
                aria-selected={active}
                onClick={() => onSelect?.(item)}
                className={clsx(
                  'h-8 px-3.5 rounded-full text-[12px] font-medium whitespace-nowrap snap-start transition-colors',
                  active
                    ? 'bg-primary-blue text-white'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                )}
              >
                {item}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
