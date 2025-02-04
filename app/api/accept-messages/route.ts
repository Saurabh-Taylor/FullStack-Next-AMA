import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModal from "@/model/user.model";
import dbConnect from "@/lib/dbConnect";

import { User } from "next-auth";

export async function POST(req: Request) {
	await dbConnect();

	const session = await getServerSession(authOptions);
	const user: User = session?.user as User;
	if (!session || !session.user) {
		return Response.json(
			{
				success: false,
				message: "You are not logged in",
			},
			{ status: 401 },
		);
	}

	const userId = user._id;

	const { acceptMessages } = await req.json();

	try {
		const updatedUser = await UserModal.findByIdAndUpdate(
			userId,
			{ isAcceptingMessage: acceptMessages },
			{ new: true },
		);

		if (!updatedUser) {
			return Response.json(
				{
					success: false,
					message: "Failed to update user status to accept messages",
				},
				{ status: 401 },
			);
		}

		return Response.json(
			{
				success: true,
				message: "Message acceptance status updated successfully",
				updatedUser,
			},
			{ status: 201 },
		);
	} catch (error) {
		console.error("Failed to update user status to accept");

		return Response.json(
			{
				success: false,
				message: "Failed to update user status to accept messages",
			},
			{ status: 500 },
		);
	}
}

export async function GET(req: Request) {
	await dbConnect();

	const session = await getServerSession(authOptions);
	const user: User = session?.user as User;
	if (!session || !session.user) {
		return Response.json(
			{
				success: false,
				message: "You are not logged in",
			},
			{ status: 401 },
		);
	}

	const userId = user._id;

	try {
		const foundUser = await UserModal.findById(userId);

		if (!foundUser) {
			return Response.json(
				{
					success: false,
					message: "Failed to found user",
				},
				{ status: 404 },
			);
		}

		return Response.json(
			{
				success: true,
				isAcceptingMessages: foundUser?.isAcceptingMessage,
			},
			{ status: 200 },
		);
	} catch (error) {
		console.error("Error while getting acceptance status ", error);

		return Response.json(
			{
				success: false,
				message: "Error is getting message acceptance status",
			},
			{ status: 500 },
		);
	}
}
