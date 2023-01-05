import Link from "next/link";
import { useState } from "react";
import { z } from "zod";
import AuthProviders from "../components/auth/AuthProviders";
import { Form } from "../components/form/Form";
import SignUpForm from "../components/signup/SignUpForm";
import { SubmitHandler } from "react-hook-form";
import AuthDivider from "../components/auth/AuthDivider";

type GetStartedInputs = {
  email: string;
};

const GetStartedSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required!")
    .email("Invalid email!")
    .refine((email) => email.match(/[\w]+@[a-z]+[\.][a-z]+/)),
});

function SignUp() {
  const [email, setEmail] = useState<string>("");

  const onSubmit: SubmitHandler<GetStartedInputs> = (data) => {
    const { email } = data;
    setEmail(email);
  };

  return (
    <section className="w-full max-w-md self-center px-8">
      <h1 className="mb-2 text-3xl font-semibold">Sign Up</h1>
      <p className="mb-10">
        <span className="mr-2">Already have an account?</span>
        <span>
          <Link href="/login">Log In</Link>
        </span>
      </p>

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
              required={true}
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
