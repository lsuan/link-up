import Typography from "@ui/Typography";
import Link from "next/link";

interface FormFooterProps {
  page: "login" | "signup";
}

function FormFooter({ page }: FormFooterProps) {
  return (
    <footer className="flex items-center justify-center gap-2 text-center">
      {page === "login" && (
        <>
          <Typography className="text-neutral-200">
            Don&apos;t have an account?{" "}
          </Typography>
          <span>
            {/* TODO: replace with custom link component */}
            <Link href="/signup">Sign up</Link>
          </span>
        </>
      )}
    </footer>
  );
}

export default FormFooter;
