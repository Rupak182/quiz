import { z } from "zod";

export const learnQuestionSchema = z.object({
  question: z.string(),
  options: z
    .array(z.string())
    .length(4)
    .describe(
      "Four possible answers to the question. Only one should be correct. They should all be of equal lengths.",
    ),
  answer: z
    .enum(["A", "B", "C", "D"])
    .describe(
      "The correct answer, where A is the first option, B is the second, and so on.",
    ),
});

export type LearnQuestion = z.infer<typeof learnQuestionSchema>;

export const learnQuestionsSchema = z.array(learnQuestionSchema).length(4);
export const testQuestionsSchema = z.array(learnQuestionSchema).length(10);

export const testQuestionSchema =learnQuestionSchema



export const flashCardSchema = z.object({
  question: z.string().describe("The question that is provided for flashcard"),
  answer: z.string().describe("The answer or definition"),
});

export type FlashCard = z.infer<typeof flashCardSchema>;

export const flashCardsSchema = z.array(flashCardSchema).length(5);