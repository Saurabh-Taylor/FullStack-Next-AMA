import UserModal from "@/model/user.model";
import { createOpenAI } from "@ai-sdk/openai";
import { generateText, streamText } from "ai";

const groq = createOpenAI({
	baseURL: "https://api.groq.com/openai/v1",
	apiKey: process.env.GROQ_API_KEY,
});

export async function GET() {
	// const prompt = "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment."

	let prompt = "tell me about bill elon musk";
	const models = ["llama-3.1-8b-instant", "mixtral-8x7b-32768"];
	try {
		const { textStream } = await streamText({
			model: groq(models[0]),
			prompt,
		});
		// for await (const textPart of textStream) {
		//     console.log(textPart);
		//   }
		const { text } = await generateText({
			model: groq(models[0]),
			prompt,
		});

		console.log(text);

		return Response.json({
			success: true,
			message: textStream,
		});
	} catch (error) {
		console.error("something went wrong", error);
		return Response.json({
			success: true,
			message: "error at suggest messages route",
		});
	}
}
