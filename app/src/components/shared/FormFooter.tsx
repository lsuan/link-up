import Typography from "@ui/Typography";
import HyperLink from "@ui/Hyperlink";

interface FormFooterProps {
  page: "login" | "signup";
}

function FormFooter({ page }: FormFooterProps) {
  return (
    <footer className="flex w-full flex-wrap items-center justify-center gap-1 self-end px-2 text-center">
      {page === "login" && (
        <>
          <Typography className="text-neutral-200">
            Don&apos;t have an account?{" "}
          </Typography>
          <span>
            <HyperLink href="/signup">Sign Up</HyperLink>
          </span>
        </>
      )}
      {page === "signup" && (
        <>
          <Typography className="text-neutral-200">
            Already have an account?
          </Typography>
          <span>
            <HyperLink href="/login">Log In</HyperLink>
          </span>
        </>
      )}
    </footer>
  );
}

export default FormFooter;
