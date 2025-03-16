// components/Flash.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Check, ChevronLeft, ChevronRight, RefreshCw, RotateCw } from "lucide-react";
import { flashCardsSchema } from "@/lib/schemas";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";

export default function Flash({ title, flashCards, clearPDF }: {
    title: string,
    flashCards: z.infer<typeof flashCardsSchema>,
    clearPDF: () => void
}) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);

    const handleNext = () => {
        if (currentIndex < flashCards.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setIsFlipped(false);
        } else {
            setIsCompleted(true);
        }
    };

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            setIsFlipped(false);
        }
    };

    const handleFlip = () => {
        setIsFlipped(!isFlipped);
    };

    const handleReset = () => {
        setCurrentIndex(0);
        setIsFlipped(false);
        setIsCompleted(false);
    }

    if (isCompleted) {
        return (
            <div className="w-full  flex h-[80vh] items-center justify-center">
                <Card className="w-full max-w-4xl m-auto">
                    <CardHeader>
                        <CardTitle className="text-3xl font-bold text-center">Quiz Completed!</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center gap-4">
                        <Check className="h-16 w-16 text-green-500" />
                        <p className="text-muted-foreground">You&apos;ve completed all the flash cards.</p>
                    </CardContent>
                    <CardFooter className="flex justify-between ">
                        <Button
                            onClick={handleReset}
                            variant="outline"
                            className="bg-muted hover:bg-muted/80 "
                        >
                            <RefreshCw className="mr-2 h-4 w-4" /> Reset Quiz
                        </Button>
                        <Button
                            onClick={clearPDF}
                            className="bg-primary hover:bg-primary/90 "
                        >
                            Try Other Questions
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    return (
        <div className="w-full  flex h-[80vh] items-center justify-center">
            <Card className="w-full max-w-4xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold text-center">{title}</CardTitle>
                    <p className="text-center text-muted-foreground">
                        Card {currentIndex + 1} of {flashCards.length}
                    </p>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-6">
                    <motion.div
                        className="w-full max-w-2xl p-8 border rounded-lg cursor-pointer"
                        onClick={handleFlip}
                        animate={{ rotateY: isFlipped ? 180 : 0 }}
                        transition={{ duration: 0.5 }}
                        style={{ transformStyle: "preserve-3d" }}
                    >
                        <motion.div
                            className="w-full h-full flex items-center justify-center"
                            style={{ backfaceVisibility: "hidden" }}
                        >
                            <h3 className="text-2xl font-medium text-center">
                                {flashCards[currentIndex].question}
                            </h3>
                        </motion.div>
                        <motion.div
                            className="w-full h-full flex items-center justify-center absolute top-0 left-0"
                            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                        >
                            <p className="text-xl text-muted-foreground text-center">
                                {flashCards[currentIndex].answer}
                            </p>
                        </motion.div>
                    </motion.div>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={handlePrevious} disabled={currentIndex === 0}>
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Previous
                    </Button>
                    <Button variant="ghost" onClick={handleFlip}>
                        <RotateCw className="mr-2 h-4 w-4" />
                        Flip Card
                    </Button>
                    <Button onClick={handleNext}>
                        {currentIndex === flashCards.length - 1 ? "Finish" : "Next"}
                        <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                </CardFooter>
            </Card>
        </div>

    );
}