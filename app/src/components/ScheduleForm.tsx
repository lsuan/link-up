import Link from "next/link";
import Calendar from "./Calendar";

// TODO: Implement react-hook-form
function ScheduleForm() {
  return (
    <section className="mx-auto p-5 lg:container">
      <form className="p-5">
        <input type="text" id="event-name" className="rounded-lg text-xl" />
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

export default ScheduleForm;
