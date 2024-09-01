import { z } from "zod";


export const MessageSchema  = z.object({
    content:z.
    string()
    .min(8, { message: 'Minimum Lenght of Content is 8 Characters' })
    .max(256, { message: 'Minimum Lenght of Content is 256 Characters'})
})