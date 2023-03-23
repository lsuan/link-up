import Button from "@ui/Button";
import { signIn } from "next-auth/react";
import { FaDiscord } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

function AuthProviders() {
  return (
    <div className="flex flex-col justify-center gap-4">
      <Button
        intent="auth"
        onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
      >
        <FcGoogle />
        Login with Google
      </Button>
      <Button
        intent="auth"
        onClick={() => signIn("discord", { callbackUrl: "/dashboard" })}
      >
        <FaDiscord color="#5865F2" />
        Login with Discord
      </Button>
    </div>
  );
}

export default AuthProviders;
