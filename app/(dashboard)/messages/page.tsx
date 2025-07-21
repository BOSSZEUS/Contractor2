"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send } from "lucide-react"
import { useState, useEffect } from "react"

export default function MessagesPage() {
  const [activeConversationId, setActiveConversationId] = useState("1")
  const [messageInput, setMessageInput] = useState("")

  // Handle URL query parameters for direct linking
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const conversationId = params.get("conversation")
    if (conversationId) {
      setActiveConversationId(conversationId)
    }
  }, [])

  // Mock conversation data
  const conversations = [
    {
      id: "1",
      name: "Sarah Johnson",
      avatar: "/placeholder.svg",
      lastMessage: "Can we discuss the kitchen cabinets tomorrow?",
      time: "2h ago",
      unread: true,
    },
    {
      id: "2",
      name: "Michael Smith",
      avatar: "/placeholder.svg",
      lastMessage: "I've approved the bathroom tile work. Great job!",
      time: "Yesterday",
      unread: false,
    },
    {
      id: "3",
      name: "Emily Davis",
      avatar: "/placeholder.svg",
      lastMessage: "When will the deck be finished?",
      time: "2 days ago",
      unread: false,
    },
  ]

  // Mock messages for conversations
  const conversationMessages: Record<
    string,
    { id: string; sender: string; content: string; time: string; isMe: boolean }[]
  > = {
    "1": [
      {
        id: "1",
        sender: "Sarah Johnson",
        content: "Hi there! I was wondering about the kitchen renovation timeline.",
        time: "10:30 AM",
        isMe: false,
      },
      {
        id: "2",
        sender: "Me",
        content: "Hello Sarah! We're on track to complete the kitchen by July 15th as planned.",
        time: "10:32 AM",
        isMe: true,
      },
      {
        id: "3",
        sender: "Sarah Johnson",
        content: "That's great news! Can we discuss the cabinet installation tomorrow?",
        time: "10:35 AM",
        isMe: false,
      },
      {
        id: "4",
        sender: "Me",
        content: "I'm available anytime after 2 PM. Would that work for you?",
        time: "10:36 AM",
        isMe: true,
      },
      {
        id: "5",
        sender: "Sarah Johnson",
        content: "Perfect! Let's plan for 3 PM then. I'll be at the house.",
        time: "10:40 AM",
        isMe: false,
      },
    ],
    "2": [
      {
        id: "1",
        sender: "Michael Smith",
        content: "The bathroom tiles look fantastic!",
        time: "Yesterday",
        isMe: false,
      },
      {
        id: "2",
        sender: "Me",
        content: "Thank you! We used the premium porcelain tiles you selected.",
        time: "Yesterday",
        isMe: true,
      },
      {
        id: "3",
        sender: "Michael Smith",
        content: "I've approved the final payment for the bathroom work.",
        time: "Yesterday",
        isMe: false,
      },
    ],
    "3": [
      {
        id: "1",
        sender: "Emily Davis",
        content: "When will the deck be finished?",
        time: "2 days ago",
        isMe: false,
      },
      {
        id: "2",
        sender: "Me",
        content: "We're expecting to complete it by next Friday, weather permitting.",
        time: "2 days ago",
        isMe: true,
      },
      {
        id: "3",
        sender: "Emily Davis",
        content: "That works for me. Will you need any additional materials?",
        time: "2 days ago",
        isMe: false,
      },
      {
        id: "4",
        sender: "Me",
        content: "We have everything we need. The special order railing arrived yesterday.",
        time: "2 days ago",
        isMe: true,
      },
    ],
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Messages</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1 min-h-0">
        <Card className="md:col-span-1 flex flex-col">
          <CardHeader>
            <CardTitle>Conversations</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto p-0">
            <div className="divide-y">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`flex items-center gap-3 p-3 hover:bg-muted cursor-pointer ${
                    conversation.id === activeConversationId ? "bg-muted" : ""
                  }`}
                  onClick={() => setActiveConversationId(conversation.id)}
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={conversation.avatar} alt={conversation.name} />
                    <AvatarFallback>{conversation.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <p className="font-medium truncate">{conversation.name}</p>
                      <span className="text-xs text-muted-foreground">{conversation.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage}</p>
                  </div>
                  {conversation.unread && <div className="h-2 w-2 rounded-full bg-primary"></div>}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 flex flex-col">
          <CardHeader className="border-b">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={conversations.find((c) => c.id === activeConversationId)?.avatar || "/placeholder.svg"}
                  alt={conversations.find((c) => c.id === activeConversationId)?.name || "User"}
                />
                <AvatarFallback>
                  {conversations.find((c) => c.id === activeConversationId)?.name.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>{conversations.find((c) => c.id === activeConversationId)?.name || "User"}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {activeConversationId === "1"
                    ? "Kitchen Renovation Project"
                    : activeConversationId === "2"
                      ? "Bathroom Remodel Project"
                      : "Deck Construction Project"}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto p-4 space-y-4">
            {(conversationMessages[activeConversationId] ?? []).map((message) => (
              <div key={message.id} className={`flex ${message.isMe ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.isMe ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className="text-xs mt-1 opacity-70">{message.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                placeholder="Type your message..."
                className="flex-1"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && messageInput.trim()) {
                    // Handle message sending logic here
                    setMessageInput("")
                  }
                }}
              />
              <Button
                size="icon"
                onClick={() => {
                  if (messageInput.trim()) {
                    // Handle message sending logic here
                    setMessageInput("")
                  }
                }}
              >
                <Send className="h-4 w-4" />
                <span className="sr-only">Send message</span>
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
