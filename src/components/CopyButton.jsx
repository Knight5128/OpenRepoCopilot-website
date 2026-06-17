import { useState, useRef, useEffect } from "react";

export default function CopyButton({ text, label = "Copy" }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const onCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 1800);
    });
  };

  return (
    <button
      className={`copy-btn${copied ? " copied" : ""}`}
      type="button"
      onClick={onCopy}
      aria-label="复制命令"
    >
      {copied ? "Copied!" : label}
    </button>
  );
}
