import {
  faClock,
  faLocationPin,
  faNoteSticky,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

function EventCard() {
  return (
    <div className="flex flex-col gap-4 rounded-xl bg-indigo-700 p-6">
      <h2 className="text-xl">New Year's Party: Happy New Year!</h2>
      <ul className="flex flex-col gap-2">
        <li className="flex gap-2">
          <div className="w-4 text-center">
            <FontAwesomeIcon icon={faClock} />
          </div>
          <p>December 31, 2022 | 8pm-12am</p>
        </li>
        <li className="flex gap-2">
          <div className="w-4 text-center">
            <FontAwesomeIcon icon={faLocationPin} />
          </div>
          <p>My House</p>
        </li>
        <li className="flex gap-2">
          <div className="w-4 text-center">
            <FontAwesomeIcon icon={faNoteSticky} />
          </div>
          <p>
            This is a potluck party so bring your own food, snacks, drinks, or
            utensils! The more food, the merrier! We will also be watching the
            Countdown. Event says until 12am, but y'all can leave whenever.
          </p>
        </li>
      </ul>
      <Link
        href={"/schedule"}
        className="w-full rounded-lg bg-indigo-500 p-2 text-center text-white hover:bg-indigo-300"
      >
        View
      </Link>
    </div>
  );
}

export default EventCard;
