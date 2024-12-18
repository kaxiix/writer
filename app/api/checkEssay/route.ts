import { NextResponse } from "next/server";
import OpenAI from "openai";
import { generalPrompt } from "../../lib/generalPrompt";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "" });

// Define the type locally if not imported
type ChatCompletionMessageParam = {
    role: "system" | "user" | "assistant" | "developer";
    content: string;
};

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const essay = body.essay;

        if (!essay) {
            return NextResponse.json({ error: "Essay content is required" }, { status: 400 });
        }

        const messages: ChatCompletionMessageParam[] = [
            { role: "developer", content: generalPrompt },
            { role: "system", content: "This is the question. 'In many professional sports, there is an increase in the number of athletes using banned substances to improve their performance. What are the causes of the phenomenon and what are some of the possible solutions?'   " },
            
            

            { role: "user", content: essay },
        ];

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages,
        });

        return NextResponse.json({ xmlResponse: completion.choices[0].message?.content });
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ error: "Failed to generate response" }, { status: 500 });
    }
}
