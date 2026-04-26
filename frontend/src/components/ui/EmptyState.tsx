import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  actionTo?: string;
}

function EmptyState({ title, description, actionLabel, actionTo }: EmptyStateProps) {
  return (
    <Card className="border-dashed">
      <CardContent className="py-10 text-center sm:py-14">
        <h3 className="text-xl font-bold text-neutral-900">{title}</h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-neutral-700">{description}</p>
        {actionLabel && actionTo ? (
          <Link to={actionTo} className="mt-5 inline-flex">
            <Button variant="primary">{actionLabel}</Button>
          </Link>
        ) : null}
      </CardContent>
    </Card>
  );
}

export default EmptyState;