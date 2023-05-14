import HyperLink from "@ui/Hyperlink";
import Typography from "@ui/Typography";

interface PublishedEventsNoteProps {
  slug: string;
}

function PublishedEventsNote({ slug }: PublishedEventsNoteProps) {
  return (
    <div className="mx-8 rounded-lg bg-neutral-300 p-4">
      <Typography>
        Events have already been published for this schedule! View them{" "}
        <span>
          {/* TODO: replace this with custom link component. */}
          <HyperLink href={`/schedule/${slug}`}>here</HyperLink>
        </span>
        .
      </Typography>
    </div>
  );
}

export default PublishedEventsNote;
