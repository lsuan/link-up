import { cva, type VariantProps } from "cva";
import { type ReactNode } from "react";

interface PageContainerProps extends VariantProps<typeof pageContainerStyles> {
  children: ReactNode;
  className?: string;
}

const pageContainerStyles = cva(
  "flex h-full w-full flex-grow flex-col justify-between px-8"
);

/** This is the main page container that wraps all of the main elements. */
function PageContainer({ children, className }: PageContainerProps) {
  return (
    <section className={pageContainerStyles({ className })}>{children}</section>
  );
}

export default PageContainer;
