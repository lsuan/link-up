import {
  faArrowRightLong,
  faClock,
  faLocationPin,
  faNoteSticky,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { createSlug } from "../../utils/scheduleSlugUtils";

type UnstartedProps = {
  id: string;
  name: string;
  description?: string | null;
};

function UnstartedCard({ id, name, description }: UnstartedProps) {
  const slug = createSlug(name, id);

  // TODO: figure out how to convert time by location
  return (
    <div className="flex flex-col gap-4 rounded-xl bg-neutral-700 p-4">
      <header className="relative flex items-start justify-between gap-2">
        <h3 className="w-9/12 text-lg">{name}</h3>
      </header>

      <ul className="flex flex-col gap-2 text-sm">
        <li className="flex items-start gap-2">
          <FontAwesomeIcon className="mt-[3px]" icon={faClock} />
          <p>TBD</p>
        </li>
        <li className="flex items-start gap-2">
          <FontAwesomeIcon className="mt-[3px] w-[14px]" icon={faLocationPin} />
          <p>TBD</p>
        </li>
        {description && (
          <li className="flex items-start gap-2">
            <FontAwesomeIcon
              className="mt-[3px] w-[14px]"
              icon={faNoteSticky}
            />
            <p className="line-clamp-2">{description}</p>
          </li>
        )}
      </ul>
      <Link
        href={`/schedule/${slug}`}
        className="group w-full rounded-lg bg-neutral-500 p-2 text-center text-white transition-all hover:bg-neutral-300 hover:text-black"
      >
        View
        <FontAwesomeIcon
          icon={faArrowRightLong}
          className="ml-2 transition-transform group-hover:translate-x-2"
        />
      </Link>
    </div>
  );
}

export default UnstartedCard;
