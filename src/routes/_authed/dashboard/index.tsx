import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authed/dashboard/")({
  component: DashboardPage
});

function DashboardPage() {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Welcome to Dashboard</h3>
    </div>
  );
}
