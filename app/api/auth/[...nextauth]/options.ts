import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModal from "@/model/user.model";

export const authOptions: NextAuthOptions = {
	providers: [
		CredentialsProvider({
			id: "credentials",
			name: "Credentials",
			credentials: {
				email: { label: "Email", type: "text" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials: any): Promise<any> {
				await dbConnect();
				try {
					const user = await UserModal.findOne({
						$or: [
							{ email: credentials.identifier },
							{ username: credentials.identifier },
						],
					});

					if (!user) {
						throw new Error("No Username Found with this Email");
					}
					if (!user.isVerified) {
						throw new Error("User is not verified , Please Verify First");
					}

					const isPasswordCorrect = await bcrypt.compare(
						credentials.password,
						user.password,
					);
					if (isPasswordCorrect) {
						return user;
					} else {
						throw new Error("Invalid Password");
					}
				} catch (err: any) {
					throw new Error(err);
				}
			},
		}),
	],
	callbacks: {
		async jwt({ token, user }) {
				/*
				console.log("user from callback in authOptions:", user);
				user from callback in authOptions: {
				_id: new ObjectId('66e3fa5b226caddce0e6c763'),
				username: 'saurabh',
				email: 'tailorsaurabh12@gmail.com',
				password: '$2a$10$rjilD/zujUY2vndZ0HwYu.0DpewUWnWBjGTaG6/ZktQ7JhlFWeyoe',
				verifyCode: '643642',
				verifyCodeExpiry: 2024-09-13T09:39:55.908Z,
				isVerified: true,
				isAcceptingMessage: true,
				message: [],
				__v: 0
}
			*/
			if (user) {
				token._id = user._id?.toString(); // Convert ObjectId to string
				token.isVerified = user.isVerified;
				token.isAcceptingMessages = user.isAcceptingMessages;
				token.username = user.username;
			  }
			  return token;
		},
		async session({ session, token }) {
			if (token) {
				session.user._id = token._id;
				session.user.isVerified = token.isVerified;
				session.user.isAcceptingMessages = token.isAcceptingMessages;
				session.user.username = token.username;
			}
			return session;
		},
	},
	pages: {
		signIn: "sign-in",
	},
	session: {
		strategy: "jwt",
	},
	secret: process.env.NEXT_AUTH_SECRET,
};
