import Link from "next/link";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { SubmitHandler } from "react-hook-form";
import { z } from "zod";
import AuthDivider from "../components/auth/AuthDivider";
import AuthProviders from "../components/auth/AuthProviders";
import { Form } from "../components/form/Form";
import ServerSideErrorMessage from "../components/form/ServerSideErrorMessage";

type LoginInputs = {
  email: string;
  password: string;
};

const LoginFormSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required!")
    .email("Invalid email!")
    .refine((email) => email.match(/[\w]+@[a-z]+[\.][a-z]+/)),
  password: z.string().min(1, "Password is required!"),
});

function Login() {
  const [isInvalid, setIsInvalid] = useState<boolean>(false);
  const router = useRouter();

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
    <section className="w-full max-w-md self-center">
      <h1 className="mb-2 text-3xl font-semibold">Log In</h1>
      <p className="mb-10">
        Don't have an account?
        <span className="ml-2">
          <Link href="/signup">Sign Up</Link>
        </span>
      </p>

      {isInvalid && (
        <ServerSideErrorMessage error="The email and password combination is not valid. Please try again." />
      )}
      <Form
        onSubmit={onSubmit}
        schema={LoginFormSchema}
        className="flex flex-col gap-4"
      >
        <Form.Input
          name="email"
          displayName="Email"
          type="email"
          required={true}
        />
        <Form.Input
          name="password"
          displayName="Password"
          type="password"
          required={true}
        />
        <Form.Submit name="Log In" type="submit" />
      </Form>
      <AuthDivider />
      <AuthProviders />
    </section>
  );
}

export default Login;
