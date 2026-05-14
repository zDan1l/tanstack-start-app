import { createServerFn } from "@tanstack/react-start";
import { createStorySchema } from "./story.schema";
import { openAiClient } from "#/shared/lib/openai";


export const createStoryServerFn = createServerFn({ method: "POST" })
    .inputValidator(createStorySchema)    
    .handler(async ({ data }) => {
        const res = await openAiClient.chat.completions.create({
          messages: [
            {
              role: "system",
              content: "Create a story based on user input",
            },
            { role: "user", content: data.title },
          ],
          model: "openai/gpt-oss-120b:free",
        });

        const content = res.choices[0].message.content;
        return content ;
    })