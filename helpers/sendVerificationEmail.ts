import VerificationEmail from "@/components/email-template";
import { resend } from "@/lib/resend";
import {  ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(username:string , email:string , verifyCode:string): Promise<ApiResponse> {
    try {

        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Mystery Message  | Verification Code',
            react: VerificationEmail({username , otp:verifyCode}),
          });
        return {success:false , message:"Failed to send verification mail"}
    } catch (error) {
        console.error("Error While sending verification email:" , error)
        return {success:false , message:"Failed to send verification mail"}
    }
}