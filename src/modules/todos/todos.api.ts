import { dbmiddleware } from "#/shared/middleware/dbmiddleware";
import { createServerFn } from "@tanstack/react-start";
import { createTodoSchema } from "./todo.schema";
import { authMiddleware } from "../auth/auth.middleware";
import { redirect } from "@tanstack/react-router";

export const getTodosServerFn = createServerFn().middleware([ dbmiddleware ])
.handler(async ({context}) => {
    return context.db.todo.findMany({
        include: {
            category: true,
            author: true
        }
    });
})

export const createTodoServerFn = createServerFn({method: "POST"})
.middleware([ dbmiddleware, authMiddleware ])
.inputValidator(createTodoSchema)
.handler(async ({context, data}) => {
    await context.db.todo.create({
        data : {
            title : data.title,
            content : data.content,
            author : {
                connect : {
                    id : context.session.id
                }
            },
            category : {
                connect : { 
                    id : data.categoryId
                }
            }
        }
    })
    
    // redirect
    throw redirect({
      to: "/dashboard/todos",
      search: {
        success: "Todo created successfully",
      },
    });
})

