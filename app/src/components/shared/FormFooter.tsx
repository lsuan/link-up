import Typography from "@ui/Typography";
import Link from "next/link";

interface FormFooterProps {
  page: "login" | "signup";
}

function FormFooter({ page }: FormFooterProps) {
  return (
    <footer className="absolute bottom-8 left-1/2 flex w-max -translate-x-1/2 items-center justify-center gap-1 text-center">
      {page === "login" && (
        <>
          <Typography className="text-neutral-200">
            Don&apos;t have an account?{" "}
          </Typography>
          <span>
            {/* TODO: replace with custom link component */}
            <Link href="/signup">Sign Up</Link>
          </span>
        </>
      )}
      {page === "signup" && (
        <>
          <Typography className="text-neutral-200">
            Already have an account?
          </Typography>
          <span>
            {/* TODO: replace with custom link component */}
            <Link href="/login">Log In</Link>
          </span>
        </>
      )}
    </footer>
  );
}

export default FormFooter;
