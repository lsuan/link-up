import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { notice } from "@ui/Snackbar";
import { useAtom } from "jotai";
import { useCallback, useEffect } from "react";
import { FiX } from "react-icons/fi";
import { googleAccessToken } from "../../pages/schedule/google-oauth-redirect";
import { handleGoogleCalendar } from "../../utils/addToCalendarUtils";
import { type ScheduleEventCardProps } from "./ScheduleEventCard";

// TODO: move google calendar functionality to the backend
const GOOGLE_CLIENT_ID = "";
// const GOOGLE_CLIENT_ID = env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
const GOOGLE_SCOPE = "https://www.googleapis.com/auth/calendar";
const GOOGLE_SCRIPT_SOURCE = "https://accounts.google.com/gsi/client";
const GOOGLE_OAUTH_ENDPOINT = "https://accounts.google.com/o/oauth2/v2/auth";

// to prevent typescript error
type GoogleInitializeParams = {
  client_id: string;
  callback: Promise<void>;
};
declare const window: Window &
  typeof globalThis & {
    google: {
      accounts: {
        id: {
          initialize: (params: GoogleInitializeParams) => void;
          prompt: () => void;
        };
      };
    };
  };

function AddToCalendarModal({
  name,
  date,
  startTime,
  endTime,
  location,
  description,
  index,
  isAddToCalendarModalShown,
  setIsAddToCalendarModalShown,
  slug,
}: ScheduleEventCardProps) {
  const [googleAccessTokenValue] = useAtom(googleAccessToken);
  const [, setNoticeMessage] = useAtom(notice);

  const handleModalClose = useCallback(() => {
    const prev = isAddToCalendarModalShown.slice(0, index);
    const rest = isAddToCalendarModalShown.slice(index + 1);
    setIsAddToCalendarModalShown([...prev, false, ...rest]);
  }, [index, setIsAddToCalendarModalShown, isAddToCalendarModalShown]);

  useEffect(() => {
    window.onkeyup = (e) => {
      if (e.key === "Escape") {
        handleModalClose();
      }
    };
  }, [handleModalClose, isAddToCalendarModalShown]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = GOOGLE_SCRIPT_SOURCE;
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // TODO: handle access token when user signs in with google
  const handleGoogleSignIn = async () => {
    if (googleAccessTokenValue) {
      const dateString = date.toISOString().split("T")[0] as string;
      const googleResponse = await handleGoogleCalendar(
        googleAccessTokenValue,
        name,
        dateString,
        description ?? "",
        startTime,
        endTime,
        location ?? ""
      );

      if (Object.keys(googleResponse).includes("error")) {
        console.error("error", googleResponse);
      } else {
        setNoticeMessage(`Event ${name} has been saved to Google Calendar`);
      }
      return;
    }

    const params = {
      client_id: GOOGLE_CLIENT_ID,
      redirect_uri: "http://localhost:3000/schedule/google-oauth-redirect",
      response_type: "token",
      scope: GOOGLE_SCOPE,
      include_granted_scopes: "true",
      state: `slug=${slug}&name=${name}&description=${description ?? ""}&date=${
        date.toISOString().split("T")[0]
      }&startTime=${startTime}&endTime=${endTime}&location=${location ?? ""}`,
    };

    const form = document.getElementById("google-auth") as HTMLFormElement;
    Object.keys(params).forEach((field) => {
      const input = document.createElement("input");
      input.setAttribute("type", "hidden");
      input.setAttribute("name", field);
      input.setAttribute("value", params[field as keyof typeof params]);
      form.appendChild(input);
    });

    form.submit();
  };

  const handleAddToGoogleCalendar = () => {
    const { google } = window;
    google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleGoogleSignIn(),
    });
    google.accounts.id.prompt();
    handleModalClose();
  };

  return (
    <div className="absolute top-0 left-1/2 z-40 w-10/12 max-w-md -translate-x-1/2 rounded-lg border border-neutral-500 bg-neutral-900 p-6 transition-all">
      <header className="mb-6 flex justify-between">
        <h2 className="text-xl font-semibold">{`Add ${name} to Calendar`}</h2>
        <FiX
          className="cursor-pointer text-neutral-500 transition-colors hover:text-neutral-300"
          onClick={() => handleModalClose()}
        />
      </header>
      <button
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-neutral-500 p-2 transition-colors hover:bg-neutral-300 hover:text-black"
        onClick={() => handleAddToGoogleCalendar()}
      >
        <FontAwesomeIcon icon={faGoogle} />
        Google Calendar
      </button>
      <form
        id="google-auth"
        className="hidden"
        action={GOOGLE_OAUTH_ENDPOINT}
        method="GET"
      />
    </div>
  );
}

export default AddToCalendarModal;
