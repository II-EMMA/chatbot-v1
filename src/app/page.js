"use client";
import { useState } from "react";
import { z } from "zod";
import ChatList from "@/components/ChatList";
import ChatInput from "@/components/ChatInput";
import * as Sentry from "@sentry/react";
import { browserTracingIntegration } from "@sentry/react";

Sentry.init({
  dsn: "https://c25e2f0c4d61719cb5af6c9221d1afe4@o4509991070072832.ingest.us.sentry.io/4509991072366592",
  integrations: [browserTracingIntegration()],
  tracesSampleRate: 1.0,
});

const PromptSchema = z.object({
  prompt: z.string().min(1, "Prompt cannot be empty"),
});

export default function ChatPage() {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);

  const isLocal =
    typeof window !== "undefined" && window.location.hostname === "localhost";
  // const baseURL = isLocal
  //   ? "http://localhost:3000/api"
  //   : "https://chatbot-example-demo.vercel.app/api";

  async function sendPrompt() {
    setLoading(true);

    setMessages((prev) => [
      ...prev,
      { role: "user", content: prompt },
      { role: "assistant", content: "", loading: true },
    ]);

    const validation = PromptSchema.safeParse({ prompt });

    if (!validation.success) {
      updateLastAssistant("Message is empty");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, conversationId }),
      });

      const text = await res.text();
      const data = JSON.parse(text);

      if (!res.ok) throw new Error(data.error || "Unknown error");

      if (!conversationId && data.conversationId) {
        setConversationId(data.conversationId);
      }

      updateLastAssistant(data.reply);
      setPrompt("");
    } catch (err) {
      console.error("Fetch error:", err.message);
      updateLastAssistant(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  function updateLastAssistant(content) {
    setMessages((prev) => {
      const updated = [...prev];
      const lastIndex = updated.findIndex(
        (msg) => msg.role === "assistant" && msg.loading
      );
      if (lastIndex !== -1) {
        updated[lastIndex] = { role: "assistant", content };
      }
      return updated;
    });
  }

  return (
    <>
      <header className="p-4 border-b text-center font-semibold text-lg">
        Chatbot Messenger
      </header>
      <ChatList messages={messages} />
      <ChatInput
        prompt={prompt}
        setPrompt={setPrompt}
        onSubmit={sendPrompt}
        loading={loading}
      />
    </>
  );
}
