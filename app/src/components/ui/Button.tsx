import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// eslint-disable-next-line import/no-extraneous-dependencies
import { cva, type VariantProps } from "cva";
import Link from "next/link";
import { type AnchorHTMLAttributes, type ButtonHTMLAttributes } from "react";

const buttonStyles = cva(
  "group flex justify-center items-center rounded-lg font-semibold text-lg p-4 text-white transition-all gap-2 font-inter",
  {
    variants: {
      intent: {
        primary: "bg-brand-900 hover:bg-brand-700",
        primaryDisabled: "bg-disabled-400",
        secondary: "bg-white border border-brand-900 hover:border-brand-700",
        secondaryDisabled:
          "border border-disabled-400 text-disabled-400 cursor-not-allowed",
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
  AnchorHTMLAttributes<HTMLAnchorElement> &
  VariantProps<typeof buttonStyles>;

function Button({
  intent,
  fullWidth,
  isLoading,
  children,
  ...rest
}: ButtonProps) {
  const isLink = "href" in rest;
  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      {isLink ? (
        <Link
          href={rest.href as string}
          className={buttonStyles({ intent, fullWidth })}
          {...rest}
        >
          {children}
        </Link>
      ) : (
        <button className={buttonStyles({ intent, fullWidth })} {...rest}>
          {isLoading ? (
            <>
              <FontAwesomeIcon icon={faCircleNotch} className="animate-spin" />
              <span>Submitting...</span>
            </>
          ) : (
            children
          )}
        </button>
      )}
    </>
  );
}

export default Button;
