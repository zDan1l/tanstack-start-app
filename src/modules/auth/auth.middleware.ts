import { createMiddleware } from '@tanstack/react-start';
import { useAuthSession } from './auth.session';



export const authMiddleware = createMiddleware({ type: "function" })
    .server(async({ next }) => {
        const session = await useAuthSession();

        if(!session.data.id){
            throw new Error("Unauthorized");
        }

        return next({
            context : {
                session: session.data
            }
        })
    })