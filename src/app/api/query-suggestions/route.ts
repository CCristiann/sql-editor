import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userQueryDescription } = await req.json();

    const deepSeekUrl = "https://api.deepseek.com/v1/chat/completions";

    const payload = {
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: `
            Sei un esperto SQL. L'utente vuole interrogare un database e ha scritto questa descrizione:
            "${userQueryDescription}"
            
            Suggerisci una query SQL che estrae dati senza modificare il database. Rispondi SOLO con la query SQL e niente altro.
          `,
        },
      ],
      max_tokens: 200,
    };

    const response = await fetch(deepSeekUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify(payload),
    });
    
    if (!response.ok) {
      throw new Error("Something went wrong");
    }

    const data = await response.json();
    const suggestedQuery = data.choices[0]?.message?.content;

    return NextResponse.json({ query: suggestedQuery });
  } catch (error) {
    console.error("Error fetching query suggestion:", error);
    return NextResponse.json(
      { error: "Error generating query" },
      { status: 500 }
    );
  }
}