import dbConnect from "@/lib/dbConnect";
import UserModal from "@/model/user.model";
import { usernameValidation } from "@/schema/signUpSchema";
import { z } from "zod";

const UsernameQuerySchema = z.object({
	username: usernameValidation,
});

export async function GET(req: Request) {
	await dbConnect();

	try {
		//path --> localhost:3000/api/check-unique-username?username=saurabh

		const { searchParams } = new URL(req.url);
		const queryParam = {
			// username:"saurabh"
			username: searchParams.get("username"),
		};
		console.log("searchParams", queryParam);

		const result = UsernameQuerySchema.safeParse(queryParam);
		// result --> { success: true; data: {username:'saurabh'} }

		if (!result.success) {
			const usernameErrors = result.error.format()?.username?._errors || [];

			return Response.json(
				{
					success: false,
					message:
						usernameErrors?.length > 0
							? usernameErrors.join(", ")
							: "Invalid Query Parameters",
				},
				{ status: 400 },
			);
		}

		const { username } = result.data;

		const existingVerifiedUser = await UserModal.findOne({
			username,
			isVerified: true,
		});

		if (existingVerifiedUser) {
			return Response.json(
				{
					success: false,
					message: "Username is Already taken",
				},
				{ status: 400 },
			);
		}

		//success response
		return Response.json(
			{
				success: true,
				message: "Username is unique",
			},
			{ status: 200 },
		);
	} catch (error) {
		console.error("Error Checking Username", error);
		return Response.json(
			{
				success: false,
				message: "Error Checking Username",
			},
			{ status: 500 },
		);
	}
}

/*
 req.url --> http://localhost:3000/api/auth/check-username-unique?username=saurabh
console.log("url from : ", new URL(req.url));
url from :  URL {
  href: 'http://localhost:3000/api/auth/check-username-unique?username=%22saurabh%22',
  origin: 'http://localhost:3000',
  protocol: 'http:',
  username: '',
  password: '',
  host: 'localhost:3000',        
  hostname: 'localhost',
  port: '3000',
  pathname: '/api/auth/check-username-unique',
  search: '?username=%22saurabh%22',
  searchParams: URLSearchParams { 'username' => '"saurabh"' },    
  hash: ''
}

*/
