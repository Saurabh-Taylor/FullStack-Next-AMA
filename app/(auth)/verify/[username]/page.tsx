"use client"
import { VerifyCodeSchema } from "@/schema/verifyCodeSchema";
import { useRouter } from "next/navigation";
import { useForm  } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios, { AxiosError } from "axios";
import { toast } from "@/hooks/use-toast";
import { ApiResponse } from "@/types/ApiResponse";
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"


const VerifyAccountPage = ({ params }: { params: { username: string } }) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof VerifyCodeSchema>>({
    resolver: zodResolver(VerifyCodeSchema),
    defaultValues:{
      code:""
    }
  });

  const onSubmit = async(data: z.infer<typeof VerifyCodeSchema>) => {
    try {
      const response = await axios.post("/verify-code" , {username : params.username , code : data.code})
  
      toast({
        title:"Success",
        description:response.data.message
      })
  
      if(response.data.success){
        router.replace("/sign-in")
      }
    } catch (error) {
			console.error("Error during sign-up:", error);
			const axiosError = error as AxiosError<ApiResponse>;
			let errorMessage = axiosError.response?.data.message;
			toast({
				title: "Verification Failed",
				description: errorMessage,
				variant:"destructive",
			});
		}
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Verify Your Account
          </h1>
          <p className="mb-4">Enter the verification code sent to your email</p>
        </div>
        <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Verification Code</FormLabel>
              <FormControl>
                <Input placeholder="Enter Your 6 Digit Verification Code" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
      </div>
    </div>
  );
};

export default VerifyAccountPage;
