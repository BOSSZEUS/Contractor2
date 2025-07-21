"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Message {
  id: string
  sender_type: "client" | "contractor"
  sender_name: string
  content: string
  timestamp: string
}

interface QuoteMessagingProps {
  quoteId: string
  userType: "client" | "contractor"
}

export function QuoteMessaging({ quoteId, userType }: QuoteMessagingProps) {
  const { toast } = useToast()
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // Fetch messages on component mount and periodically
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        // Simulate API call to GET /api/quotes/messages/[quote_id]
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Mock messages data
        const mockMessages: Message[] = [
          {
            id: "msg_1",
            sender_type: "contractor",
            sender_name: "ABC Contractors",
            content:
              "Hi! I've submitted a quote for your bathroom remodel. Please let me know if you have any questions about the pricing or timeline.",
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
          },
          {
            id: "msg_2",
            sender_type: "client",
            sender_name: "John Smith",
            content:
              "Thanks for the quote! I noticed you included tile installation. Can you tell me more about the type of tiles you're planning to use?",
            timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
          },
          {
            id: "msg_3",
            sender_type: "contractor",
            sender_name: "ABC Contractors",
            content:
              "Great question! I was planning to use ceramic tiles, but we can upgrade to porcelain or natural stone if you prefer. The pricing would need to be adjusted accordingly.",
            timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
          },
        ]

        setMessages(mockMessages)
        setIsLoading(false)
      } catch (error) {
        console.error("Failed to fetch messages:", error)
        setIsLoading(false)
      }
    }

    fetchMessages()

    // Poll for new messages every 30 seconds
    const interval = setInterval(fetchMessages, 30000)
    return () => clearInterval(interval)
  }, [quoteId])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]")
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }, [messages])

  const sendMessage = async () => {
    if (!newMessage.trim() || isSending) return

    setIsSending(true)
    try {
      const messageData = {
        quote_id: quoteId,
        content: newMessage.trim(),
        sender_type: userType,
      }

      // Simulate API call to POST /api/quotes/messages/send
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Add the new message to the local state
      const newMsg: Message = {
        id: `msg_${Date.now()}`,
        sender_type: userType,
        sender_name: userType === "client" ? "You" : "You",
        content: newMessage.trim(),
        timestamp: new Date().toISOString(),
      }

      setMessages((prev) => [...prev, newMsg])
      setNewMessage("")

      toast({
        title: "Message sent",
        description: "Your message has been sent successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSending(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 1) {
      const minutes = Math.floor(diffInHours * 60)
      return `${minutes}m ago`
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  return (
    <Card className="rounded-2xl shadow-md">
      <CardHeader>
        <CardTitle className="text-lg">Quote Discussion</CardTitle>
        <p className="text-sm text-muted-foreground">
          Communicate directly about this quote with the {userType === "client" ? "contractor" : "client"}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Messages Area */}
        <ScrollArea ref={scrollAreaRef} className="h-64 w-full border rounded-lg p-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">Loading messages...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">No messages yet. Start the conversation!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => {
                const isOwnMessage = message.sender_type === userType
                return (
                  <div key={message.id} className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${
                        isOwnMessage ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium">{isOwnMessage ? "You" : message.sender_name}</span>
                        <span className={`text-xs ${isOwnMessage ? "text-blue-100" : "text-gray-500"}`}>
                          {formatTimestamp(message.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </ScrollArea>

        {/* Message Input */}
        <div className="flex gap-2">
          <Textarea
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 min-h-[60px] resize-none"
            disabled={isSending}
          />
          <Button
            onClick={sendMessage}
            disabled={!newMessage.trim() || isSending}
            size="icon"
            className="h-[60px] w-[60px]"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
