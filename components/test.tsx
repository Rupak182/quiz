// components/test.tsx
import { useState } from "react";
import { testQuestionsSchema } from "@/lib/schemas";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Check, RefreshCw, X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { data } from "@/lib/data";
import { useEffect } from "react";

type TestProps = {
  questions: z.infer<typeof testQuestionsSchema>;
  title: string;
  clearPDF: () => void;
};

export default function Test({ questions, title, clearPDF }: TestProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>(Array(questions.length).fill(""));
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [progress, setProgress] = useState(0);

  const handleAnswerSelect = (questionIndex: number, answer: string) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[questionIndex] = answer;
    setSelectedAnswers(newAnswers);
  };

  const handleSubmit = () => {
    const correctAnswers = questions.map(q => q.answer);
    const newScore = selectedAnswers.reduce((acc, answer, index) => {
      return acc + (answer === correctAnswers[index] ? 1 : 0);
    }, 0);
    setScore(newScore);
    setIsSubmitted(true);
  };

  const allQuestionsAnswered = selectedAnswers.every(answer => answer !== "");

  useEffect(() => {
    console.log(selectedAnswers)
    const pval = (selectedAnswers.filter(a => a !== "").length / questions.length) * 100;
    setProgress(pval);
  }, [selectedAnswers])

  const handleReset = () => {
    setSelectedAnswers(Array(questions.length).fill(""));
    setIsSubmitted(false);
    setScore(0);
    setProgress(0);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">{title}</CardTitle>
          <Progress value={progress} className="w-full mt-4" />
          <p className="text-center text-muted-foreground mt-2">
            {selectedAnswers.filter(a => a !== "").length} of {questions.length} questions answered
          </p>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[60vh] pr-4">
            {questions.map((question, index) => (
              <Card key={index} className={`mb-6 ${isSubmitted ? (selectedAnswers[index] === question.answer ? 'border-green-500' : 'border-red-500') : ''}`}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                      {index + 1}
                    </span>
                    <div className="flex-1">
                      <h3 className="font-medium mb-4">{question.question}</h3>
                      <RadioGroup
                        value={selectedAnswers[index]}
                        onValueChange={(value) => handleAnswerSelect(index, value)}
                        disabled={isSubmitted}
                      >
                        {question.options.map((option, optionIndex) => (
                          <div key={optionIndex} className="flex items-center space-x-2 mb-2">
                            <RadioGroupItem
                              value={["A", "B", "C", "D"][optionIndex]}
                              id={`q${index}-${optionIndex}`}
                            />
                            <Label htmlFor={`q${index}-${optionIndex}`} className="flex-1">
                              {option}
                            </Label>
                            {isSubmitted && (
                              <span className="ml-2">
                                {["A", "B", "C", "D"][optionIndex] === question.answer && (
                                  <Check className="h-5 w-5 text-green-500" />
                                )}
                              </span>
                            )}
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </ScrollArea>
        </CardContent>
        <CardFooter className="flex flex-col items-center gap-4 w-full">
          {isSubmitted ? (
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-2">Your Score: {score} / {questions.length}</h3>
              <p className="text-muted-foreground mb-4">
                {score === questions.length ? "Perfect score! 🎉" :
                  score >= questions.length * 0.7 ? "Great job! 👏" :
                    score >= questions.length * 0.5 ? "Good effort! 💪" :
                      "Keep practicing! 📚"}
              </p>

              <div className="flex justify-between w-full items-center gap-2">
              <Button
                        onClick={handleReset}
                        variant="outline"
                        className="bg-muted hover:bg-muted/80 "
                      >
                        <RefreshCw className="mr-2 h-8 w-4" /> Reset Quiz
                      </Button>
                      <Button
                        onClick={clearPDF}
                        className="bg-primary hover:bg-primary/90 "
                      >
                        Try Other Questions
                        </Button>
              </div>
                         
            </div>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!allQuestionsAnswered}
              className="w-full max-w-xs"
            >
              Submit Answers
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}