import { Header } from '#/components/Header';
import { Sidebar } from '#/components/Sidebar';
import { getCurrentSession } from '#/modules/auth/auth.api';
import { createFileRoute, Outlet, useNavigate } from '@tanstack/react-router'
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import z from 'zod';

export const Route = createFileRoute('/_authed/dashboard')({
  component: RouteComponent,
  loader: async () => {
      const profile = await getCurrentSession();
      return { profile };
  },
  validateSearch : (search : Record<string, string>) => ({
    success : z.string().optional().parse(search.success)
  }),
})

function RouteComponent() {
  const { profile } = Route.useLoaderData();

  const { success } = Route.useSearch();
  const navigate = useNavigate();
  const hasShownToast = useRef(false);

  useEffect(() => {
    if (success && !hasShownToast.current) {
      hasShownToast.current = true;
      toast.success(success);
      navigate({ to: ".", search: {} });
    }
  }, [success]);

  return (
    <div className="flex min-h-screen">
          <Sidebar userName={profile?.name || " "} />
    
          <main className="flex-1">
            <Header />
    
            <section className="p-6">
              <Outlet />
            </section>
          </main>
        </div>
  )
}
