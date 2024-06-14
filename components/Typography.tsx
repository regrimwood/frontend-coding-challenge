import { PropsWithChildren } from "react";

interface Props {
  variant?: "h1" | "h2" | "h3" | "h4" | "body1" | "body2" | "button";
  className?: string;
}

export default function Typography(props: PropsWithChildren<Props>) {
  const { variant = "body1", className, children } = props;

  switch (variant) {
    case "h1":
      return (
        <h1
          className={`${
            className ?? ""
          } text-5xl md:text-8xl font-medium tracking-tighter leading-tight md:leading-tight`}
        >
          {children}
        </h1>
      );
    case "h2":
      return (
        <h2
          className={`${className ?? ""} text-2xl md:text-4xl tracking-tight`}
        >
          {children}
        </h2>
      );
    case "h3":
      return (
        <h3
          className={`${
            className ?? ""
          } text-lg md:text-xl font-medium leading-snug tracking-tight`}
        >
          {children}
        </h3>
      );
    case "h4":
      return (
        <h4 className={`${className ?? ""} text-lg md:text-xl tracking-tight`}>
          {children}
        </h4>
      );
    case "body1":
      return (
        <p className={`${className ?? ""} text-lg tracking-tight`}>
          {children}
        </p>
      );
    case "body2":
      return (
        <p className={`${className ?? ""} text-base tracking-tight`}>
          {children}
        </p>
      );
    case "button":
      return (
        <button className={`${className ?? ""} text-lg tracking-tight`}>
          {children}
        </button>
      );
    default:
      return (
        <p className={`${className ?? ""} text-lg tracking-tight`}>
          {children}
        </p>
      );
  }
}
