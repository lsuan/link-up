import Link from "next/link";
import { useForm, SubmitHandler, SubmitErrorHandler } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/router";

type LoginInputs = {
  email: string;
  password: string;
};

function Login() {
  const [isInvalid, setIsInvalid] = useState<boolean>(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginInputs>();

  const onSubmit: SubmitHandler<LoginInputs> = async (data) => {
    const res = await signIn("credentials", {
      ...data,
      redirect: false,
    });

    if (res?.error) {
      setIsInvalid(true);
    } else {
      setIsInvalid(false);
      router.push("/dashboard");
    }
  };

  return (
    <section>
      <h1>Login</h1>
      <Link href="/register">Register instead</Link>

      {isInvalid && <p>The email and password combination is incorrect.</p>}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-8 flex flex-col gap-4"
      >
        <div className="flex flex-col">
          <label>Email</label>
          <input
            {...register("email", {
              required: "Email is required",
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

        <button type="submit" disabled={!isValid}>
          Login
        </button>
      </form>
    </section>
  );
}

export default Login;
