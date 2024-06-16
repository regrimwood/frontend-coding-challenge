import { PropsWithChildren } from "react";

interface Props {
  variant?:
    | "headline"
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "body1"
    | "body2"
    | "button";
  className?: string;
}

export default function Typography(props: PropsWithChildren<Props>) {
  const { variant = "body1", className, children } = props;

  switch (variant) {
    case "headline":
      return (
        <h1
          className={`${
            className ?? ""
          } text-5xl md:text-8xl font-medium tracking-tighter leading-tight md:leading-tight`}
        >
          {children}
        </h1>
      );
    case "h1":
      return (
        <h1
          className={`${
            className ?? ""
          } text-4xl md:text-6xl font-medium tracking-tighter leading-tighter md:leading-tighter`}
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
        <h4
          className={`${
            className ?? ""
          } font-medium text-base md:text-lg tracking-tight`}
        >
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
        <p className={`${className ?? ""} text-sm tracking-tight`}>
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
