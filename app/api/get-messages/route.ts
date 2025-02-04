import dbConnect from "@/lib/dbConnect";
import UserModal from "@/model/user.model";
import { authOptions } from "../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET() {
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

	const userId = new mongoose.Types.ObjectId(user._id);

	try {
		const user = await UserModal.aggregate([
			{ $match: { id: userId } }, //1st pipleline
			{ $unwind: "$message" }, //2nd pipleline
			{ $sort: { "message.createdAt": -1 } }, //3rd pipeline
			{ $group: { _id: "$_id", messages: { $push: "$message" } } }, // 4th pipeline
		]);

		if (!user || user.length === 0) {
			return Response.json(
				{
					success: false,
					message: "User Not Found",
				},
				{ status: 401 },
			);
		}

		return Response.json(
			{
				success: true,
				messages: user[0].message, // check whether it is messasges or message
			},
			{ status: 401 },
		);
	} catch (error) {
		console.error("error in get message:", error);
		return Response.json(
			{
				success: false,
				message: "Not Authenticated",
			},
			{ status: 401 },
		);
	}
}
