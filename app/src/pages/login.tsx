import PageContainer from "@ui/PageContainer";
import Typography from "@ui/Typography";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { useAtom } from "jotai";
import { type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import AuthDivider from "../components/auth/AuthDivider";
import AuthProviders from "../components/auth/AuthProviders";
import Form from "../components/form/Form";
import ServerSideErrorMessage from "../components/form/ServerSideErrorMessage";
import FormFooter from "../components/shared/FormFooter";
import { updateTitle } from "../layouts/Layout";
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
  const [, setTitle] = useAtom(updateTitle);
  setTitle("Log In | LinkUp");
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
    <PageContainer>
      <div className="flex flex-col items-center gap-12">
        <Typography intent="h1" className="w-full">
          Log In
        </Typography>
        <Form
          onSubmit={onSubmit}
          schema={LoginFormSchema}
          className="flex w-full flex-col gap-4"
        >
          {isInvalid && (
            <ServerSideErrorMessage error="The email and password combination is not valid. Please try again." />
          )}
          <Form.Input
            name="email"
            displayName="Email Address"
            type="email"
            required
          />
          <Form.Input
            name="password"
            displayName="Password"
            type="password"
            required
          />
          <Form.Button name="Log In" type="submit" />
        </Form>
        <div className="w-full">
          <AuthDivider />
          <AuthProviders />
        </div>
      </div>
      <FormFooter page="login" />
    </PageContainer>
  );
}

export default Login;
