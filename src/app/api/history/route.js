import { HistorySchema } from "../_lib/schema";
import { conversations } from "../_lib/store";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const conversationId = searchParams.get("conversationId");

  const parseResult = HistorySchema.safeParse({ conversationId });

  if (!parseResult.success) {
    const errorMessage =
      parseResult.error.issues[0]?.message || "Invalid input";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 400,
    });
  }

  const conversation = conversations[conversationId];
  if (!conversation) {
    return new Response(JSON.stringify({ error: "Conversation not found" }), {
      status: 404,
    });
  }

  return new Response(
    JSON.stringify({ conversationId, messages: conversation.messages })
  );
}
