import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { signIn } from "next-auth/react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { trpc } from "../../utils/trpc";
import { Form } from "../form/Form";

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

function SignUpForm(props: { email: string }) {
  const { email } = props;
  const createUser = trpc.user.createUser.useMutation();

  const { setError } = useForm<SignUpInputs>({
    resolver: zodResolver(SignUpSchema),
  });

  const onSubmit: SubmitHandler<SignUpInputs> = async (data) => {
    const { email } = data;
    const { password } = data.passwords;
    const res: SignUpResponse = await createUser.mutateAsync({
      email,
      password,
    });

    if (!res) return;

    if (res.trpcError) {
      setError(
        "email",
        {
          type: "TRPC Error",
          message: res.trpcError.message,
        },
        { shouldFocus: true }
      );
    } else if (res.user) {
      signIn("credentials", {
        email: res.user.email,
        password: res.user.password,
        callbackUrl: "/dashboard",
      });
    }
  };

  return (
    <Form<SignUpInputs, typeof SignUpSchema>
      onSubmit={onSubmit}
      schema={SignUpSchema}
      defaultValues={{ email: email }}
      className="flex flex-col gap-2"
    >
      <Form.Input<SignUpInputs>
        name="firstName"
        displayName="First Name"
        type="text"
      />
      <Form.Input<SignUpInputs>
        name="lastName"
        displayName="Last Name"
        type="text"
      />
      <Form.Input<SignUpInputs> name="email" displayName="Email" type="email" />
      <Form.Input<SignUpInputs>
        name="passwords.password"
        displayName="Password"
        type="password"
      />
      <Form.Input<SignUpInputs>
        name="passwords.confirmPassword"
        displayName="Confirm Password"
        type="password"
      />
      <button type="submit" className="mt-4">
        Sign Up
      </button>
    </Form>
  );
}

export default SignUpForm;
