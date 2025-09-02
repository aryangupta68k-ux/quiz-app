"use client"
import { useState, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { ExternalLink, CornerDownLeft } from "lucide-react"
import { ChatBubble, ChatBubbleAvatar, ChatBubbleMessage } from "@/components/ui/chat-bubble"
import { ChatMessageList } from "@/components/ui/chat-message-list"
import { ChatInput } from "@/components/ui/chat-input"

interface Message {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
  hasIRSLink?: boolean
  quickReplies?: string[]
}

interface ConversationState {
  step: "greet" | "residency" | "dependents" | "income" | "filing_status" | "outcome"
  residency?: string
  dependents?: string
  income?: string
  filingStatus?: string
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hi! I'm your IRS Stimulus Assistant. I'll help you check your eligibility with just a few quick questions. Ready to get started?",
      sender: "bot",
      timestamp: new Date(),
      quickReplies: ["Yes, let's start", "Tell me more", "I need help"],
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [conversationState, setConversationState] = useState<ConversationState>({ step: "greet" })

  const generateBotResponse = (
    userMessage: string,
  ): { content: string; hasIRSLink?: boolean; quickReplies?: string[] } => {
    const lowerMessage = userMessage.toLowerCase()

    if (conversationState.step === "greet") {
      setConversationState({ ...conversationState, step: "residency" })
      return {
        content: "Great! First question: Are you a U.S. citizen or resident alien?",
        quickReplies: ["Yes, U.S. citizen", "Yes, resident alien", "No", "Not sure"],
      }
    }

    if (conversationState.step === "residency") {
      let residency = "Unknown"
      if (lowerMessage.includes("citizen") || lowerMessage.includes("yes")) {
        residency = "U.S. citizen"
      } else if (lowerMessage.includes("resident")) {
        residency = "Resident alien"
      } else if (lowerMessage.includes("no")) {
        residency = "Non-resident"
      }

      setConversationState({ ...conversationState, step: "dependents", residency })
      return {
        content: "Thanks! Next: Do you have any dependents (children, qualifying relatives)?",
        quickReplies: ["No dependents", "1 dependent", "2 dependents", "3+ dependents"],
      }
    }

    if (conversationState.step === "dependents") {
      let dependents = "Unknown"
      if (lowerMessage.includes("no") || lowerMessage.includes("0")) {
        dependents = "0"
      } else if (lowerMessage.includes("1")) {
        dependents = "1"
      } else if (lowerMessage.includes("2")) {
        dependents = "2"
      } else if (lowerMessage.includes("3") || lowerMessage.includes("+")) {
        dependents = "3+"
      }

      setConversationState({ ...conversationState, step: "income", dependents })
      return {
        content: "Got it! What's your approximate annual income range?",
        quickReplies: ["Under $75,000", "$75,000 - $150,000", "Over $150,000", "Prefer not to say"],
      }
    }

    if (conversationState.step === "income") {
      let income = "Unknown"
      if (lowerMessage.includes("under") || lowerMessage.includes("75")) {
        income = "Under $75,000"
      } else if (lowerMessage.includes("150") || lowerMessage.includes("-")) {
        income = "$75,000 - $150,000"
      } else if (lowerMessage.includes("over")) {
        income = "Over $150,000"
      } else if (lowerMessage.includes("prefer") || lowerMessage.includes("not")) {
        income = "Prefer not to say"
      }

      const needsFilingStatus = income === "Unknown" || conversationState.residency === "Unknown"

      if (needsFilingStatus) {
        setConversationState({ ...conversationState, step: "filing_status", income })
        return {
          content: "One more question to help determine eligibility: What's your filing status?",
          quickReplies: ["Single", "Married Filing Jointly", "Head of Household", "Other"],
        }
      } else {
        setConversationState({ ...conversationState, step: "outcome", income })
        return generateOutcome({ ...conversationState, income })
      }
    }

    if (conversationState.step === "filing_status") {
      let filingStatus = "Unknown"
      if (lowerMessage.includes("single")) {
        filingStatus = "Single"
      } else if (lowerMessage.includes("married") || lowerMessage.includes("jointly")) {
        filingStatus = "Married Filing Jointly"
      } else if (lowerMessage.includes("head")) {
        filingStatus = "Head of Household"
      } else if (lowerMessage.includes("other")) {
        filingStatus = "Other"
      }

      setConversationState({ ...conversationState, step: "outcome", filingStatus })
      return generateOutcome({ ...conversationState, filingStatus })
    }

    if (lowerMessage.includes("start over") || lowerMessage.includes("restart")) {
      setConversationState({ step: "greet" })
      return {
        content:
          "Hi! I'm your IRS Stimulus Assistant. I'll help you check your eligibility with just a few quick questions. Ready to get started?",
        quickReplies: ["Yes, let's start", "Tell me more", "I need help"],
      }
    }

    // Default response
    return {
      content:
        "I'm here to help with stimulus eligibility. Would you like to start over or check the official IRS tool?",
      hasIRSLink: true,
      quickReplies: ["Start over", "Check IRS tool"],
    }
  }

  const generateOutcome = (state: ConversationState): { content: string; hasIRSLink: boolean } => {
    let outcome = ""

    if (state.residency === "Non-resident") {
      outcome = "Based on your residency status, you may not be eligible for stimulus payments."
    } else if (state.income === "Under $75,000") {
      outcome = "Great news! Based on your income, you likely qualify for full stimulus payments."
    } else if (state.income === "$75,000 - $150,000") {
      outcome = "You may qualify for partial stimulus payments depending on your exact income and filing status."
    } else if (state.income === "Over $150,000") {
      outcome = "You may have limited eligibility, but it depends on your exact situation and dependents."
    } else {
      outcome = "Based on your responses, let's check your exact eligibility."
    }

    return {
      content: `${outcome} For the most accurate information and to claim any eligible payments, use the official IRS tool. Fill basic info to continue.`,
      hasIRSLink: true,
    }
  }

  const handleQuickReply = (reply: string) => {
    setInputValue(reply)
    // Auto-submit the quick reply
    setTimeout(() => {
      const event = new Event("submit") as any
      handleSendMessage({ preventDefault: () => {}, ...event })
    }, 100)
  }

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    const currentInput = inputValue
    setInputValue("")
    setIsTyping(true)

    // Simulate bot thinking time
    setTimeout(
      () => {
        const response = generateBotResponse(currentInput)
        const botResponse: Message = {
          id: (Date.now() + 1).toString(),
          content: response.content,
          sender: "bot",
          timestamp: new Date(),
          hasIRSLink: response.hasIRSLink,
          quickReplies: response.quickReplies,
        }

        setMessages((prev) => [...prev, botResponse])
        setIsTyping(false)
      },
      1000 + Math.random() * 1500,
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 flex flex-col bg-card border-0 md:border md:border-border md:max-w-2xl md:mx-auto md:my-4 md:h-[600px] md:rounded-lg rounded-none">
        <div className="flex items-center gap-3 p-4 md:p-4 border-b border-border bg-card sticky top-0 z-10">
          <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center bg-white shadow-sm">
            <img src="/usa-gov-logo.png" alt="USA.gov Logo" className="w-11 h-11 object-cover" />
          </div>
          <div>
            <h1 className="font-semibold text-card-foreground">IRS Stimulus Assistant</h1>
            <p className="text-sm text-muted-foreground">Check your eligibility & status</p>
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          <ChatMessageList>
            {messages.map((message) => (
              <ChatBubble key={message.id} variant={message.sender === "user" ? "sent" : "received"}>
                <ChatBubbleAvatar
                  className="h-10 w-10 shrink-0 bg-white shadow-sm"
                  src={
                    message.sender === "user" ? "/placeholder.svg?height=40&width=40&query=user" : "/usa-gov-logo.png"
                  }
                  fallback={message.sender === "user" ? "U" : "IRS"}
                />
                <ChatBubbleMessage variant={message.sender === "user" ? "sent" : "received"}>
                  <div>
                    <p className="text-sm leading-relaxed break-words">{message.content}</p>

                    {message.quickReplies && message.sender === "bot" && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {message.quickReplies.map((reply, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            className="text-xs h-7 bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700 hover:text-blue-800"
                            onClick={() => handleQuickReply(reply)}
                            disabled={isTyping}
                          >
                            {reply}
                          </Button>
                        ))}
                      </div>
                    )}

                    {message.hasIRSLink && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2 text-xs h-8 bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700 hover:text-blue-800"
                        onClick={() => window.open("https://www.irs.gov/coronavirus/get-my-payment", "_blank")}
                      >
                        <ExternalLink className="w-3 h-3 mr-1" />
                        IRS Eligibility & Claim Tool
                      </Button>
                    )}
                    <p className="text-xs mt-1 opacity-70">
                      {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </ChatBubbleMessage>
              </ChatBubble>
            ))}

            {isTyping && (
              <ChatBubble variant="received">
                <ChatBubbleAvatar
                  className="h-10 w-10 shrink-0 bg-white shadow-sm"
                  src="/usa-gov-logo.png"
                  fallback="IRS"
                />
                <ChatBubbleMessage isLoading />
              </ChatBubble>
            )}
          </ChatMessageList>
        </div>

        <div className="p-4 border-t">
          <form
            onSubmit={handleSendMessage}
            className="relative rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring p-1"
          >
            <ChatInput
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message..."
              className="min-h-12 resize-none rounded-lg bg-background border-0 p-3 shadow-none focus-visible:ring-0"
              disabled={isTyping}
            />
            <div className="flex items-center p-3 pt-0 justify-end">
              <Button
                type="submit"
                size="sm"
                className="ml-auto gap-1.5 bg-blue-600 hover:bg-blue-700 text-white"
                disabled={!inputValue.trim() || isTyping}
              >
                Send Message
                <CornerDownLeft className="size-3.5" />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
