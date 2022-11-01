import Calendar from "./Calendar";

function EventForm() {
  return (
    <section className="lg:container mx-auto p-5">
      <h2 className="text-3xl">
        Create an Event
      </h2>
      <form className="p-5">
        <input type="text" id="event-name" className="rounded-md text-xl" />
        <label htmlFor="event-name" className="font-bold">
          Event Name
        </label>
        <Calendar />
        <button type="submit">
          Create
        </button>
      </form>
    </section>
  );
}

export default EventForm;