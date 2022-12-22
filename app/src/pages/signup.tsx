import Link from "next/link";
import { useState } from "react";
import { z } from "zod";
import AuthProviders from "../components/auth/AuthProviders";
import { Form } from "../components/form/Form";
import SignUpForm from "../components/signup/SignUpForm";
import { SubmitHandler } from "react-hook-form";

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
    <section className="min-h-screen">
      <h1 className="mb-2">Sign Up</h1>
      <Link href="/login">Login instead</Link>
      {email === "" ? (
        <>
          <Form<GetStartedInputs, typeof GetStartedSchema>
            onSubmit={onSubmit}
            schema={GetStartedSchema}
            className="flex flex-col gap-2"
          >
            <Form.Input name="email" displayName="Email" type="email" />
            <button type="submit">Get Started</button>
          </Form>
          <AuthProviders />
        </>
      ) : (
        <SignUpForm email={email} />
      )}
    </section>
  );
}

export default SignUp;
