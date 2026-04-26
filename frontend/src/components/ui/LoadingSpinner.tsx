import { cn } from "@/utils/cn";

interface LoadingSpinnerProps {
  label?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: "h-4 w-4 border-2",
  md: "h-6 w-6 border-2",
  lg: "h-8 w-8 border-[3px]"
};

function LoadingSpinner({ label = "Betöltés...", size = "md", className }: LoadingSpinnerProps) {
  return (
    <div className={cn("inline-flex items-center gap-2 text-sm text-neutral-700", className)} role="status" aria-live="polite">
      <span className={cn("animate-spin rounded-full border-brand-700 border-t-transparent", sizeMap[size])} aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}

export default LoadingSpinner;