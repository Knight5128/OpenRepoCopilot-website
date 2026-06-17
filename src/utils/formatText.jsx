import { Fragment } from "react";

/**
 * Render a string with inline `code` and **bold** markers into React nodes.
 * Content is trusted (authored in src/data), so a simple two-pass split is fine.
 */
export function formatText(input) {
  if (input == null) return null;
  // Split on backtick code spans first, keeping the delimiters.
  const codeParts = String(input).split(/(`[^`]+`)/g);
  return codeParts.map((part, i) => {
    if (part.startsWith("`") && part.endsWith("`")) {
      return <code key={i}>{part.slice(1, -1)}</code>;
    }
    // Then handle **bold** within the non-code text.
    const boldParts = part.split(/(\*\*[^*]+\*\*)/g);
    return (
      <Fragment key={i}>
        {boldParts.map((b, j) =>
          b.startsWith("**") && b.endsWith("**") ? (
            <strong key={j}>{b.slice(2, -2)}</strong>
          ) : (
            <Fragment key={j}>{b}</Fragment>
          ),
        )}
      </Fragment>
    );
  });
}
