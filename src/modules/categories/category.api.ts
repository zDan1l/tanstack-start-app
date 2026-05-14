import { dbmiddleware } from "#/shared/middleware/dbmiddleware";
import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "../auth/auth.middleware";
import { createCategorySchema, deleteCategorySchema, getCategoryByIdSchema, updateCategorySchema } from "./category.schema";
import { redirect } from "@tanstack/react-router";


export const getCategoriesServerFn = createServerFn().middleware([ dbmiddleware ])
.handler(async ({context}) => {
    try {
        const categories = await context.db.category.findMany();
        return categories;
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        throw new Error(`Failed to fetch categories: ${message}`);
    }
})

export const getCategoryByIdServerFn = createServerFn()
.middleware([dbmiddleware])
.inputValidator(getCategoryByIdSchema)
.handler(async ({context, data}) => {
    try {
        const category = await context.db.category.findFirst({
            where : {
                id : data.id
            }
        })
        if(!category){
            throw new Error("Category not found")
        }
        return category;
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        throw new Error(`Failed to fetch category: ${message}`)
    }
})


export const createCategoryServerFn = createServerFn({ method: "POST" })
.middleware([ dbmiddleware, authMiddleware ])
.inputValidator(createCategorySchema)
.handler(async ({context, data }) => {
    try {
        const existing = await context.db.category.findFirst({
            where : {
                name : data.name
            }
        })
        if(existing){
            throw new Error("Category already exist")
        }
        await context.db.category.create({
            data : {
                name : data.name
            }
        })
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        throw new Error(`${message}`);
    }

    throw redirect({
      to: "/dashboard/category",
      search: {
        success : "Category created successfully"
      }
    });
})

export const updateCategoryServerFn = createServerFn({ method: "POST" })
.middleware([ dbmiddleware, authMiddleware ])
.inputValidator(updateCategorySchema)
.handler(async ({ context, data }) => {
    try {
        await context.db.category.update({
            where : {
                id : data.id
            },
            data : {
                name : data.name
            }
        })
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        throw new Error(`Failed to update categories: ${message}`);
    }

    throw redirect({
      to: "/dashboard/category",
      search: {
        success: "Category updated successfully",
      },
    });
})


export const deleteCategoryServerFn = createServerFn({ method: "POST" })
.middleware([ dbmiddleware, authMiddleware ])
.inputValidator(deleteCategorySchema)
.handler(async ({ context, data }) => {
    try {
        await context.db.category.delete({
            where : {
                id : data.id
            }
        })
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        throw new Error(`Failed to delete categories: ${message}`);
    }

    throw redirect({
      to: "/dashboard/category",
      search: {
        success: "Category deleted successfully",
      },
    });
})
