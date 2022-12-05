import Link from "next/link";
import { useForm, SubmitHandler, SubmitErrorHandler } from "react-hook-form";
import { signIn } from "next-auth/react";
import { userInfo } from "os";

type LoginInputs = {
  email: string;
  password: string;
};

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginInputs>();

  const onSubmit: SubmitHandler<LoginInputs> = async (data) => {
    const res = await signIn("credentials", {
      email: data.email,
      password: data.password,
    });

    console.log(res);
  };
  const onError = (errors: any) => {
    console.log(errors);
  };

  return (
    <section>
      <h1>Login</h1>
      <Link href="/register">Register instead</Link>

      <form
        onSubmit={handleSubmit(onSubmit, onError)}
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
