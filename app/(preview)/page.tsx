"use client"
import { data } from "@/lib/data";

const options = [
  {
    label: "Learn",
    handler: "handleLearnClick",
  },
  {
    label: "Test",
    handler: "handleTestClick",
  },

  {
    label: "FlashCards",
    handler: "handleFlashClick",
  }
];



import { useEffect, useState } from "react";
import { experimental_useObject } from "@ai-sdk/react";
import { flashCardSchema, flashCardsSchema, learnQuestionsSchema, testQuestionsSchema } from "@/lib/schemas";
import { z } from "zod";
import { toast } from "sonner";
import { FileUp, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Link } from "@/components/ui/link";
import NextLink from "next/link";
import { generateQuizTitle } from "./actions";
import { AnimatePresence, motion } from "framer-motion";
import { VercelIcon, GitIcon } from "@/components/icons";
import { useRouter } from "next/navigation";
import Quiz from "@/components/quiz";
import Test from "@/components/test";
import Flash from "@/components/Flash";

export default function PDFQuizGenerator() {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [title, setTitle] = useState<string>();
  const [quizType,setQuizType] = useState<string>();
  const [learnQuestion, setLearnQuestion] = useState<z.infer<typeof learnQuestionsSchema> >([]);
  const [testQuestion, setTestQuestion] = useState<z.infer<typeof testQuestionsSchema> >([]);
  const [flashCard, setFlashCard] = useState<z.infer<typeof flashCardsSchema> >([]);

  const {
    submit,
    object: partialQuestions,
    isLoading,
  } = experimental_useObject({
    api: quizType === "test" ? "/api/generate-test" : quizType === "flash" ? "/api/generate-flash-cards" : "/api/generate-quiz",
    schema: quizType === "test" ? testQuestionsSchema : quizType === "flash" ? flashCardsSchema : learnQuestionsSchema,
    initialValue: undefined,
    onError: (error: Error) => {
      toast.error("Failed to generate quiz. Please try again.");
      setFiles([]);
    },
    onFinish: ({ object }: { object: any}) => {
      // Handle the generated questions here
      console.log(object);
      if (object) {
        if (quizType === "learn") {
          setLearnQuestion(object);
        } else if (quizType === "test") {
          setTestQuestion(object);
        }
        else if(quizType==="flash"){
          setFlashCard(object);
        }
      }
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    if (isSafari && isDragging) {
      toast.error(
        "Safari does not support drag & drop. Please use the file picker.",
      );
      return;
    }

    const selectedFiles = Array.from(e.target.files || []);
    const validFiles = selectedFiles.filter(
      (file) => file.type === "application/pdf" && file.size <= 5 * 1024 * 1024,
    );

    if (validFiles.length !== selectedFiles.length) {
      toast.error("Only PDF files under 5MB are allowed.");
    }

    setFiles(validFiles);
  };

  const encodeFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmitWithFiles = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const encodedFiles = await Promise.all(
      files.map(async (file) => ({
        name: file.name,
        type: file.type,
        data: await encodeFileAsBase64(file),
      })),
    );
    submit({ files: encodedFiles });
    const generatedTitle = await generateQuizTitle(encodedFiles[0].name);
    setTitle(generatedTitle);
  };

  useEffect(() => {
    if (quizType && files.length > 0) {
      const handleSubmit = async () => {
        const encodedFiles = await Promise.all(
          files.map(async (file) => ({
            name: file.name,
            type: file.type,
            data: await encodeFileAsBase64(file),
          })),
        );
        console.log(quizType)
        submit({ files: encodedFiles });
        const generatedTitle = await generateQuizTitle(encodedFiles[0].name);
        setTitle(generatedTitle);
      };
  
      handleSubmit();
    }
  }, [quizType,files,submit]); // Trigger when quizType changes
  
  const handleTestClick = async () => {
    if (files.length === 0) return;
    setQuizType("test"); // This will trigger the useEffect
  };

  const handleLearnClick = async () => {
    if (files.length === 0) return;
    setQuizType("learn"); // This will trigger the useEffect
  };

  const handleFlashClick = async () => {
    if (files.length === 0) return;
    setQuizType("flash"); // This will trigger the useEffect
  };

  const clearPDF = () => {
    setFiles([]);
    if (quizType === "learn") {
      setLearnQuestion([]);
    } else if (quizType === "test") {
      setTestQuestion([]);
    }else if(quizType === "flash"){
      setFlashCard([]);
    }
  };

  const progress = partialQuestions ? (partialQuestions.length / 4) * 100 : 0;

  const router = useRouter();

  if (learnQuestion.length === 4 && quizType === "learn") {
    return (
      <Quiz title={title ?? "Quiz"} questions={learnQuestion} clearPDF={clearPDF}  />
    );
  }

  if (testQuestion.length === 10 && quizType === "test") {
    return (
      <Test title={title ?? "Quiz"} questions={testQuestion} clearPDF={clearPDF}  />
    );
  }

  if (flashCard.length === 5 && quizType === "flash") {
    return (
      <Flash title={title ?? "Quiz"} flashCards={flashCard} clearPDF={clearPDF}  />
    );
  }

  // return <Test title={title ?? "Quiz"} questions={data} clearPDF={clearPDF}  />
  // return <Flash title={title ?? "Quiz"} flashCards={data} clearPDF={clearPDF}  />
  const handlers = {
    handleLearnClick,
    handleTestClick,
    handleFlashClick,
  };


  return (
    <div className="min-h-[100dvh] w-full flex justify-center flex-col" >
      <div className=" w-screen flex flex-col items-center justify-center">
        <h1 className="text-6xl font-bold mt-7">Quizzy</h1>
        <div className="w-full  mt-7 flex items-center justify-center font-bold">
                {isLoading && files.length > 0 && quizType ? (
                  <span className="flex items-center gap-3">
                    <Loader2 className="h-4 w-4 animate-spin " />
                    <span>Generating Quiz...</span>
                  </span>
                ) : (
                  "Upload a document to generate a quiz"
                )}
        </div>
        
        <div className="flex mt-12 gap-4">
          {
           options.map((option) => (
            <Button
              variant="secondary"
              key={option.label}
              disabled={files.length ===  0} 
              onClick={() => handlers[option.handler as keyof typeof handlers]()}            >
              {option.label}
            </Button>
          ))
          
          }
        </div>
      </div>
      <div
        className="min-h-[100dvh] w-full flex justify-center"
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragExit={() => setIsDragging(false)}
        onDragEnd={() => setIsDragging(false)}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFileChange({
            target: { files: e.dataTransfer.files },
          } as React.ChangeEvent<HTMLInputElement>);
        }}
      >
        <AnimatePresence>
          {isDragging && (
            <motion.div
              className="fixed pointer-events-none dark:bg-zinc-900/90 h-dvh w-dvw z-10 justify-center items-center flex flex-col gap-1 bg-zinc-100/90"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div>Drag and drop files here</div>
              <div className="text-sm dark:text-zinc-400 text-zinc-500">
                {"(PDFs only)"}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <Card className="w-full max-w-md h-full border-0 sm:border sm:h-fit mt-12">
          <CardHeader className="text-center space-y-6">
            <div className="mx-auto flex items-center justify-center space-x-2 text-muted-foreground">
              <div className="rounded-full bg-primary/10 p-2">
                <FileUp className="h-6 w-6" />
              </div>
              <Plus className="h-4 w-4" />
              <div className="rounded-full bg-primary/10 p-2">
                <Loader2 className="h-6 w-6" />
              </div>
            </div>
            <div className="space-y-2">
              <CardTitle className="text-2xl font-bold">
                PDF Quiz Generator
              </CardTitle>
              <CardDescription className="text-base">
                Upload a PDF to generate an interactive quiz based on its content
                using the <Link href="https://sdk.vercel.ai">AI SDK</Link> and{" "}
                <Link href="https://sdk.vercel.ai/providers/ai-sdk-providers/google-generative-ai">
                  Google&apos;s Gemini Pro
                </Link>
                .
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitWithFiles} className="space-y-4">
              <div
                className={`relative flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 transition-colors hover:border-muted-foreground/50`}
              >
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept="application/pdf"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <FileUp className="h-8 w-8 mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground text-center">
                  {files.length > 0 ? (
                    <span className="font-medium text-foreground">
                      {files[0].name}
                    </span>
                  ) : (
                    <span>Drop your PDF here or click to browse.</span>
                  )}
                </p>
              </div>
              
            </form>
          </CardContent>
        </Card>

      </div>
      
    </div>
  );
}

