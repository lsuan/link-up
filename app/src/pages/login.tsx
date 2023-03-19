import Typography from "@ui/Typography";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import AuthDivider from "../components/auth/AuthDivider";
import AuthProviders from "../components/auth/AuthProviders";
import Form from "../components/form/Form";
import ServerSideErrorMessage from "../components/form/ServerSideErrorMessage";
import FormFooter from "../components/shared/FormFooter";
import { EMAIL_REGEX } from "../utils/formUtils";

type LoginInputs = {
  email: string;
  password: string;
  rememberMe: boolean;
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
    <section className="relative flex h-full w-full max-w-md flex-col justify-between gap-12 px-8">
      <Typography intent="h1">Log In</Typography>
      <Form
        onSubmit={onSubmit}
        schema={LoginFormSchema}
        className="flex flex-col gap-4"
      >
        {isInvalid && (
          <ServerSideErrorMessage error="The email and password combination is not valid. Please try again." />
        )}
        <Form.Input name="email" displayName="Email" type="email" required />
        <Form.Input
          name="password"
          displayName="Password"
          type="password"
          required
        />
        <Form.Checkbox
          name="rememberMe"
          label="Remember Me"
          className="self-end"
        />
        <Form.Button name="Log In" type="submit" />
      </Form>
      <div>
        <AuthDivider />
        <AuthProviders />
      </div>
      <FormFooter page="login" />
    </section>
  );
}

export default Login;
