import { useSession } from "next-auth/react";
import EmailCredentialsForm from "../components/settings/EmailCredentialsForm";
import OAuthForm from "../components/settings/OAuthForm";
import BackArrow from "../components/shared/BackArrow";
import Loading from "../components/shared/Loading";
import Unauthenticated from "../components/shared/Unauthenticated";
import { trpc } from "../utils/trpc";

function Settings() {
  const { status, data } = useSession();
  const user = trpc.user.getUser.useQuery(
    { id: data?.user?.id as string },
    { enabled: status === "authenticated", refetchOnWindowFocus: false }
  );

  if (status === "loading" || user.data === undefined) {
    return <Loading />;
  }

  if (status === "unauthenticated") {
    return <Unauthenticated />;
  }
  const hasAccount = user.data?.accounts.length ?? 0 > 0;

  // TODO: add a way to update profile pic
  return (
    <section className="px-8">
      <BackArrow href="/dashboard" page="Dashboard" />
      <h1 className="mb-12 text-3xl font-semibold">Settings</h1>
      {hasAccount ? (
        <>{user.data && <OAuthForm {...user.data} />}</>
      ) : (
        <>{user.data && <EmailCredentialsForm {...user.data} />}</>
      )}
    </section>
  );
}

export default Settings;
