"use client";
import {useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";

const SignInButton = () => {
  const { data: session } = useSession();
  console.log("💛💛 session data :",{session});
  ///TODO : change this
  if (session && session.user.id && session.user.name)
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
        href={"/signup"}
        className="flex gap-4 ml-auto bg-sky-800 text-white p-2 rounded hover:bg-sky-900 duration-300"
      >
        Sign Up
      </Link>
      <Link
      //TODO : change this 
        href={"#"}
        className="flex gap-4 ml-auto text-sky-800"
      >
        <a href="http://localhost:3000/api/auth">Sign In
        </a>
        
      </Link>
    </div>
  );
};

export default SignInButton;
