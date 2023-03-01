import { cva, type VariantProps } from "cva";
import { type HTMLAttributes } from "react";

const typographyStyles = cva("text-black transition-colors", {
  variants: {
    intent: {
      h1: "font-montserrat font-semibold text-[2.5rem] leading-10",
      h2: "font-montserrat font-semibold text-[2rem] leading-10",
      h3: "font-montserrat font-medium text-[1.75rem] leading-8",
      h4: "font-montserrat font-medium text-lg",
      p: "font-inter text-base",
    },
    brand: {
      true: "text-brand-700",
    },
    defaultVariants: {
      intent: "p",
    },
  },
});

type TextProps = HTMLAttributes<HTMLParagraphElement> &
  HTMLAttributes<HTMLHeadingElement> &
  VariantProps<typeof typographyStyles>;

function Typography({
  intent,
  brand,
  children,
  className,
  ...rest
}: TextProps) {
  // add `className` attribute to the styles to append any custom styles
  switch (intent) {
    case "h1":
      return (
        <h1
          className={typographyStyles({ intent, brand, className })}
          {...rest}
        >
          {children}
        </h1>
      );
    case "h2":
      return (
        <h2
          className={typographyStyles({ intent, brand, className })}
          {...rest}
        >
          {children}
        </h2>
      );
    case "h3":
      return (
        <h3
          className={typographyStyles({ intent, brand, className })}
          {...rest}
        >
          {children}
        </h3>
      );
    case "h4":
      return (
        <h4
          className={typographyStyles({ intent, brand, className })}
          {...rest}
        >
          {children}
        </h4>
      );
    case "p":
    default:
      return (
        <p className={typographyStyles({ intent, brand, className })} {...rest}>
          {children}
        </p>
      );
  }
}

export default Typography;
