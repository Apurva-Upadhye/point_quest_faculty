"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormEvent } from "react";
import Link from "next/link";
import { z, ZodError } from "zod";
import { useState } from "react";

// Define Zod schema for validation
const loginSchema = z.object({
  uid: z.string().min(1, "uid is required"),
  password: z.string().min(5, "Password must be at least 5  characters long"),
});

export default function Form() {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const formValues = {
      uid: formData.get("uid")?.toString() ?? "",
      password: formData.get("password")?.toString() ?? "",
    };

    try {
      // Validate form data using Zod
      loginSchema.parse(formValues);
      // Proceed with form submission if validation passes
      const response = await signIn("credentials", {
        uid: formValues.uid,
        password: formValues.password,
        redirect: false,
      });

      console.log({ response });

      if (!response?.error) {
        router.push("/faculty");
        router.refresh();
      } else {
        // Handle failed login attempt here if needed
        console.error("Login failed:", response.error);
      }
    } catch (error) {
      if (error instanceof ZodError) {
        // Extract errors from Zod validation
        const formattedErrors: { [key: string]: string } = {};
        error.errors.forEach((err) => {
          formattedErrors[err.path[0]] = err.message;
        });
        setErrors(formattedErrors);
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md mx-auto mt-10 flex flex-col gap-4"
    >
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">
        Login
      </h1>
      <div>
        <input
          name="uid"
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 ${
            errors.uid
              ? "focus:ring-red-500 border-red-500"
              : "focus:ring-blue-500"
          } focus:outline-none`}
          type="text"
          placeholder="uid"
        />
        {errors.uid && <p className="text-red-500 text-sm">{errors.uid}</p>}
      </div>
      <div>
        <input
          name="password"
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 ${
            errors.password
              ? "focus:ring-red-500 border-red-500"
              : "focus:ring-blue-500"
          } focus:outline-none`}
          type="password"
          placeholder="Password"
        />
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password}</p>
        )}
      </div>
      <button
        type="submit"
        className="w-full px-4 py-2 text-white font-bold rounded-lg bg-blue-600 hover:bg-blue-700 transition"
      >
        Login
      </button>
      <p className="text-center text-gray-600 mt-4">
        Don’t have an account?{" "}
        <Link href="/signup" className="text-blue-500 hover:underline">
          Sign up
        </Link>
      </p>
    </form>
  );
}
