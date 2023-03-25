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
        <span>
          <FcGoogle />
        </span>
        Login with Google
      </Button>
      <Button
        intent="auth"
        onClick={() => signIn("discord", { callbackUrl: "/dashboard" })}
      >
        <span>
          <FaDiscord color="#5865F2" />
        </span>
        Login with Discord
      </Button>
    </div>
  );
}

export default AuthProviders;
