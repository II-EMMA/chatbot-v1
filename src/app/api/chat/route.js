import { ChatSchema } from "../_lib/schema";
import { models } from "../_lib/models";
import { tryModel } from "../_lib/tryModel";
import { v4 as uuidv4 } from "uuid";
import { conversations } from "../_lib/store";

export async function POST(req) {
  const body = await req.json();
  const parseResult = ChatSchema.safeParse(body);

  if (!parseResult.success) {
    const errorMessage =
      parseResult.error.issues[0]?.message || "Invalid input";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 400,
    });
  }

  const { prompt, conversationId } = parseResult.data;
  const id = conversationId || uuidv4();

  if (!conversations[id]) {
    conversations[id] = { messages: [] };
  }

  const history = conversations[id].messages;
  const isPreviousQuestionRequest = prompt
    .toLowerCase()
    .includes("previous question");

  if (isPreviousQuestionRequest) {
    const userMessages = history.filter((msg) => msg.role === "user");
    const lastQuestion =
      userMessages.length >= 1
        ? userMessages[userMessages.length - 1].content
        : null;
    const reply = lastQuestion
      ? `Your previous question was: "${lastQuestion}"`
      : "I couldn't find your previous question.";

    return new Response(
      JSON.stringify({
        reply,
        model: "meta",
        conversationId: id,
        lastResponseId: uuidv4(),
      })
    );
  }

  history.push({ role: "user", content: prompt });

  for (const model of models) {
    try {
      const modelHistory = [...history];
      modelHistory.unshift({
        role: "system",
        content: `You are a helpful assistant powered by ${model}. If asked about your identity, respond with that model name.`,
      });

      const reply = await tryModel(modelHistory, model);
      if (reply) {
        history.push({ role: "assistant", content: reply });
        return new Response(
          JSON.stringify({
            reply,
            model,
            conversationId: id,
            lastResponseId: uuidv4(),
          })
        );
      }
    } catch (err) {
      console.warn(`Model ${model} failed:`, err.message);
    }
  }

  return new Response(
    JSON.stringify({ error: "All models failed. Try again later." }),
    { status: 500 }
  );
}
