"use client";

import { useRouter, usePathname } from "next/navigation";
import React from "react";
import SignInButton from "./signsButtons";

// import { UserButton } from "@clerk/nextjs"

export const NavbarRoutes = () => {
  const router = useRouter();
  const pathname = usePathname();

  const isTeacherPage = pathname?.startsWith("/teacher");
  const isChapterPage = pathname?.includes("/chapter");

  return (
    <div className="flex gap-x-2 ml-auto">
      {isTeacherPage || isChapterPage ? ( //want here add logout
        <button
          onClick={() => router.push("/")}
          type="button"
          className="text-gray-700 hover:text-gray-900"
        >
          Log Out
        </button>
      ) : (
        <>
                  <SignInButton />

          {/* <button
            onClick={() => router.push("/teacher/courses")}
            type="button"
            className=" rounded-xl  text-white bg-[#042539] py-1 px-3 shadow-lg  "
          >
            Sign up
          </button>
          <button
            onClick={() => router.push("/login")}
            type="button"
            className="text-gray-700 hover:text-black"
          >
            Login
          </button> */}
        </>
      )}
      {/* <a href="/" className="text-gray-700 hover:text-gray-900">Home</a> */}
    </div>
  );
};
