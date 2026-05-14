import { dbmiddleware } from "#/shared/middleware/dbmiddleware";
import { createServerFn } from "@tanstack/react-start";
import { LoginSchema, RegisterSchema } from "./auth.schema";
import bcrypt from "bcryptjs";
import { useAuthSession } from "./auth.session";
import { redirect } from "@tanstack/react-router";

export const registerServerFn = createServerFn({ method : "POST" })
    .middleware([dbmiddleware])
    .inputValidator(RegisterSchema)
    .handler(async({ context, data }) => {
        const hashedPassword = await bcrypt.hash(data.password, 10);
        await context.db.user.create({
            data : {
                name : data.name,
                email : data.email,
                password : hashedPassword
            }
        })
        throw redirect({
            to : "/login",
            search : {
                success : "Registration successful, please login to continue"
            }
        })
    })

export const logoutServerFn = createServerFn()
    .handler(async () => {
        const session = await useAuthSession();
        session.clear();
        throw redirect ({ to: '/' })
    })


export const loginServerFn = createServerFn({ method : "POST" })
    .middleware([dbmiddleware])
    .inputValidator(LoginSchema)
    .handler(async({context, data}) => {
        const existingUser = await context.db.user.findUnique({
            where : {
                email : data.email
            }
        })

        if(!existingUser){
            throw new Error("User not found");
        }

        const isPasswordValid = await bcrypt.compare(data.password, existingUser.password);

        if(!isPasswordValid){
            throw new Error("Email or password is incorrect");
        }

        const session = await useAuthSession();
        await session.update({
            id: existingUser.id,
            name: existingUser.name,
            email: existingUser.email,
        })

        // redirect
        throw redirect({
            to : "/dashboard",
            search : {
                success : "Login successful, welcome back!"
            }
        })

    })  

export const getCurrentSession = createServerFn()
    .handler(async() => {
        const session = await useAuthSession();
        return session.data;
    })