import Typography from "@ui/Typography";
import { useState } from "react";
import { type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import AuthDivider from "../components/auth/AuthDivider";
import AuthProviders from "../components/auth/AuthProviders";
import Form from "../components/form/Form";
import FormFooter from "../components/shared/FormFooter";
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
    <section className="flex h-full w-full max-w-md flex-col justify-between gap-12 px-8">
      <Typography intent="h1">Sign Up</Typography>
      {email === "" ? (
        <>
          <Form<GetStartedInputs, typeof GetStartedSchema>
            onSubmit={onSubmit}
            schema={GetStartedSchema}
            className="flex flex-col gap-4"
          >
            <Form.Input
              name="email"
              displayName="Email Address"
              type="email"
              required
            />
            <Form.Button name="Get Started" type="submit" />
          </Form>
          <div>
            <AuthDivider />
            <AuthProviders />
          </div>
        </>
      ) : (
        <SignUpForm email={email} />
      )}
      <FormFooter page="signup" />
    </section>
  );
}

export default SignUp;
