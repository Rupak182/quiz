

import { flashCardsSchema, testQuestionsSchema } from "@/lib/schemas";
import { z } from "zod";

export const data: z.infer<typeof flashCardsSchema> = [
    {
      question: "What is ChatGPT?",
      answer: "A language model that allows people to interact with a computer in a more natural and conversational way."
    },
    {
      question: "What does GPT stand for?",
      answer: "Generative Pre-trained Transformer."
    },
    {
      question: "What technology does ChatGPT use to learn from internet data?",
      answer: "Natural language processing."
    },
    {
      question: "Why should prompts be specific when using ChatGPT?",
      answer: "To produce a more relevant result."
    },
    {
      question: "What are some challenges and ethical implications of AI in higher education?",
      answer: "Academic integrity, lack of regulation, privacy concerns, cognitive bias, gender and diversity, accessibility, and commercialization."
    },
    {
      question: "What are some applications of ChatGPT in higher education?",
      answer: "Teaching and learning, research, administration, and community engagement."
    },
    {
      question: "What provides a foundation for AI systems to work for the betterment of individuals, societies, and ecosystems?",
      answer: "The UNESCO Recommendation on the Ethics of AI."
    },
    {
      question: "What is one of the goals of the UNESCO Recommendation on the Ethics of AI?",
      answer: "To prevent harm from or by AI."
    },
    {
      question: "What are the stages of an AI audit in higher education?",
      answer: "Conduct an AI audit, decide which AI to use, and monitor performance and equity."
    }
  ];



export const data2: z.infer<typeof testQuestionsSchema> = [
    {
        "question": "What is ChatGPT?",
        "options": [
            "An AI chatbot",
            "A type of search engine",
            "A social media platform",
            "A video game"
        ],
        "answer": "A"
    },
    {
        "question": "Who developed ChatGPT?",
        "options": [
            "UNESCO",
            "OpenAI",
            "Google",
            "Microsoft"
        ],
        "answer": "B"
    },
    {
        "question": "What does GPT stand for in ChatGPT?",
        "options": [
            "Transformative Learning",
            "Generative Pre-trained Transformer",
            "General Purpose Technology",
            "Global Positioning Tracking"
        ],
        "answer": "C"
    },
    {
        "question": "In what year was the Quick Start Guide about ChatGPT published?",
        "options": [
            "2020",
            "2021",
            "2022",
            "2023"
        ],
        "answer": "D"
    },
    {
        "question": "When was the Quick Start Guide about ChatGPT published?",
        "options": [
            "April 2023",
            "December 2022",
            "August 2022",
            "March 2023"
        ],
        "answer": "A"
    },
    {
        "question": "How much data was used to train ChatGPT?",
        "options": [
            "50 GB",
            "570 GB",
            "1 TB",
            "10 TB"
        ],
        "answer": "B"
    },
    {
        "question": "How many users did ChatGPT reach two months after launch?",
        "options": [
            "100 million",
            "50 million",
            "10 million",
            "1 million"
        ],
        "answer": "C"
    },
    {
        "question": "What are some of the ethical challenges of using AI in higher education mentioned in the document?",
        "options": [
            "Academic Integrity",
            "Lack of Regulation",
            "Privacy Concerns",
            "All of the above"
        ],
        "answer": "D"
    },
    {
        "question": "Can ChatGPT verify the information it provides?",
        "options": [
            "True",
            "False",
            "It depends",
            "Not mentioned in the document"
        ],
        "answer": "A"
    },
    {
        "question": "What is Sustainable Development Goal 4?",
        "options": [
            "Transformative Learning",
            "Quality Education",
            "Lifelong Learning",
            "Inclusive and Equitable Education"
        ],
        "answer": "B"
    }
]