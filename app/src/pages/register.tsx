import { User } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import AuthProviders from "../components/auth/AuthProviders";
import { trpc } from "../utils/trpc";
import { zodResolver } from "@hookform/resolvers/zod";

type RegisterInputs = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type RegisterResponse =
  | {
      user?: User;
      trpcError?: TRPCError;
    }
  | undefined;

// TODO: REFACTOR THIS WITH ZODRESOLVER
function Register() {
  const createUser = trpc.user.createUser.useMutation();

  const {
    register,
    setError,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<RegisterInputs>();

  const onSubmit: SubmitHandler<RegisterInputs> = async (data) => {
    const res: RegisterResponse = await createUser.mutateAsync(data);

    if (!res) return;

    if (res.trpcError) {
      setError(
        "email",
        {
          type: "TRPC Error",
          message: res.trpcError.message,
        },
        { shouldFocus: true }
      );
    } else if (res.user) {
      signIn("credentials", {
        email: res.user.email,
        password: res.user.password,
        callbackUrl: "/dashboard",
      });
    }
  };

  // TODO: add password regex (/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%#?&]{8,}$/)
  return (
    <section className="min-h-screen">
      <h1 className="mb-2">Register</h1>
      <Link href="/login">Login instead</Link>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-8 flex flex-col gap-4"
      >
        <div className="flex flex-col">
          <label>First Name</label>
          <input
            {...register("firstName", {
              required: "First name is required",
            })}
          />
          {errors.firstName?.message}
        </div>
        <div className="flex flex-col">
          <label>Last Name</label>
          <input {...register("lastName")} />
        </div>
        <div className="flex flex-col">
          <label>Email</label>
          <input
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /[\w]+@[a-z]+[\.][a-z]+/,
                message: "Invalid email",
              },
            })}
          />
          {errors.email?.message}
        </div>

        <div className="flex flex-col">
          <label>Password</label>
          <input
            type={"password"}
            {...register("password", {
              required: "Password is required",
            })}
          />
          {errors.password?.message}
        </div>

        <div className="flex flex-col">
          <label>Confirm Password</label>
          <input
            type={"password"}
            {...register("confirmPassword", {
              required: "Password is required",
              validate: (value) => {
                const { password } = getValues();
                return password === value || "Passwords should match!";
              },
            })}
          />
          {errors.confirmPassword?.message}
        </div>

        <button type="submit">Register</button>
      </form>
      <AuthProviders />
    </section>
  );
}

export default Register;
