import { useEffect } from "react";
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

export const ExpandedViewContainer = ({
  isOpen,
  onClose,
  title,
  description,
  children,
}: ExpandedViewContainerProps) => {
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (isMobile) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent
          className="max-w-full h-full m-0 p-0 rounded-none"
          aria-describedby={description ? "dialog-description" : undefined}
        >
          <div className="h-full overflow-y-auto p-6">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-2xl">{title}</DialogTitle>
              {description && (
                <DialogDescription id="dialog-description">
                  {description}
                </DialogDescription>
              )}
            </DialogHeader>
            {children}
          </div>
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
        <SheetHeader className="mb-6">
          <SheetTitle className="text-2xl">{title}</SheetTitle>
          {description && (
            <SheetDescription id="sheet-description">
              {description}
            </SheetDescription>
          )}
        </SheetHeader>
        {children}
      </SheetContent>
    </Sheet>
  );
};
