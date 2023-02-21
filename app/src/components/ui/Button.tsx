// eslint-disable-next-line import/no-extraneous-dependencies
import { cva, type VariantProps } from "cva";
import { type ButtonHTMLAttributes } from "react";

const buttonStyles = cva(
  "flex justify-center items-center rounded-lg font-inter font-semibold text-lg p-4 w-full",
  {
    variants: {
      intent: {
        primary: "bg-primary-purple-900 hover:bg-primary-purple-700",
        secondary:
          "bg-white border border-primary-purple-900 hover:border-primary-purple-700",
        disabled: "border-disabled-400",
      },
    },
  }
);

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonStyles>;

function Button({ intent, children, ...rest }: ButtonProps) {
  return (
    <button className={buttonStyles({ intent })} {...rest}>
      {children}
    </button>
  );
}

export default Button;
