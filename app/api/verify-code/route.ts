import dbConnect from "@/lib/dbConnect";
import UserModal from "@/model/user.model";
import { z } from "zod";

export async function POST(req: Request) {
	await dbConnect();
	try {
		let { username, code } = await req.json();
		const decodedUsername = decodeURIComponent(username);
		const user = await UserModal.findOne({ username: decodedUsername });
		if (!user) {
			return Response.json(
				{
					success: false,
					message: "User not found",
				},
				{ status: 500 },
			);
		}

		const isCodeValid = user.verifyCode === code;
		const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

		if (isCodeValid && isCodeNotExpired) {
			user.isVerified = true;
			await user.save();
			return Response.json({
				success: true,
				message: "Account Verified successfully",
			});
		} else if (!isCodeNotExpired) {
			return Response.json(
				{
					success: false,
					message: "Verification code has expired, please sign up again",
				},
				{ status: 400 },
			);
		} else {
			return Response.json({
				success: false,
				message: "Invalid verification code",
			});
		}
	} catch (error) {
		console.error("Error Verifying User", error);
		return Response.json({
			success: "false",
			message: "Error Verifying User",
		});
	}
}
