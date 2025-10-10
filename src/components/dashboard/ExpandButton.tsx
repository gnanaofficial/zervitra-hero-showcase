import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Maximize2 } from "lucide-react";

interface ExpandButtonProps {
  onClick: () => void;
  label?: string;
  iconOnly?: boolean;
  expanded?: boolean;
}

export const ExpandButton = ({
  onClick,
  label = "View Details",
  iconOnly = false,
  expanded = false,
}: ExpandButtonProps) => {
  const button = (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      aria-label={label}
      aria-expanded={expanded}
      className="hover:bg-primary/10"
    >
      <Maximize2 className="w-4 h-4" />
      {!iconOnly && <span className="ml-2 hidden sm:inline">{label}</span>}
    </Button>
  );

  if (iconOnly) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{button}</TooltipTrigger>
          <TooltipContent>
            <p>{label}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return button;
};
