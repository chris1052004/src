import { ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx } from 'clsx';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  contentClassName?: string;
}

export function BottomSheet({
  isOpen,
  onClose,
  title,
  children,
  footer,
  contentClassName,
}: BottomSheetProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop — above BottomNav (z-50) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 z-[60]"
            onClick={onClose}
          />

          {/* Sheet — max-h uses svh for iOS viewport accuracy */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 350 }}
            className="fixed bottom-0 left-0 right-0 z-[60] bg-card rounded-t-[24px] shadow-2xl max-w-[480px] mx-auto max-h-[85svh] flex flex-col"
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-2 flex-shrink-0">
              <div className="w-10 h-1 bg-neutral-300 rounded-full" />
            </div>

            {/* Sticky header */}
            {title && (
              <div className="flex items-center justify-between px-5 py-3 border-b border-divider/50 flex-shrink-0">
                <h3 className="text-[16px] font-semibold text-foreground">{title}</h3>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center"
                >
                  <X className="w-4 h-4 text-muted-foreground" strokeWidth={2} />
                </button>
              </div>
            )}

            {/* Scrollable content */}
            <div
              className={clsx(
                'px-5 py-4 flex-1 overflow-y-auto scrollbar-hide',
                contentClassName
              )}
              style={{
                paddingBottom: footer ? '16px' : 'max(env(safe-area-inset-bottom), 24px)',
              }}
            >
              {children}
            </div>

            {/* Sticky footer with safe-area clearance */}
            {footer && (
              <div
                className="px-5 pt-3 border-t border-divider/50 bg-card/95 backdrop-blur-sm flex-shrink-0"
                style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 16px)' }}
              >
                {footer}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

interface BottomSheetItemProps {
  icon: ReactNode;
  label: string;
  description?: string;
  onClick: () => void;
  index?: number;
}

export function BottomSheetItem({ icon, label, description, onClick, index = 0 }: BottomSheetItemProps) {
  return (
    <motion.button
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.06, duration: 0.3 }}
      onClick={onClick}
      whileTap={{ scale: 0.97 }}
      className="w-full flex items-center gap-4 p-3.5 rounded-2xl active:bg-neutral-100 transition-colors text-left group"
    >
      <div className="flex-shrink-0 w-11 h-11 rounded-2xl bg-primary-blue/8 text-primary-blue flex items-center justify-center">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[14px] font-medium text-foreground">{label}</div>
        {description && (
          <div className="text-[12px] text-muted-foreground mt-0.5 line-clamp-1">{description}</div>
        )}
      </div>
      <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-muted-foreground/40">
          <path d="M4.5 2.5L8 6L4.5 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </motion.button>
  );
}
