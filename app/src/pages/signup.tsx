import Typography from "@ui/Typography";
import Link from "next/link";
import { useState } from "react";
import { type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import AuthDivider from "../components/auth/AuthDivider";
import AuthProviders from "../components/auth/AuthProviders";
import Form from "../components/form/Form";
import SignUpForm from "../components/signup/SignUpForm";
import { EMAIL_REGEX } from "../utils/formUtils";

type GetStartedInputs = {
  email: string;
};

const GetStartedSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required!")
    .email("Invalid email!")
    .refine((email) => email.match(EMAIL_REGEX)),
});

function SignUp() {
  const [email, setEmail] = useState<string>("");

  const onSubmit: SubmitHandler<GetStartedInputs> = (data) => {
    const { email: currentEmail } = data;
    setEmail(currentEmail);
  };

  return (
    <section className="w-full max-w-md self-center px-8">
      <Typography intent="h1">Sign Up</Typography>
      <Typography>
        <span className="mr-2">Already have an account?</span>
        <span>
          <Link href="/login">Log In</Link>
        </span>
      </Typography>

      {email === "" ? (
        <>
          <Form<GetStartedInputs, typeof GetStartedSchema>
            onSubmit={onSubmit}
            schema={GetStartedSchema}
            className="flex flex-col gap-4"
          >
            <Form.Input
              name="email"
              displayName="Email"
              type="email"
              required
            />
            <Form.Button name="Get Started" type="submit" />
          </Form>
          <AuthDivider />
          <AuthProviders />
        </>
      ) : (
        <SignUpForm email={email} />
      )}
    </section>
  );
}

export default SignUp;
