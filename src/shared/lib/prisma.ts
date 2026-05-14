import { createServerOnlyFn } from "@tanstack/react-start";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "#/generated/client";

const getConnectionString = createServerOnlyFn(() => {
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
        throw new Error("DATABASE_URL environment variable is not set");
    }
    return connectionString;
})

const connectionString = getConnectionString();
const adapter = new PrismaPg(connectionString);
export const prisma = new PrismaClient({ adapter });