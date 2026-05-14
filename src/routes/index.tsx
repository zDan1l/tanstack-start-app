import { createFileRoute } from '@tanstack/react-router'
import { Input, Button } from '@heroui/react'
import { loginServerFn } from '#/modules/auth/auth.api';
import { useServerFn } from '@tanstack/react-start';
import { createStoryServerFn } from '#/modules/stories/story.api';
import { useState } from 'react';
import { is } from 'zod/v4/locales';
import { set } from 'zod';

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  // wrapper login server function
  const [result, resultState] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  async function handleLogin(event: React.SubmitEvent<HTMLFormElement>) {
    setIsLoading(true);
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const title = formData.get("title") as string;

    const result = await createStoryServerFn({
      data : {
        title : title
      }
    });

    resultState(result || "");
    setIsLoading(false);
  }
  return (
    <>
        <main className='grid grid-cols-2 h-screen'>
          <section className='bg-blue-100 whitespace-pre-line p-8'>{result}</section>
          <section className='flex justify-center items-center'>
            <form className='flex flex-col w-[400px] space-y-4' onSubmit={handleLogin}>
                <Input name="title" type="text" placeholder='title' />
                <Button isDisabled={isLoading} type="submit">
                    {isLoading ? "Creating..." : "Create a story"}
                </Button>
                <a href="/login" className='px-4 py-2 bg-blue-400 text-white rounded-full inline w-auto'>Login</a>
            </form>
          </section>
        </main>
    </>
  )
}
