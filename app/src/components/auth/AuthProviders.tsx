import { faDiscord, faGoogle } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { signIn } from "next-auth/react";
import AuthIcon from "./AuthIcon";

function AuthProviders() {
  return (
    <>
      <div className="my-8 w-full text-center">- or -</div>
      <div className="flex justify-center gap-8">
        <AuthIcon icon={faDiscord} type="discord" />
        <AuthIcon icon={faGoogle} type="google" />
      </div>
    </>
  );
}

export default AuthProviders;
