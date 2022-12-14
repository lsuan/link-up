import { User } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { trpc } from "../../utils/trpc";
import { Form } from "../form/Form";
import ServerSideErrorMessage from "../form/ServerSideErrorMessage";

type SignUpInputs = {
  firstName: string;
  lastName: string;
  email: string;
  passwords: {
    password: string;
    confirmPassword: string;
  };
};

type SignUpResponse =
  | {
      user?: User;
      trpcError?: TRPCError;
    }
  | undefined;

// TODO: add password regex (/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%#?&]{8,}$/)
const SignUpSchema = z.object({
  firstName: z.string().min(1, "First name is required!"),
  lastName: z.string(),
  email: z
    .string()
    .min(1, "Email is required!")
    .email("Invalid email!")
    .refine((email) => email.match(/[\w]+@[a-z]+[\.][a-z]+/)),
  passwords: z
    .object({
      password: z.string().min(1, "Password is required!"),
      confirmPassword: z.string().min(1, "Password is required!"),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match!",
    }),
});

function SignUpForm({ email }: { email: string }) {
  const createUser = trpc.user.createUser.useMutation();
  const [invalidEmailMessage, setInvalidEmailMessage] = useState<string>("");

  const onSubmit: SubmitHandler<SignUpInputs> = async (data) => {
    const { email, firstName, lastName } = data;
    const { password } = data.passwords;
    const res: SignUpResponse = await createUser.mutateAsync({
      email,
      firstName,
      lastName,
      password,
    });

    if (!res) return;

    if (res.trpcError) {
      setInvalidEmailMessage(res.trpcError.message);
    } else if (res.user) {
      signIn("credentials", {
        email: res.user.email,
        password: res.user.password,
        callbackUrl: "/dashboard",
      });
    }
  };

  return (
    <>
      {invalidEmailMessage !== "" && (
        <ServerSideErrorMessage error={invalidEmailMessage} />
      )}
      <Form<SignUpInputs, typeof SignUpSchema>
        onSubmit={onSubmit}
        schema={SignUpSchema}
        defaultValues={{ email: email }}
        className="flex flex-col gap-4"
      >
        <Form.Input
          name="firstName"
          displayName="First Name"
          type="text"
          required={true}
        />
        <Form.Input name="lastName" displayName="Last Name" type="text" />
        <Form.Input name="email" displayName="Email" type="email" />
        <Form.Input
          name="passwords.password"
          displayName="Password"
          type="password"
          required={true}
        />
        <Form.Input
          name="passwords.confirmPassword"
          displayName="Confirm Password"
          type="password"
          required={true}
        />
        <Form.Button name="Sign Up" type="submit" />
      </Form>
    </>
  );
}

export default SignUpForm;
