"use client"

import { useState } from "react"
import { Button } from "./ui/button";
import { Bot } from "lucide-react";
import AIChatBox from "./AIChatBox";


const AIChatButton = () => {
  const [chatBoxOpen, setChatBoxOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setChatBoxOpen(true)}>
        <Bot size={24} className=" mr-2"/>
        Smart Chat
      </Button>
      <AIChatBox open={chatBoxOpen} onClose={() => setChatBoxOpen(false)}/>
    </>

  )
}

export default AIChatButton
