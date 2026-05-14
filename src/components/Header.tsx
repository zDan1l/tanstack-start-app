import { logoutServerFn } from '#/modules/auth/auth.api';
import { Button } from '@heroui/react'
import { useServerFn } from '@tanstack/react-start';
 
export function Header()  {
    const logoutHandler = useServerFn(logoutServerFn)
    return (
      <header className="bg-blue-600 flex justify-between items-center text-white p-4">
        <h2 className="text-lg font-semibold">Dashboard</h2>
        <Button onClick={() => logoutHandler()}>Logout</Button>
      </header>
    );
}
