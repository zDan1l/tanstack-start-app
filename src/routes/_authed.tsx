import { getCurrentSession } from "#/modules/auth/auth.api";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authed")({
  component: App,
  beforeLoad: async () => {
    const session = await getCurrentSession();
    if (!session.id) {
      throw redirect({ to: "/" });
    }
    return { session };
  },
});

function App() {
  return (
    <div>
      <Outlet />
    </div>
  );
}
