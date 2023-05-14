import { cva, type VariantProps } from "cva";
import Link from "next/link";
import { type AnchorHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

const HyperLinkStyles = cva(
  "transition-all font-inter px-1 py-0.5 border-2 rounded border-transparent text-base font-semibold underline underline-offset-2",
  {
    variants: {
      intent: {
        default: "text-brand-600 hover:text-brand-800 active:text-brand-900 focus:text-brand-600 focus:border-brand-600",
        disabled: "text-disabled-400",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      intent: "default",
    },
  }
);

type HyperLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> &
  VariantProps<typeof HyperLinkStyles>;

function HyperLink({
  intent,
  fullWidth,
  children,
  className,
  ...rest
}: HyperLinkProps) {
  const isInternal = rest.href?.startsWith("/");
  return (
    <>
      {isInternal && (
        <Link
          href={rest.href as string}
          {...rest}
        >
          <span
            className={twMerge(HyperLinkStyles({ intent, fullWidth, className }))}
          >
            {children}
          </span>
        </Link>
      )}
      {!isInternal && (
        <a
          href={rest.href as string}
          {...rest}
        >
          <span
            className={twMerge(HyperLinkStyles({ intent, fullWidth, className }))}
          >
            {children}
          </span>
        </a>
      )}
    </>
  );
}

export default HyperLink;
