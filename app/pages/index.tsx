import EventForm from "./components/EventForm";
import Navbar from "./components/Navbar"

export default function Home() {
  return (
    <div className="h-screen w-full bg-neutral-900 text-white px-8 py-3">
      <Navbar />
      <EventForm />
    </div>
  );
}