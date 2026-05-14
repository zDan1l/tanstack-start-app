import OpenAI from "openai";

export const openAiClient = new OpenAI({
    baseURL : process.env.OPENAI_BASE_URL,
    apiKey : process.env.OPENAI_API_KEY,
})