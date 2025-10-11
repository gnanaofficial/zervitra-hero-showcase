import { useEffect, useRef, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

interface ExpandedViewContainerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
}

export const ExpandedViewContainer = memo(({
  isOpen,
  onClose,
  title,
  description,
  children,
}: ExpandedViewContainerProps) => {
  const isMobile = useIsMobile();
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";

      const focusableElements = containerRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      if (focusableElements && focusableElements.length > 0) {
        (focusableElements[0] as HTMLElement).focus();
      }
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const animationDuration = prefersReducedMotion ? 0.1 : 0.4;

  if (isMobile) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent
          className="max-w-full h-full m-0 p-0 rounded-none"
          aria-describedby={description ? "dialog-description" : undefined}
        >
          <AnimatePresence>
            {isOpen && (
              <motion.div
                ref={containerRef}
                initial={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.95 }}
                transition={{ duration: animationDuration, ease: "easeOut" }}
                className="h-full overflow-y-auto p-6"
                role="dialog"
                aria-modal="true"
                aria-label={title}
                aria-live="polite"
              >
                <DialogHeader className="mb-6">
                  <DialogTitle className="text-2xl">{title}</DialogTitle>
                  {description && (
                    <DialogDescription id="dialog-description">
                      {description}
                    </DialogDescription>
                  )}
                </DialogHeader>
                {children}
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-3xl lg:max-w-5xl overflow-y-auto"
        aria-describedby={description ? "sheet-description" : undefined}
      >
        <AnimatePresence>
          {isOpen && (
            <motion.div
              ref={containerRef}
              initial={{ x: prefersReducedMotion ? 0 : "100%" }}
              animate={{ x: 0 }}
              exit={{ x: prefersReducedMotion ? 0 : "100%" }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
                duration: animationDuration
              }}
              role="dialog"
              aria-modal="true"
              aria-label={title}
              aria-live="polite"
            >
              <SheetHeader className="mb-6">
                <SheetTitle className="text-2xl">{title}</SheetTitle>
                {description && (
                  <SheetDescription id="sheet-description">
                    {description}
                  </SheetDescription>
                )}
              </SheetHeader>
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </SheetContent>
    </Sheet>
  );
});

ExpandedViewContainer.displayName = "ExpandedViewContainer";
