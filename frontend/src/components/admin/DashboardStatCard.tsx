import { Card, CardContent } from "@/components/ui/Card";

interface DashboardStatCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  onClick?: () => void;
}

function DashboardStatCard({ title, value, subtitle, onClick }: DashboardStatCardProps) {
  return (
    <Card className={onClick ? "cursor-pointer transition hover:-translate-y-0.5 hover:shadow-md" : undefined} onClick={onClick}>
      <CardContent className={onClick ? "focus:outline-none" : undefined}>
        <p className="text-sm font-semibold uppercase tracking-wide text-black">{title}</p>
        <p className="mt-2 text-3xl font-black text-brand-900">{value}</p>
        {subtitle ? <p className="mt-1 text-sm text-black">{subtitle}</p> : null}
      </CardContent>
    </Card>
  );
}

export default DashboardStatCard;