import { User } from "@prisma/client";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useForm, SubmitHandler, SubmitErrorHandler } from "react-hook-form";
import AuthProviders from "../components/AuthProviders";
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

  const onSubmit: SubmitHandler<RegisterInputs> = async (data) => {
    const res = (await createUser.mutateAsync(data)) as {
      password: string;
      email: string;
      error: string;
    };

    if (!res) return;

    // error P2002 is a prisma error which means "Unique constraint failed on the {constraint}"
    // user email already exists in the db (email is the unique constraint)
    if (typeof res === "object" && res["error"] === "P2002") {
      setError(
        "email",
        {
          type: "server side",
          message: "A user already exists with this email!",
        },
        {
          shouldFocus: true,
        }
      );
      return;
    }

    signIn("credentials", {
      email: res.email,
      password: res.password,
      callbackUrl: "/dashboard",
    });
  };

  return (
    <section className="min-h-screen">
      <h1 className="mb-4">Register</h1>
      <Link href="/login">Login instead</Link>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-4 flex flex-col gap-4"
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
