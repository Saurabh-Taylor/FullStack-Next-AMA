"use client";
import { SignInSchema , signInSchema } from "@/schema/signInSchema";
import { useEffect, useState } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

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
import { signIn } from "next-auth/react";

const SignInPage = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<SignInSchema>({
		resolver: zodResolver(signInSchema),
		defaultValues: {
			identifier: "",
			password: "",
		},
	});

    const router = useRouter()
    const onSubmit  = async (data: SignInSchema)=>{
        setIsSubmitting(true);
        try {
            const result = await signIn("credentials", { identifier: data.identifier, password: data.password, redirect: false });
            if(result?.error){
                toast({
                    title:"Login Failed",
                    description:result.error,
                    variant:"destructive",
                })
				return 
            }
            router.replace("/dashboard")
        } catch (error) {
            console.error(error);
        }finally{
            setIsSubmitting(false)
        }
    } 

    return (
		<div className="flex justify-center items-center min-h-screen">
			<div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
				<div className="text-center">
					<h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
						Join True Feedback
					</h1>
					<p className="mb-4">Sign In to start your anonymous adventure</p>
				</div>
				<Form  {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<FormField
							control={form.control}
							name="identifier"
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
										<Input type="password" placeholder="password" {...field} />
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
								"Signin"
							)}
						</Button>
					</form>
				</Form>
				<div className="text-center mt-4">
					<p>
						Not a member?{" "}
						<Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
							Sign Up
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}

export default SignInPage