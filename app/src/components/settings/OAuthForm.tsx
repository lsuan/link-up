import {
  faDiscord,
  faGoogle,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Account, User } from "@prisma/client";
import { useState } from "react";
import { SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { trpc } from "../../utils/trpc";
import { Form } from "../form/Form";
import ServerSideSuccessMessage from "../form/ServerSideSuccessMessage";

type OAuthFormInputs = {
  firstName: string;
  lastName?: string;
};

type UserWithAccount = User & {
  accounts: Account[];
};

const OAuthFormSchema = z.object({
  firstName: z.string().min(1, "First name is required!"),
  lastName: z.string().nullish().optional(),
});

const providers = {
  discord: faDiscord,
  google: faGoogle,
  twitter: faTwitter,
};

function OAuthForm(user: UserWithAccount) {
  const { id, firstName, lastName, accounts } = user;
  // users can only have 1 account
  const provider = accounts[0]?.provider as keyof typeof providers;
  const [defaultValues, setDefaultValues] = useState<OAuthFormInputs>({
    firstName,
    lastName: lastName ?? "",
  });
  const { mutateAsync } = trpc.user.updateUserWithAccountProvider.useMutation();
  const [successMessage, setSuccessMessage] = useState<string>("");

  const handleSubmit: SubmitHandler<OAuthFormInputs> = async (data) => {
    const response = await mutateAsync({ ...data });

    if (response.success) {
      setDefaultValues({ ...data });
      setSuccessMessage(response.success.message);
    }
  };

  return (
    <>
      {successMessage !== "" && (
        <ServerSideSuccessMessage message={successMessage} />
      )}
      <Form<OAuthFormInputs, typeof OAuthFormSchema>
        onSubmit={handleSubmit}
        schema={OAuthFormSchema}
        className="flex flex-col gap-4"
        defaultValues={defaultValues}
      >
        <div className="flex items-center gap-2 rounded-lg bg-indigo-500 p-4">
          <FontAwesomeIcon icon={providers[provider]} />
          <p>{`Your account has been linked with ${provider
            .charAt(0)
            .toUpperCase()}${provider.slice(1)}.`}</p>
        </div>
        <Form.Input
          name="firstName"
          type="text"
          displayName="First Name"
          required
        />
        <Form.Input
          name="lastName"
          type="text"
          displayName="Last Name"
          required
        />
        <Form.Button type="submit" name="Save Changes" />
      </Form>
    </>
  );
}
export default OAuthForm;
