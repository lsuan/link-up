import { User } from "prisma/prisma-client";
import { useState } from "react";
import { SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { EMAIL_REGEX } from "../../utils/formUtils";
import { trpc } from "../../utils/trpc";
import { Form } from "../form/Form";
import ServerSideErrorMessage from "../form/ServerSideErrorMessage";
import ServerSideSuccessMessage from "../form/ServerSideSuccessMessage";

type EmailCredentialsInputs = {
  firstName: string;
  lastName?: string;
  email: string;
  // passwords: {
  //   password: string;
  //   confirmPassword: string;
  // };
};

const EmailCredentialsSchema = z.object({
  firstName: z.string().min(1, "First name is required!"),
  lastName: z.string().nullish().optional(),
  email: z
    .string()
    .min(1, "Email is required!")
    .email("Invalid email!")
    .refine((email) => email.match(EMAIL_REGEX)),
  // passwords: z
  //   .object({
  //     password: z.string().min(1, "Password is required!"),
  //     confirmPassword: z.string().min(1, "Password is required!"),
  //   })
  //   .refine((data) => data.password === data.confirmPassword, {
  //     message: "Passwords don't match!",
  //   }),
});

function EmailCredentialsForm(user: User) {
  const { id, firstName, lastName, email, password } = user;
  const { mutateAsync } = trpc.user.updateUserEmailCredentials.useMutation();
  const [formValues, setFormValues] = useState<Record<string, any>>({
    id,
    firstName,
    lastName,
    email,
    passwords: {
      password: password,
      confirmPassword: password,
    },
  });
  const [invalidEmailMessage, setInvalidEmailMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  const onSubmit: SubmitHandler<EmailCredentialsInputs> = async (data) => {
    const res = await mutateAsync({
      ...data,
      // password: data.passwords.password,
    });
    if (res.trpcError) {
      setInvalidEmailMessage(res.trpcError.message);
    } else {
      setFormValues(res.user as User);
      setSuccessMessage(res.success.message);
    }
  };

  return (
    <>
      {invalidEmailMessage !== "" && (
        <ServerSideErrorMessage error={invalidEmailMessage} />
      )}{" "}
      {successMessage !== "" && (
        <ServerSideSuccessMessage message={successMessage} />
      )}
      <Form<EmailCredentialsInputs, typeof EmailCredentialsSchema>
        onSubmit={onSubmit}
        schema={EmailCredentialsSchema}
        defaultValues={formValues}
        className="flex flex-col gap-4"
      >
        <Form.Input
          name="firstName"
          displayName="First Name"
          type="text"
          required
        />
        <Form.Input name="lastName" displayName="Last Name" type="text" />
        <Form.Input name="email" displayName="Email" type="email" required />
        {/* TODO: add a different flow for changing password */}
        {/* <Form.Password name="passwords.password" required />
        <Form.Input
          name="passwords.confirmPassword"
          displayName="Confirm Password"
          type="password"
          required
        /> */}

        {/* TODO: add light/dark mode toggle here */}

        <Form.Button name="Save Changes" type="submit" />
      </Form>
    </>
  );
}

export default EmailCredentialsForm;
