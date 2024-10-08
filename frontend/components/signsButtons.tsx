"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";

const SignInButton = () => {
  const { data: session } = useSession();
  console.log("💛💛 session data :",{session});

  if (session && session.user)
    return (
      <div className="flex gap-4 ml-auto">
        <p className="text-sky-600">{session.user.name}</p>
        <Link
          href={"/api/auth/signout"}
          className="flex gap-4 ml-auto text-black"
        >
          Sign Out
        </Link>
      </div>
    );

  return (
    <div className="flex gap-4 ml-auto items-center">
      <Link
        href={"/api/auth/signin"}
        className="flex gap-4 ml-auto text-sky-800"
      >
        Sign In
      </Link>
      <Link
        href={"/signup"}
        className="flex gap-4 ml-auto bg-sky-800 text-white p-2 rounded hover:bg-sky-900 duration-300"
      >
        Sign Up
      </Link>
    </div>
  );
};

export default SignInButton;
