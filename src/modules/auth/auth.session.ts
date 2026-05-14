import { createServerOnlyFn } from "@tanstack/react-start";
import { useSession } from "@tanstack/react-start/server";

const getConnectionString = createServerOnlyFn(() => {
    const sessionPassowrd = process.env.SESSION_PASSWORD;
    if(!sessionPassowrd){
        throw new Error("SESSION_PASSWORD environment variable is not set");
    }

    return sessionPassowrd;
})

const SESSION_PASSWORD = getConnectionString();

interface UseData {
   id : string;
   name?: string | null;
   email: string; 
}


export function useAuthSession() {
    return useSession<UseData>({
        password: SESSION_PASSWORD,
        cookie: {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24 * 7, // 1 week
        }
    });
}