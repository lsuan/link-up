import PageContainer from "@ui/PageContainer";
import Typography from "@ui/Typography";
import { useState } from "react";
import { useAtom } from "jotai";
import { type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import AuthDivider from "../components/auth/AuthDivider";
import AuthProviders from "../components/auth/AuthProviders";
import Form from "../components/form/Form";
import FormFooter from "../components/shared/FormFooter";
import SignUpForm from "../components/signup/SignUpForm";
import { updateTitle } from "../layouts/Layout";
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
  const [, setTitle] = useAtom(updateTitle);
  setTitle("Sign Up | LinkUp");

  const onSubmit: SubmitHandler<GetStartedInputs> = (data) => {
    const { email: currentEmail } = data;
    setEmail(currentEmail);
  };

  return (
    <PageContainer>
      <div className="flex w-full flex-col items-center justify-between gap-12">
        <Typography intent="h1" className="w-full">
          Sign Up
        </Typography>
        {email === "" ? (
          <>
            <Form<GetStartedInputs, typeof GetStartedSchema>
              onSubmit={onSubmit}
              schema={GetStartedSchema}
              className="flex w-full flex-col gap-4"
            >
              <Form.Input
                name="email"
                displayName="Email Address"
                type="email"
                required
              />
              <Form.Button name="Get Started" type="submit" />
            </Form>
            <div className="w-full">
              <AuthDivider />
              <AuthProviders />
            </div>
          </>
        ) : (
          <SignUpForm email={email} />
        )}
      </div>
      <FormFooter page="signup" />
    </PageContainer>
  );
}

export default SignUp;
