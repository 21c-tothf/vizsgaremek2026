import { cn } from "@/utils/cn";

interface StatusBadgeProps {
  label: string;
  tone?: "success" | "warning" | "danger" | "neutral";
}

const toneClasses: Record<NonNullable<StatusBadgeProps["tone"]>, string> = {
  success: "bg-green-100 text-green-700",
  warning: "bg-amber-100 text-amber-700",
  danger: "bg-red-100 text-red-700",
  neutral: "bg-slate-100 text-slate-700"
};

function StatusBadge({ label, tone = "neutral" }: StatusBadgeProps) {
  return <span className={cn("rounded-full px-3 py-1 text-xs font-semibold", toneClasses[tone])}>{label}</span>;
}

export default StatusBadge;