"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { StarIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface ClientFeedbackProps {
  projectId: string
  projectTitle?: string
  contractorId?: string
  contractorName?: string
  onSubmit?: (data: any) => void
  onFeedbackSubmitted?: (data: { rating: number; comments: string }) => void
}

export function ClientFeedback({
  projectId,
  projectTitle,
  contractorId,
  contractorName,
  onSubmit,
  onFeedbackSubmitted,
}: ClientFeedbackProps) {
  const [rating, setRating] = useState<number>(0)
  const [feedback, setFeedback] = useState<string>("")
  const [submitted, setSubmitted] = useState<boolean>(false)

  const handleRatingChange = (newRating: number) => {
    setRating(newRating)
  }

  const handleSubmit = () => {
    if (rating === 0) return

    const feedbackData = {
      projectId,
      projectTitle,
      contractorId,
      contractorName,
      rating,
      feedback,
      comments: feedback, // Add comments alias for compatibility
      submittedAt: new Date(),
    }

    // Call both callback functions for compatibility
    if (onSubmit) {
      onSubmit(feedbackData)
    }

    if (onFeedbackSubmitted) {
      onFeedbackSubmitted({
        rating,
        comments: feedback,
      })
    }

    setSubmitted(true)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Feedback</CardTitle>
        <CardDescription>
          {projectTitle
            ? `Share your experience with the project: ${projectTitle}`
            : "Share your experience with this project"}
          {contractorName && (
            <span className="block text-sm mt-1">
              Contractor: <span className="font-medium">{contractorName}</span>
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {submitted ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="rounded-full bg-green-100 p-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6 text-green-600"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-medium">Thank You for Your Feedback!</h3>
            <p className="mt-2 text-sm text-muted-foreground">Your feedback helps us improve our services.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>How would you rate your experience?</Label>
              <div className="flex items-center justify-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRatingChange(star)}
                    className="rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <StarIcon
                      className={cn(
                        "h-8 w-8",
                        rating >= star ? "fill-yellow-400 text-yellow-400" : "fill-none text-muted-foreground",
                      )}
                    />
                    <span className="sr-only">{star} stars</span>
                  </button>
                ))}
              </div>
              {rating > 0 && (
                <p className="text-center text-sm text-muted-foreground">
                  {rating === 1
                    ? "Poor"
                    : rating === 2
                      ? "Fair"
                      : rating === 3
                        ? "Good"
                        : rating === 4
                          ? "Very Good"
                          : "Excellent"}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="feedback">Additional Comments</Label>
              <Textarea
                id="feedback"
                placeholder="Share your thoughts about the project..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="min-h-[120px]"
              />
            </div>
          </div>
        )}
      </CardContent>
      {!submitted && (
        <CardFooter>
          <Button onClick={handleSubmit} disabled={rating === 0} className="w-full">
            Submit Feedback
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
