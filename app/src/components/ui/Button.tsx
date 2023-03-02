import { cva, type VariantProps } from "cva";
import Link from "next/link";
import {
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type ClassAttributes,
} from "react";
import { FiRotateCw } from "react-icons/fi";

const buttonStyles = cva(
  "group flex justify-center items-center rounded-lg text-lg p-4 text-white transition-all gap-2 font-inter leading-none",
  {
    variants: {
      intent: {
        primary: "bg-brand-500 hover:bg-brand-800 font-semibold",
        primaryDisabled: "bg-disabled-400 font-semibold",
        secondary:
          "bg-white border border-brand-500 hover:border-brand-800 font-medium",
        secondaryDisabled:
          "border border-disabled-400 text-disabled-400 cursor-not-allowed font-medium",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      intent: "primary",
    },
  }
);

type ButtonProps = {
  isLoading?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement> &
  ClassAttributes<HTMLButtonElement> &
  AnchorHTMLAttributes<HTMLAnchorElement> &
  VariantProps<typeof buttonStyles>;

/** Separate props that isolate links only for child component `ButtonLink` */
type ButtonLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> &
  VariantProps<typeof buttonStyles>;

function ButtonLink({ intent, fullWidth, children, ...rest }: ButtonLinkProps) {
  const isInternal = rest.href?.startsWith("/");
  return (
    <>
      {isInternal && (
        <Link
          href={rest.href as string}
          className={buttonStyles({ intent, fullWidth })}
          {...rest}
        >
          {children}
        </Link>
      )}
      {!isInternal && (
        <a
          href={rest.href as string}
          className={buttonStyles({ intent, fullWidth })}
          {...rest}
        >
          {children}
        </a>
      )}
    </>
  );
}

function Button({
  intent,
  fullWidth,
  isLoading,
  children,
  ...rest
}: ButtonProps) {
  const isLink = "href" in rest;

  if (isLink) {
    return (
      <ButtonLink intent={intent} fullWidth={fullWidth} {...rest}>
        {children}
      </ButtonLink>
    );
  }

  return (
    <button className={buttonStyles({ intent, fullWidth })} {...rest}>
      {isLoading ? (
        <>
          <FiRotateCw className="animate-spin" />
          <span>Submitting...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}

export default Button;
