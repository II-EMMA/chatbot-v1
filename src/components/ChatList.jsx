"use client";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { useEffect, useRef } from "react";
import ChatBubble from "./ChatBubble";

export default function ChatList({ messages }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <ScrollArea className="flex-1 p-4 overflow-y-auto">
      {messages.map((msg, idx) => (
        <ChatBubble key={idx} msg={msg} />
      ))}
      <div ref={scrollRef} />
    </ScrollArea>
  );
}
