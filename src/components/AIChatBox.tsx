import { cn } from "@/lib/utils";
import { Message, useChat } from "ai/react"
import { Button } from "./ui/button";
import { Bot, SendHorizonal, Trash, XCircle } from "lucide-react";
import { Input } from "./ui/input";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { useEffect, useRef } from "react";

interface AIChatBoxProps {
  open: boolean;
  onClose: () => void;
}

const AIChatBox = ({open, onClose}: AIChatBoxProps) => {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    setMessages,
    isLoading,
    error
  } = useChat();

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if(scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if(open) {
      inputRef.current?.focus();
    }
  }, [open] )

  const lastMessageIsUser = messages[messages.length - 1]?.role === "user";

  return (
    <div className={cn(" bottom-0 right-0 z-50 w-full max-w-[500px] p-1 xl:right-36", open ? "fixed" : "hidden")}>
      <Button onClick={onClose} className=" mb-1 ms-auto block">
        <XCircle size={30} className=" rounded-full"/>
      </Button>
      <div className=" flex h-[600px] flex-col bg-background rounded border shadow-xl">
        <div className=" h-full mt-3 px-3 overflow-y-auto" ref={scrollRef}>
          {messages.map(message =>(
              <ChatMessage message={message} key={message.id} />
          ))}
          {isLoading && lastMessageIsUser && (
            <ChatMessage
              message={{
                id: "loading",
                role: "assistant",
                content: "Thinking..."
              }}
            />
          )}
          {error && (
            <ChatMessage
            message={{
              id: "error",
              role: "assistant",
              content: "Something went wrong. Please try again!"
            }}
            />
          )}
          {!error && messages.length === 0 && (
            <div className=" flex flex-col h-full items-center justify-center gap-3 text-center mx-8">
              <Bot size={28}/>
              <p className=" text-lg font-medium">Send Message to start the chat with AI Chat</p>
              <p>
                You can ask the chatbot any question about your content!
              </p>
            </div>
          )}
        </div>
        <form onSubmit={handleSubmit} className=" m-3 flex gap-1">
            <Button
              type="button"
              variant={"outline"}
              className=" flex items-center justify-center w-10 flex-none"
              title="Clear Chat"
              onClick={() => setMessages([])}
              size="icon"
            >
              <Trash size={24}/>
            </Button>
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder="Say something..."
              className=" grow border rounded bg-background px-3 py-2 focus:outline-none"
              ref={inputRef}
            />
            <Button
              type="submit"
              className=" flex items-center justify-center w-10 flex-none disabled:opacity-50 hover:bg-blue-500 hover:text-white"
              disabled={input.length === 0}
              title="Submit Message"  
            >
              <SendHorizonal size={24}/>
            </Button>
          </form>
      </div>
    </div>
  )
}

export default AIChatBox

interface ChatMessageProps {
  message: Message
};

function ChatMessage({message: {role, content}}: ChatMessageProps ) {
  const {user} = useUser(); 
  const isAiMessage = role == "assistant";

  return (
    <div className={cn(" mb-3 flex items-center", isAiMessage ? " me-5 justify-start" : " ms-5 justify-end")}>
      {isAiMessage && <Bot className=" mr-2 flex-none" />}
      <p
        className={cn(" whitespace-pre-line rounded-md border px-3 py-2", isAiMessage ? " bg-background" : "bg-primary text-primary-foreground")}
      >
        {content}
      </p>
      {!isAiMessage && user?.imageUrl && (
        <Image
          src={user?.imageUrl}
          alt="image"
          width={100}
          height={100}
          className=" ml-2 rounded-full w-10 h-10 object-cover"
        />
      )
    }
    </div>
  )
}