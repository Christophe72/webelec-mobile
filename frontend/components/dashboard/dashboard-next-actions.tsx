import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface NextAction {
  title: string;
  detail: string;
}

interface DashboardNextActionsProps {
  nextActions: NextAction[];
}

export function DashboardNextActions({
  nextActions,
}: DashboardNextActionsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {nextActions.map((action) => (
        <Card key={action.title} className="border-border/60">
          <CardHeader>
            <CardTitle className="text-base">{action.title}</CardTitle>
            <CardDescription>{action.detail}</CardDescription>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
