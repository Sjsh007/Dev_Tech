import { useEffect, useState } from "react";
import { useSession } from "../../context/SessionContext";
import ConceptHighlighter from "./ConceptHighlighter";
import BreadcrumbTrail from "./BreadcrumbTrail";
import { Volume2, X, Pin, Palette, BookOpen, Lightbulb, Search, Loader2 } from "lucide-react";

const DIFFICULTY_COLORS = {
  1: "#4ade80", // green  – very basic
  2: "#86efac", // light green – basic
  3: "#facc15", // yellow – intermediate
  4: "#fb923c", // orange – advanced
  5: "#f87171", // red   – very advanced
};

const DIFFICULTY_LABELS = {
  1: "Very Basic",
  2: "Basic",
  3: "Intermediate",
  4: "Advanced",
  5: "Very Advanced",
};

export default function ConceptPanel({ onConceptClick }) {
  const { activeNode, breadcrumb, panelOpen, closePanel } = useSession();
  const [rankedConcepts, setRankedConcepts] = useState([]);
  const [rankLoading, setRankLoading] = useState(false);

  // Fetch difficulty ranking whenever concepts change
  useEffect(() => {
    if (!activeNode?.concepts || activeNode.concepts.length === 0) {
      setRankedConcepts([]);
      return;
    }

    setRankLoading(true);
    fetch("/api/rank-concepts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ concepts: activeNode.concepts }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.ordered_learning_path) && data.ordered_learning_path.length > 0) {
          setRankedConcepts(data.ordered_learning_path);
        } else {
          // Fallback: show unranked
          setRankedConcepts(activeNode.concepts.map((c) => ({ concept: c, difficulty: 3, reason: "" })));
        }
      })
      .catch(() => {
        // On error, fallback to unranked original order
        setRankedConcepts(activeNode.concepts.map((c) => ({ concept: c, difficulty: 3, reason: "" })));
      })
      .finally(() => setRankLoading(false));
  }, [activeNode?.concepts]);

  if (!panelOpen || !activeNode) return null;

  const { explanation } = activeNode;

  const speak = (text) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  const fullText = [explanation?.overview, explanation?.explanation, explanation?.summary]
    .filter(Boolean)
    .join(". ");

  return (
    <div className="animate-slide-in-right h-full flex flex-col">
      {/* Panel Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-surface-border flex-shrink-0">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-0.5">Exploring</p>
          <h3 className="text-lg font-bold text-white">{activeNode.term}</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => speak(fullText)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-surface-hover hover:text-white transition-all"
            title="Read aloud"
          >
            <Volume2 size={18} />
          </button>
          <button
            onClick={closePanel}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-surface-hover hover:text-white transition-all"
            title="Close"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Breadcrumb */}
      {breadcrumb.length > 1 && (
        <div className="px-5 py-3 border-b border-surface-border flex-shrink-0">
          <BreadcrumbTrail />
        </div>
      )}

      {/* Explanation content */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {/* Overview */}
        {explanation?.overview && (
          <div className="response-section">
            <p className="section-label flex items-center gap-2"><Pin size={14} /> Overview</p>
            <p className="text-white text-sm leading-relaxed">{explanation.overview}</p>
          </div>
        )}

        {/* Visual Description */}
        {explanation?.imageDescription && (
          <div className="response-section">
            <p className="section-label flex items-center gap-2"><Palette size={14} /> Visual Explanation</p>
            <p className="text-gray-300 text-sm leading-relaxed italic">{explanation.imageDescription}</p>
          </div>
        )}

        {/* Detailed Explanation with highlighted concepts */}
        {explanation?.explanation && (
          <div className="response-section">
            <p className="section-label flex items-center gap-2"><BookOpen size={14} /> Explanation</p>
            <p className="text-gray-200 text-sm leading-relaxed">
              <ConceptHighlighter
                text={explanation.explanation}
                concepts={activeNode.concepts}
                onConceptClick={onConceptClick}
              />
            </p>
          </div>
        )}

        {/* Summary */}
        {explanation?.summary && (
          <div className="p-3 rounded-lg bg-brand-900/30 border border-brand-700/30">
            <p className="section-label flex items-center gap-2"><Lightbulb size={14} /> Key Takeaway</p>
            <p className="text-brand-200 text-sm font-medium leading-relaxed">{explanation.summary}</p>
          </div>
        )}

        {/* Explore more concepts — sorted easiest → hardest */}
        {activeNode.concepts && activeNode.concepts.length > 0 && (
          <div>
            <p className="section-label mb-3 flex items-center gap-2">
              <Search size={14} /> Explore Further
              {rankLoading && (
                <span className="ml-2 text-xs flex items-center gap-1 text-gray-500 font-normal">
                  <Loader2 size={12} className="animate-spin" /> sorting by difficulty…
                </span>
              )}
            </p>
            <div className="flex flex-wrap gap-2">
              {(rankedConcepts.length > 0 ? rankedConcepts : activeNode.concepts.map((c) => ({ concept: c, difficulty: 3, reason: "" }))).map(
                ({ concept, difficulty, reason }) => (
                  <button
                    key={concept}
                    onClick={() => onConceptClick(concept)}
                    className="concept-chip text-sm py-1 px-3"
                    title={reason ? `${DIFFICULTY_LABELS[difficulty] || "Intermediate"}: ${reason}` : concept}
                    style={{ position: "relative" }}
                  >
                    <span
                      style={{
                        display: "inline-block",
                        width: 7,
                        height: 7,
                        borderRadius: "50%",
                        backgroundColor: DIFFICULTY_COLORS[difficulty] || DIFFICULTY_COLORS[3],
                        marginRight: 5,
                        verticalAlign: "middle",
                        flexShrink: 0,
                      }}
                    />
                    {concept}
                  </button>
                )
              )}
            </div>
            {/* Legend */}
            {!rankLoading && rankedConcepts.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
                {Object.entries(DIFFICULTY_COLORS).map(([level, color]) => (
                  <span key={level} className="flex items-center gap-1 text-xs text-gray-500">
                    <span style={{ display: "inline-block", width: 7, height: 7, borderRadius: "50%", backgroundColor: color }} />
                    {DIFFICULTY_LABELS[level]}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
