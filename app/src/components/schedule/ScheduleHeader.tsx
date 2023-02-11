function ScheduleHeader({
  title,
  scheduleName,
}: {
  title: string;
  scheduleName: string;
}) {
  return (
    <header className="mb-12">
      <h1 className="text-3xl font-semibold">{title}</h1>
      <h2 className="font-semibold">{`for ${scheduleName}`}</h2>
    </header>
  );
}

export default ScheduleHeader;
