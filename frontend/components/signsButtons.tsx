"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";

const SignInButton = () => {
  ///TODO : change this
  return (
    <div className="flex gap-4  items-center">
      <Link
        href={"api/auth/signup"}
        className="flex gap-4  bg-sky-800 text-white p-2 rounded hover:bg-sky-900 duration-300"
      >
        Sign Up
      </Link>

      
      <Link
        href={"/api/auth/signin"}
        className="flex gap-4  text-sky-800">
        Sign In
      </Link>
    </div>
  );
};

export default SignInButton;
