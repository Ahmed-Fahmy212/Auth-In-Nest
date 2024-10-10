"use client";

import { Button } from "@/components/Button";
import InputBox from "@/components/InputBox";
import { Backend_URL } from "@/lib/Constants";
import Link from "next/link";
import React, { useRef } from "react";
import { Bounce, toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


type FormInputs = {
  name: string;
  email: string;
  password: string;
};

const SignupPage = () => {
  // const router = useRouter();

  const register = async () => {
    const res = await fetch(Backend_URL + "auth/register", {
      method: "POST",
      body: JSON.stringify({
        username: data.current.name,
        email: data.current.email,
        password: data.current.password,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const errorData = await res.json();
    if (!res.ok) {
      //TODO make this in better
      toast.error(`${errorData.error}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
        transition: Bounce,
      });
      return errorData;
    }
    toast.success(`Regisred successfully`);
    //TODO FIX THIS
    
    // router.push('/');
  };
  const data = useRef<FormInputs>({
    name: "",
    email: "",
    password: "",
  });
  return (
    <div className="m-2 border rounded shadow-lg overflow-hidden">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />

      <div className="p-2 bg-gradient-to-b from-white to-slate-200 text-slate-600">
        Sign Up
      </div>

      <div className="p-4 flex flex-col gap-6">
        <InputBox
          name="name"
          labelText="Name"
          required
          autoComplete="off"
          onChange={(e) => (data.current.name = e.target.value)}
        />

        <InputBox
          name="email"
          labelText="Email"
          required
          onChange={(e) => (data.current.email = e.target.value)}
        />

        <InputBox
          name="password"
          labelText="Password"
          type="password"
          required
          onChange={(e) => (data.current.password = e.target.value)}
        />

        <div className="flex justify-center items-center gap-4">
          <Button onClick={register}>Submit</Button>
          <Link href="/" className="text-blue-500 hover:underline">
            Cancel
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
