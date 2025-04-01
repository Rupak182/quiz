import { flashCardSchema, flashCardsSchema, learnQuestionSchema, learnQuestionsSchema } from "@/lib/schemas";
import { google } from "@ai-sdk/google";
import { streamObject } from "ai";

export const maxDuration = 60;

export async function POST(req: Request) {
  const { files } = await req.json();
  const firstFile = files[0].data;

  const result = streamObject({
    model: google("gemini-2.0-flash-exp"),
    messages: [
      {
        role: "system",
        content:
          "You are a teacher. Your job is to take a document, and create 5 flashcards based on the content of the document.(Make the question and  answer short and concise) ",
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Create flashcards based on this document.",
          },
          {
            type: "file",
            data: firstFile,
            mimeType: "application/pdf",
          },
        ],
      },
    ],
    schema: flashCardSchema,
    output: "array",
    onFinish: ({ object }) => {
      const res = flashCardsSchema.safeParse(object);
      if (res.error) {
        throw new Error(res.error.errors.map((e) => e.message).join("\n"));
      }
    },
  });

  return result.toTextStreamResponse();
}
