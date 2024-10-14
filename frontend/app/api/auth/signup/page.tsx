"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import {
  Form,
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
  FormItem,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { Backend_URL } from "@/lib/Constants";
import Error from "next/error";

const formSchema = z.object({
  username: z.string().min(1, {
    message: "Username is required",
  }),
  email: z.string().email({
    message: "Invalid email address",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters",
  }),
  role: z.enum(["student", "teacher"]),
});

const SignupPage = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      role: "student",
    },
  });
  //Relly want understand this part
  const { isSubmitting, isValid } = form.formState;
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      console.log("💛💛💛💛 values", values);
      const res = await fetch(`${Backend_URL}auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Registration failed");
      }

      toast.success("Registered successfully");
      const { data } = await res.json();
      console.log("💛💛💛💛 data.email", data.email);

      localStorage.setItem("email", data.email);

      router.push("/api/auth/verify-token");
    } catch (error) {
      router.push("/api/auth/signup");
      //TODO add middle ware to handle error + case server error
      toast.error(`Registration failed: ${error?.message}`);
    }
  };

  return (
    <div className="">
      <div className="text-2xl text-slate-600">Sign Up</div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 mt-8 w-full md:w-96"
        >
          <FormField
            control={form.control}
            name="username"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel className="text-slate-600">Name</FormLabel>
                <FormControl>
                  <Input
                    // disabled={isSubmitting}
                    placeholder="Name"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-700">
                  {fieldState.error?.message}
                </FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel className="text-slate-600">Email</FormLabel>
                <FormControl>
                  <Input
                    // disabled={isSubmitting}
                    placeholder="Email"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-700">
                  {fieldState.error?.message}
                </FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-600">Role</FormLabel>
                <FormControl>
                  <select
                    {...field}
                    className="w-full p-2 border border-black rounded"
                  >
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                  </select>
                </FormControl>
                <FormMessage></FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel className="text-slate-600">Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    // disabled={isSubmitting}
                    placeholder="Password"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-700">
                  {fieldState.error?.message}
                </FormMessage>
              </FormItem>
            )}
          />
          <div className="flex items-center justify-center gap-x-2 ">
            <Button
              type="submit"
              disabled={!isValid}
              variant="ghost"
              className="bg-black text-white rounded hover:bg-black hover:text-slate-300"
            >
              Submit
            </Button>

            <Link href="/">
              <Button variant="ghost" type="button">
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default SignupPage;
