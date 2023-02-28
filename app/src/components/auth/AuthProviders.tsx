import Button from "@ui/Button";
import { signIn } from "next-auth/react";
import { BsDiscord, BsGoogle } from "react-icons/bs";

function AuthProviders() {
  return (
    <div className="flex justify-center gap-8">
      <Button onClick={() => signIn("discord", { callbackUrl: "/dashboard" })}>
        <BsDiscord />
      </Button>

      <Button onClick={() => signIn("google", { callbackUrl: "/dashboard" })}>
        <BsGoogle />
      </Button>
    </div>
  );
}

export default AuthProviders;
