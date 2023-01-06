import AvailabilityTable from "../../../components/schedule/AvailbilityTable";
import BackArrow from "../../../components/shared/BackArrow";

function Availability() {
  return (
    <section className="px-8">
      <BackArrow href="/schedule/schedule" page="Schedule" />
      <AvailabilityTable />
    </section>
  );
}

export default Availability;
