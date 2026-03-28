/**
 * Wraps text and converts concept terms into clickable highlighted spans.
 * Terms are matched case-insensitively with word boundaries.
 */
export default function ConceptHighlighter({ text, concepts, onConceptClick }) {
  if (!text || !concepts || concepts.length === 0) {
    return <span>{text}</span>;
  }

  // Escape regex special characters and build alternation pattern
  const escaped = concepts.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const pattern = new RegExp(`\\b(${escaped.join("|")})\\b`, "gi");

  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    parts.push({ term: match[0], key: `${match[0]}-${match.index}` });
    lastIndex = pattern.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return (
    <>
      {parts.map((part, i) =>
        typeof part === "string" ? (
          <span key={i}>{part}</span>
        ) : (
          <button
            key={part.key}
            onClick={() => onConceptClick(part.term)}
            className="concept-chip"
            title={`Explore: ${part.term}`}
          >
            {part.term}
          </button>
        )
      )}
    </>
  );
}
