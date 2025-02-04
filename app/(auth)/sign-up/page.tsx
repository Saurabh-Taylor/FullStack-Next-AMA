"use client";
import { SignUpSchema, usernameValidation , signUpSchema } from "@/schema/signUpSchema";
import { useEffect, useState } from "react";
import * as z from "zod";
import axios, { AxiosError } from "axios";
import { useDebounceCallback, useDebounceValue } from "usehooks-ts";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { ApiResponse } from "@/types/ApiResponse";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import Link from "next/link";

const SignupPage = () => {
	const [username, setUsername] = useState<string>("");
	const [usernameMessage, setUsernameMessage] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isCheckingUsername, setIsCheckingUsername] = useState(false);
	const debounced = useDebounceCallback(setUsername, 500);
	const form = useForm<SignUpSchema>({
		resolver: zodResolver(signUpSchema),
		defaultValues: {
			username: "",
			email: "",
			password: "",
		},
	});

	const router = useRouter();

	useEffect(() => {
		const checkUsernameUnique = async () => {
			if (username) {
				setIsCheckingUsername(true);
				setUsernameMessage(""); // Reset message
				try {
					const response = await axios.get<ApiResponse>(
						`/api/check-username-unique?username=${username}`,
					);
					console.log("signup response", response);

					setUsernameMessage(response.data.message);
				} catch (error) {
					const axiosError = error as AxiosError<ApiResponse>;
					setUsernameMessage(
						axiosError.response?.data.message ?? "Error checking username",
					);
				} finally {
					setIsCheckingUsername(false);
				}
			}
		};
		checkUsernameUnique();
	}, [username]);

	const onSubmit = async (data: SignUpSchema) => {
		console.log(data);
		
		setIsSubmitting(true);
		try {
			const response = await axios.post("/api/sign-up", data);

			toast({
				title: "Success",
				description: response.data.message,
			});

			router.replace(`/verify/${username}`);
			setIsSubmitting(false);
		} catch (error) {
			console.error("Error during sign-up:", error);
			const axiosError = error as AxiosError<ApiResponse>;
			let errorMessage = axiosError.response?.data.message;
			toast({
				title: "Sign Up Failed",
				description: errorMessage,
				variant:"destructive",
			});

			setIsSubmitting(false);
		}
	};

	return (
		<div className="flex justify-center items-center min-h-screen">
			<div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
				<div className="text-center">
					<h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
						Join True Feedback
					</h1>
					<p className="mb-4">Sign up to start your anonymous adventure</p>
				</div>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<FormField
							control={form.control}
							name="username"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Username</FormLabel>
									<FormControl>
										<Input
											placeholder="username"
											{...field}
											onChange={(e) => {
												field.onChange(e);
												debounced(e.target.value);
											}}
										/>
									</FormControl>
									{isCheckingUsername && <Loader2 className="animate-spin" />}
									{!isCheckingUsername && usernameMessage && (
										<p
											className={`text-sm ${
												usernameMessage === "Username is unique"
													? "text-green-500"
													: "text-red-500"
											}`}
										>
											{usernameMessage}
										</p>
									)}
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input placeholder="email" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Password</FormLabel>
									<FormControl>
										<Input placeholder="password" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button
							className="w-full mt-4"
							type="submit"
							disabled={isSubmitting}
						>
							{isSubmitting ? (
								<>
									<Loader2 className="mr-2 w-6 h-6 animate-spin" />
								</>
							) : (
								"Signup"
							)}
						</Button>
					</form>
				</Form>
				<div className="text-center mt-4">
					<p>
						Already a member?{" "}
						<Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
							Sign in
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
};

export default SignupPage;
