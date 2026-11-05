"use client";

import { useEffect, useRef, useState } from "react";

type PreProps = React.ComponentPropsWithoutRef<"pre"> & {
  "data-language"?: string;
};

export function CodeBlock({ children, ...props }: PreProps) {
  const preRef = useRef<HTMLPreElement>(null);
  const timeoutRef = useRef<number | null>(null);
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");
  const language = props["data-language"] ?? "code";

  useEffect(() => {
    return () => {
      if (timeoutRef.current != null) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  async function onCopy() {
    const text = preRef.current?.innerText ?? "";
    try {
      await navigator.clipboard.writeText(text);
      setStatus("copied");
    } catch {
      setStatus("error");
    }
    if (timeoutRef.current != null) window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => setStatus("idle"), 2000);
  }

  const label =
    status === "copied" ? "Đã chép" : status === "error" ? "Không chép được" : "Chép";

  return (
    <div className="code-block max-w-full min-w-0">
      <div className="code-toolbar">
        <span>{language}</span>
        <button type="button" onClick={onCopy}>
          {label}
        </button>
      </div>
      <pre ref={preRef} {...props}>
        {children}
      </pre>
      <span className="sr-only" aria-live="polite">
        {status === "copied" ? "Đã chép mã" : status === "error" ? "Không chép được mã" : ""}
      </span>
    </div>
  );
}
