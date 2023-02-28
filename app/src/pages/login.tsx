import Typography from "@ui/Typography";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import AuthDivider from "../components/auth/AuthDivider";
import AuthProviders from "../components/auth/AuthProviders";
import Form from "../components/form/Form";
import ServerSideErrorMessage from "../components/form/ServerSideErrorMessage";
import { EMAIL_REGEX } from "../utils/formUtils";

type LoginInputs = {
  email: string;
  password: string;
};

const LoginFormSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required!")
    .email("Invalid email!")
    .refine((email) => email.match(EMAIL_REGEX)),
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
    <section className="w-full max-w-md self-center px-8">
      <Typography intent="h1">Log In</Typography>
      <Typography>
        Don&apos;t have an account?
        <span className="ml-2">
          <Link href="/signup">Sign Up</Link>
        </span>
      </Typography>

      {isInvalid && (
        <ServerSideErrorMessage error="The email and password combination is not valid. Please try again." />
      )}
      <Form
        onSubmit={onSubmit}
        schema={LoginFormSchema}
        className="flex flex-col gap-4"
      >
        <Form.Input name="email" displayName="Email" type="email" required />
        <Form.Input
          name="password"
          displayName="Password"
          type="password"
          required
        />
        <Form.Button name="Log In" type="submit" />
      </Form>
      <AuthDivider />
      <AuthProviders />
    </section>
  );
}

export default Login;
