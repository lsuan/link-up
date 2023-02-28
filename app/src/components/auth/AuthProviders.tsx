import Button from "@ui/Button";
import { signIn } from "next-auth/react";
import { BsDiscord, BsGoogle } from "react-icons/bs";

function AuthProviders() {
  return (
    <div className="flex justify-center gap-8">
      <Button>
        <BsDiscord
          onClick={() => signIn("discord", { callbackUrl: "/dashboard" })}
        />
      </Button>

      <Button>
        <BsGoogle
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
        />
      </Button>
    </div>
  );
}

export default AuthProviders;
