"use client";

import { useRouter, usePathname } from "next/navigation";
import React from "react";
import SignInButton from "./signsButtons";
import { Button } from "./Button";
import { signIn, signOut } from "next-auth/react";
import { useSession } from "next-auth/react";

export const NavbarRoutes = () => {
  const router = useRouter();
  const pathname = usePathname();
  const session = useSession();
  console.log("💛💛💛💛 session", session);
  const isTeacherPage = pathname?.includes("/teacher");
  const isChapterPage = pathname?.includes("/chapter");
  const isAuthenticated = session.data?.user?.name; //TODO add role
  const isTeacher = session.data?.user?.role === "teacher";
  return (
    <div className="flex gap-x-2">
      {isAuthenticated ? (
        <>
          {isTeacher ? (
            // teacher in main page or chapter page
            <>
              {isTeacherPage || isChapterPage ? (
                <>
                  <button
                    onClick={() => signOut()}
                    type="button"
                    className="text-gray-700 hover:text-gray-900"
                  >
                    Log Out
                  </button>
                </>
              ) : (
                <>
                  <Button
                    onClick={() => router.push("/teacher")}
                    className="bg-black hover:bg-black/90 text-white shadow shadow-gray-900 hover:shadow-gray-900"
                  >
                    courses Mode
                  </Button>
                  <button
                    onClick={() => signOut()}
                    type="button"
                    className="text-gray-700 hover:text-gray-900"
                  >
                    Log Out
                  </button>
                </>
              )}
            </>
          ) : (
            // logged in student
            <>
              <button
                onClick={() => signOut()}
                type="button"
                className="text-gray-700 hover:text-gray-900"
              >
                Log Out
              </button>
            </>
          )}
        </>
      ) : (
        // log in or sign up
        <>
          <button
            onClick={() => signIn()}
            type="button"
            className="text-gray-700 hover:text-black"
          >
            Login
          </button>
          <button
            onClick={() => router.push("api/auth/signup")}
            type="button"
            className="rounded-xl text-white bg-[#042539] py-2 px-3 shadow-lg hover:text-slate-300 hover:duration-300"
          >
            Sign up
          </button>
        </>
      )}
    </div>
  );
};
