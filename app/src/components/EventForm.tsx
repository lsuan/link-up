import Link from "next/link";
import Calendar from "./Calendar";

// TODO: Implement react-hook-form
function EventForm() {
  return (
    <section className="mx-auto p-5 lg:container">
      <form className="p-5">
        <input type="text" id="event-name" className="rounded-md text-xl" />
        <label htmlFor="event-name" className="font-bold">
          Event Name
        </label>
        <Calendar />
        {/* TODO: Change this back to a submit button */}
        <Link href="/event">Create</Link>
      </form>
    </section>
  );
}

export default EventForm;
