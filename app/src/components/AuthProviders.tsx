import { faDiscord } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { signIn } from "next-auth/react";

function AuthProviders() {
  return (
    <>
      <div className="my-8 w-full text-center">- or -</div>
      <div className="flex justify-evenly">
        <FontAwesomeIcon
          icon={faDiscord}
          className="cursor-pointer rounded-lg bg-neutral-500 p-3 text-xl text-black"
          onClick={() =>
            signIn("discord", {
              callbackUrl: "/dashboard",
            })
          }
        />
      </div>
    </>
  );
}

export default AuthProviders;
