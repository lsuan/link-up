import { User } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useForm, SubmitHandler, SubmitErrorHandler } from "react-hook-form";
import AuthProviders from "../components/auth/AuthProviders";
import { trpc } from "../utils/trpc";

type RegisterInputs = {
  email: string;
  password: string;
};

function Register() {
  const createUser = trpc.user.createUser.useMutation();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterInputs>();

  type RegisterResponse =
    | {
        user?: User;
        trpcError?: TRPCError;
      }
    | undefined;

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

  return (
    <section className="min-h-screen">
      <h1 className="mb-2">Register</h1>
      <Link href="/login">Login instead</Link>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-8 flex flex-col gap-4"
      >
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

        {/* TODO: add password regex (/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%#?&]{8,}$/) */}
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

        <button type="submit">Register</button>
      </form>
      <AuthProviders />
    </section>
  );
}

export default Register;
