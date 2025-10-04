import React from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "default" | "danger";
  className?: string;
};

export default function Button({ variant = "default", className = "", children, ...rest }: Props) {
  const clazz = ["btn", variant === "primary" && "primary", variant === "danger" && "danger", className]
    .filter(Boolean)
    .join(" ");
  return (
    <button className={clazz} {...rest}>
      {children}
    </button>
  );
}
