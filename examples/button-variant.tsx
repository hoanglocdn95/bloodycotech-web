import type { ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  onClick?: () => void;
} & ({ variant: "primary"; shortcut?: string } | { variant: "quiet" });

export function Button(props: ButtonProps) {
  if (props.variant === "primary") {
    return (
      <button type="button" onClick={props.onClick}>
        {props.children}
        {props.shortcut ? <kbd>{props.shortcut}</kbd> : null}
      </button>
    );
  }

  return (
    <button type="button" onClick={props.onClick}>
      {props.children}
    </button>
  );
}
