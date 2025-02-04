"use client";
import { useSession, signOut} from "next-auth/react";
import { User } from "next-auth";
import Link from "next/link";
import * as React from "react"
import { MoonIcon, SunIcon } from "@radix-ui/react-icons"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ModeToggle() {
  const { setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}


const Navbar = () => {
  const { data: session } = useSession();
  const user = session?.user as User;

  return (
    <nav>
      <div className="flex justify-between px-8 py-4 items-center bg-[#14213d] p-4 dark:text-white text-[#ee6c4d] ">
        
        <div className="text-2xl text-[#bbd0ff]" >Mystery Message</div>
        {session ? 
        <div className="flex items-center " >
            <p>Welcome <span className="text-[#ffc300] bg-[#2b2d42] p-2 rounded-lg mr-4" >{user.username ?? user.email} </span> </p>
            <ModeToggle   />
            <Button className="ml-4" onClick={() => signOut()} > Sign Out </Button>
        </div> 
        : 
        <div>
            <Button > 
                <Link href={"sign-in"} > Sign In </Link>
            </Button>
        </div>}</div>
    </nav>
  );
};

export default Navbar;
