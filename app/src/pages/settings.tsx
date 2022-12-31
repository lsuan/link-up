import { useSession } from "next-auth/react";
import { User } from "prisma/prisma-client";
import { useEffect, useState } from "react";
import { SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { Form } from "../components/form/Form";
import ServerSideErrorMessage from "../components/form/ServerSideErrorMessage";
import ServerSideSuccessMessage from "../components/form/ServerSideSuccessMessage";
import { trpc } from "../utils/trpc";

type SettingsInputs = {
  firstName: string;
  lastName: string;
  email?: string;
  passwords?: {
    password: string;
    confirmPassword: string;
  };
};

type SettingsResponse = {
  user: User | null;
  success?: {
    message: string;
  };
  trpcError?: {
    name: string;
    code: string;
    message: string;
  };
};

// FIXME: use a different schema for oauth users?
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
    { id: data?.user?.id as string },
    { enabled: data?.user !== undefined }
  );
  const updateUser = trpc.user.updateUser.useMutation();
  const [formValues, setFormValues] = useState<Record<string, any>>({
    ...user.data,
    passwords: {
      password: user.data?.password,
      confirmPassword: user.data?.password,
    },
  });
  const [invalidEmailMessage, setInvalidEmailMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  const onSubmit: SubmitHandler<SettingsInputs> = async (data) => {
    const id = user.data?.id as string;
    const res: SettingsResponse = await updateUser.mutateAsync({ id, ...data });
    if (res.trpcError) {
      setInvalidEmailMessage(res.trpcError.message);
    } else {
      setFormValues(res.user as User);
      setSuccessMessage(res.success?.message || "");
    }
  };

  useEffect(() => {
    setFormValues({
      ...user.data,
      passwords: {
        password: user.data?.password,
        confirmPassword: user.data?.password,
      },
    });
  }, [user.data !== undefined]);

  // TODO: add a way to update profile pic
  return (
    <section>
      <h1 className="mb-12 text-3xl font-semibold">Settings</h1>
      {user === undefined ? (
        <div>Loading...</div>
      ) : (
        <>
          {invalidEmailMessage !== "" && (
            <ServerSideErrorMessage error={invalidEmailMessage} />
          )}{" "}
          {successMessage !== "" && (
            <ServerSideSuccessMessage message={successMessage} />
          )}
          <Form<SettingsInputs, typeof SettingsSchema>
            onSubmit={onSubmit}
            schema={SettingsSchema}
            defaultValues={formValues}
            className="flex flex-col gap-4"
          >
            <Form.Input
              name="firstName"
              displayName="First Name"
              type="text"
              required={true}
            />
            <Form.Input name="lastName" displayName="Last Name" type="text" />

            {/* as of now if user has an account reference, then the user logged in with oauth */}
            {/* might get rid of this check... need to ask lindsey */}
            {user.data?.accounts.length === 0 && (
              <>
                <Form.Input
                  name="email"
                  displayName="Email"
                  type="email"
                  required={true}
                />

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
              </>
            )}

            {/* add light/dark mode toggle here */}

            <Form.Submit name="Save Changes" type="submit" />
          </Form>
        </>
      )}
    </section>
  );
}

export default Settings;
