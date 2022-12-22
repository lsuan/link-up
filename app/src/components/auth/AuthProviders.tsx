import {
  faDiscord,
  faGoogle,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";
import AuthIcon from "./AuthIcon";

function AuthProviders() {
  return (
    <>
      <div className="flex justify-center gap-8">
        <AuthIcon icon={faDiscord} type="discord" />
        <AuthIcon icon={faGoogle} type="google" />
        <AuthIcon icon={faTwitter} type="twitter" />
      </div>
    </>
  );
}

export default AuthProviders;
