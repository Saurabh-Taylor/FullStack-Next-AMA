import dbConnect from "@/lib/dbConnect";
import UserModal from "@/model/user.model";

import { Message } from "@/model/user.model";

export async function POST(request: Request) {
	await dbConnect();

	const { username, content } = await request.json();

	try {
		const user = await UserModal.findOne({ username });
		if (!user) {
			return Response.json(
				{
					success: false,
					message: "User not Found",
				},
				{ status: 404 },
			);
		}
		if (!user.isAcceptingMessage) {
			return Response.json(
				{
					success: false,
					message: "User is not accepting message",
				},
				{ status: 403 },
			);
		}

		const newMessage = { content, createdAt: new Date() };

		//thats why we have imported Message Interface
		user.message.push(newMessage as Message);

		await user.save();

		return Response.json(
			{
				success: true,
				message: "Message Sent SuccessFully",
			},
			{ status: 201 },
		);
	} catch (error) {
		console.error("error in send message:", error);
		return Response.json(
			{
				success: false,
				message: "Internal server error",
			},
			{ status: 401 },
		);
	}
}
