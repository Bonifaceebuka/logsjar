"use client";

import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard,
  CreditCard,
  Settings,
  LifeBuoy,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Logo from "../common/logo";
import { useClerk, useUser } from "@clerk/nextjs";

export function LandingHeader() {
  // const { user, isLoaded, isSignedIn } = useUser();
  // const { signOut } = useClerk();

  // if (!isLoaded) {
  //   return null;
  // }

  const logoutHanlder = async () => {
    // await signOut();
  };
  return (
    <>
      <header className="w-full border-b border-slate-900/80 backdrop-blur-sm sticky top-0 z-50 bg-slate-950/80">
        <div className="mx-auto max-w-6xl flex items-center justify-between gap-4 py-3 px-4 sm:px-6 lg:px-8">
          <Link href="/#" className="flex items-center gap-1">
            <Logo />
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-base text-slate-400">
            <Link
              href="#story"
              className="hover:text-slate-50 transition-colors"
            >
              Why us?
            </Link>
            <Link
              href="#features"
              className="hover:text-slate-50 transition-colors"
            >
              Features
            </Link>
            <Link
              href="#integrations"
              className="hover:text-slate-50 transition-colors"
            >
              Integrations
            </Link>
            <Link
              href="#pricing"
              className="hover:text-slate-50 transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="/#"
              // target="_blank"
              className="hover:text-slate-50 transition-colors"
            >
              Docs
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            {/* {isSignedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-sky-500/10 text-sky-200 font-medium border border-sky-500/40">
                        <Image
                          src={user ? user?.imageUrl : ""}
                          alt={"User"}
                          width={32}
                          height={32}
                          className="rounded-full ring-1 ring-slate-700"
                        />
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-56 bg-slate-900 border-slate-800"
                  align="end"
                >
                  <Link href={"http://localhost:3001"} target="__blank">
                    <DropdownMenuItem className="text-slate-200 hover:bg-slate-800! hover:text-white">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard
                    </DropdownMenuItem>
                  </Link>
                  <Link href={"http://localhost:3001/settings"}>
                    <DropdownMenuItem className="text-slate-200 hover:bg-slate-800! hover:text-white">
                      <CreditCard className="mr-2 h-4 w-4" />
                      Billing
                    </DropdownMenuItem>
                  </Link>
                  <Link
                    href={"http://localhost:3001/settings"}
                    target="__blank"
                  >
                    <DropdownMenuItem className="text-slate-200 hover:bg-slate-800! hover:text-white">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </DropdownMenuItem>
                  </Link>
                  <Link href={"mailto:contact@oneminutelogs.com"}>
                    <DropdownMenuItem className="text-slate-200 hover:bg-slate-800! hover:text-white">
                      <LifeBuoy className="mr-2 h-4 w-4" />
                      Support
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuSeparator className="bg-slate-800" />
                  <DropdownMenuItem
                    className="text-red-400 hover:bg-red-500/10!"
                    onClick={() => logoutHanlder()}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : ( */}
              <>
                <Link
                  href={"/sign-in"}
                  className="hidden cursor-pointer sm:inline-flex items-center rounded-sm border border-slate-800 bg-slate-900/60 px-3 py-1.5 text-xs font-medium tracking-tight text-slate-100 hover:border-slate-600 hover:bg-slate-900 transition-colors"
                >
                  Log in
                </Link>
                <Link
                  href={"/sign-up"}
                  className="inline-flex cursor-po items-center rounded-sm bg-sky-500/90 px-3.5 py-1.5 text-xs font-semibold tracking-tight text-slate-950 shadow-sm hover:bg-sky-400 transition-colors"
                >
                  Get Started
                </Link>
              </>
            {/* )} */}
          </div>
        </div>
      </header>
    </>
  );
}
