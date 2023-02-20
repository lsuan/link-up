import {
  FontAwesomeIcon,
  type FontAwesomeIconProps,
} from "@fortawesome/react-fontawesome";
import { signIn } from "next-auth/react";

function AuthIcon({ icon, type }: FontAwesomeIconProps) {
  return (
    // FIXME: figure out why sometimes the icons look really big on load
    <FontAwesomeIcon
      icon={icon}
      className="cursor-pointer rounded-lg bg-blue-500 p-3 text-2xl text-black hover:bg-blue-300"
      onClick={() => signIn(type, { callbackUrl: "/dashboard" })}
    />
  );
}

export default AuthIcon;
