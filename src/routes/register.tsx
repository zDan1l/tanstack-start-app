import { createFileRoute } from '@tanstack/react-router'
import { Input, Button } from '@heroui/react'
import { registerServerFn } from '#/modules/auth/auth.api';
import { useServerFn } from '@tanstack/react-start';

export const Route = createFileRoute('/register')({
  component: RouteComponent,
})

function RouteComponent() {
  // wrapper register server function
  const registerHandler = useServerFn(registerServerFn)

  async function handleRegister(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    await registerHandler({
      data : {
        name,
        email,
        password
      }
    })
  }
  return (
    <>
        <main className='grid grid-cols-2 h-screen'>
          <section className='bg-blue-600'></section>
          <section className='flex justify-center items-center'>
            <form className='flex flex-col w-[400px] space-y-4' onSubmit={handleRegister}>
                <Input name="name" type="text" placeholder='Fullname' />
                <Input name="email" type="email" placeholder='Email' />
                <Input name="password" type="password" placeholder='Password' />
                <Button type="submit">Register</Button>
            </form>
          </section>
        </main>
    </>
  )
}
