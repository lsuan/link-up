import Typography from "@ui/Typography";

function ScheduleHeader({
  title,
  scheduleName,
}: {
  title: string;
  scheduleName: string;
}) {
  return (
    <header className="mb-12">
      <Typography intent="h1">{title}</Typography>
      <Typography intent="h4">{`for ${scheduleName}`}</Typography>
    </header>
  );
}

export default ScheduleHeader;
