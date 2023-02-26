import { notice } from "@ui/Snackbar";
import { atom, useAtom } from "jotai";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { handleGoogleCalendar } from "../../utils/addToCalendarUtils";

export const googleAccessToken = atom<string>("");

function GoogleCalendarRedirect() {
  const router = useRouter();
  const [, setGoogleAccessTokenValue] = useAtom(googleAccessToken);
  const [, setNoticeMessage] = useAtom(notice);

  useEffect(() => {
    const response = router.asPath.split("#")[1];
    const params = response?.split("&");
    const paramsMap = new Map<string, string>();
    params?.forEach((field) => {
      const [name, value] = field.split("=") as [string, string];
      if (name === "state") {
        const decoded = decodeURIComponent(value);
        // state fields are encoded, so they need to be decoded and added back to the map
        decoded.split("&").forEach((currentField) => {
          const [currentName, currentValue] = currentField.split("=") as [
            string,
            string
          ];
          paramsMap.set(currentName, currentValue);
        });
      } else {
        paramsMap.set(name, value);
      }
    });

    const accessToken = paramsMap.get("access_token") as string;
    setGoogleAccessTokenValue(accessToken);
    const slug = paramsMap.get("slug");
    const name = paramsMap.get("name") as string;
    const date = paramsMap.get("date") as string;
    const description = paramsMap.get("description") as string;
    const startTime = paramsMap.get("startTime") as string;
    const endTime = paramsMap.get("endTime") as string;
    const location = paramsMap.get("location") as string;

    const getGoogleCalendarResponse = async () => {
      const googleResponse = await handleGoogleCalendar(
        accessToken,
        name,
        date,
        description,
        startTime,
        endTime,
        location
      );

      return googleResponse;
    };
    const googleResponse = getGoogleCalendarResponse();

    if (Object.keys(googleResponse).includes("error")) {
      console.log("Error", googleResponse);
    } else {
      setNoticeMessage(`Event "${name}" was saved to Google Calendar.`);
      router.replace(`/schedule/${slug}`);
    }
  });

  return <div>Adding event to Google Calendar...</div>;
}

export default GoogleCalendarRedirect;
