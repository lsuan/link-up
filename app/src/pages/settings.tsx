import { TRPCError } from "@trpc/server";
import { User } from "prisma/prisma-client";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { Form } from "../components/form/Form";
import ServerSideErrorMessage from "../components/form/ServerSideErrorMessage";
import { trpc } from "../utils/trpc";

type SettingsInputs = {
  firstName: string;
  lastName: string;
  email: string;
  passwords: {
    password: string;
    confirmPassword: string;
  };
};

type SettingsResponse =
  | {
      user?: User;
      trpcError?: TRPCError;
    }
  | undefined;

const SettingsSchema = z.object({
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

function Settings() {
  const { data } = useSession();
  const user = trpc.user.getUser.useQuery(
    { id: data?.user?.id || "" },
    { enabled: data?.user !== undefined }
  );
  const [invalidEmailMessage, setInvalidEmailMessage] = useState<string>("");

  const onSubmit: SubmitHandler<SettingsInputs> = async (data) => {
    console.log(data);
  };
  return (
    <section>
      <h1 className="mb-12 text-3xl font-semibold">Settings</h1>
      {invalidEmailMessage !== "" && (
        <ServerSideErrorMessage error={invalidEmailMessage} />
      )}
      {/* defaultValues={} */}
      <Form<SettingsInputs, typeof SettingsSchema>
        onSubmit={onSubmit}
        schema={SettingsSchema}
        defaultValues={{
          firstName: user.data?.firstName,
          lastName: user.data?.lastName,
          email: user.data?.email,
          passwords: {
            password: user.data?.password,
            confirmPassword: user.data?.password,
          },
        }}
        className="flex flex-col gap-4"
      >
        <Form.Input<SettingsInputs>
          name="firstName"
          displayName="First Name"
          type="text"
          required={true}
        />
        <Form.Input<SettingsInputs>
          name="lastName"
          displayName="Last Name"
          type="text"
        />

        <>
          <Form.Input<SettingsInputs>
            name="email"
            displayName="Email"
            type="email"
            required={true}
          />

          <Form.Input<SettingsInputs>
            name="passwords.password"
            displayName="Password"
            type="password"
            required={true}
          />
          <Form.Input<SettingsInputs>
            name="passwords.confirmPassword"
            displayName="Confirm Password"
            type="password"
            required={true}
          />
        </>

        <Form.Submit name="Save Changes" type="submit" />
      </Form>
    </section>
  );
}

export default Settings;
