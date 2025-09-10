"use client";

import { Button } from "./ui/button";
import { Input } from "./ui/input";

export default function ChatInput({ prompt, setPrompt, onSubmit, loading }) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="p-4 border-t flex gap-2 bg-white"
    >
      <Input
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Type your message…"
        className="flex-1"
        disabled={loading}
      />
      <Button
        type="submit"
        disabled={loading}
        className={loading ? "opacity-50 pointer-events-none" : ""}
      >
        Send
      </Button>
    </form>
  );
}
