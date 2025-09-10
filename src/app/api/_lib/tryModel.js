export async function tryModel(messages, model) {
  const res = await fetch("https://api.algion.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer 123123",
    },
    body: JSON.stringify({ model, messages }),
  });

  if (!res.ok) throw new Error(`Model ${model} failed`);
  const data = await res.json();
  return data.choices?.[0]?.message?.content || null;
}
