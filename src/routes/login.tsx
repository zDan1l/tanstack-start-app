import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Input, Button } from '@heroui/react'
import { loginServerFn } from '#/modules/auth/auth.api';
import { useEffect, useState } from 'react';
import { useServerFn } from '@tanstack/react-start';
import { z } from 'zod'
import { toast } from 'sonner';

export const Route = createFileRoute('/login')({
  component: RouteComponent,
  validateSearch : (search : Record<string, string>) => ({
    success : z.string().optional().parse(search.success)
  }),
})

function RouteComponent() {
  const { success } = Route.useSearch();
  const navigate = useNavigate();

  useEffect(() => {
    if(success){
      toast.success(success);
      navigate({ to : ".", search : {} })
    }
  }, [success])

  // wrapper login server function
  const loginHandler = useServerFn(loginServerFn);
  const [isLoading, setIsLoading] = useState(false);
  async function handleLogin(event: React.SubmitEvent<HTMLFormElement>) {
    setIsLoading(true);
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    await loginHandler({
      data : {
        email : email,
        password : password
      }
    });

    setIsLoading(false);
  }
  return (
    <>
        <main className='grid grid-cols-2 h-screen'>
          <section className='bg-blue-600'></section>
          <section className='flex justify-center items-center'>
            <form className='flex flex-col w-[400px] space-y-4' onSubmit={handleLogin}>
                <Input name="email" type="email" placeholder='Email' />
                <Input name="password" type="password" placeholder='Password' />
                <div className="flex align-center gap-2">
                  <Button isDisabled={isLoading} type="submit">
                      {isLoading ? "Login..." : "Login"}
                  </Button>
                  <div className="flex align-center">
                    <a href="/register" className='text-blue-500 hover:underline inline h-6'>
                        Register
                    </a>
                  </div>
                </div>
            </form>
          </section>
        </main>
    </>
  )
}
