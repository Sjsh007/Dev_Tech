import { Volume2, Pin, Palette, BookOpen, Lightbulb, Search } from "lucide-react";
import ConceptHighlighter from "../concepts/ConceptHighlighter";

export default function AnswerPanel({ question, answer, concepts, onConceptClick }) {
  if (!answer) return null;

  const speak = (text) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  const fullText = [answer?.overview, answer?.explanation, answer?.summary].filter(Boolean).join(". ");

  return (
    <div className="w-full max-w-3xl mx-auto glass-card animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between p-5 pb-3 border-b border-surface-border">
        <div className="flex-1">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Your Question</p>
          <h2 className="text-white font-semibold text-base leading-snug">{question}</h2>
        </div>
        <button
          onClick={() => speak(fullText)}
          className="ml-3 w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-surface-hover hover:text-white transition-all flex-shrink-0"
          title="Read aloud"
        >
          <Volume2 size={18} />
        </button>
      </div>

      <div className="p-5 space-y-4">
        {/* Service Error Alert */}
        {answer?.overview?.includes("Error") && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            <p className="font-semibold mb-1">AI Service Unavailable</p>
            <p className="opacity-80">We're having trouble connecting to the AI models. Please ensure your API keys (GROQ_API_KEY or OPENAI_API_KEY) are correctly set in the backend .env file.</p>
          </div>
        )}

        {/* Overview */}
        {answer?.overview && !answer.overview.includes("Error") && (
          <div className="response-section">
            <p className="section-label flex items-center gap-2"><Pin size={14} /> Overview</p>
            <p className="text-white text-sm leading-relaxed font-medium">
              <ConceptHighlighter
                text={answer.overview}
                concepts={concepts}
                onConceptClick={onConceptClick}
              />
            </p>
          </div>
        )}

        {/* Image / Visual Description */}
        {answer?.imageDescription && (
          <div className="response-section">
            <p className="section-label flex items-center gap-2"><Palette size={14} /> Visual Explanation</p>
            <p className="text-gray-300 text-sm leading-relaxed italic">
              {answer.imageDescription}
            </p>
          </div>
        )}

        {/* Detailed Explanation */}
        {answer?.explanation && (
          <div className="response-section">
            <p className="section-label flex items-center gap-2"><BookOpen size={14} /> Detailed Explanation</p>
            <p className="text-gray-200 text-sm leading-relaxed">
              <ConceptHighlighter
                text={answer.explanation}
                concepts={concepts}
                onConceptClick={onConceptClick}
              />
            </p>
          </div>
        )}

        {/* Summary / Gist */}
        {answer?.summary && (
          <div className="p-4 rounded-xl bg-brand-900/30 border border-brand-700/30">
            <p className="section-label flex items-center gap-2"><Lightbulb size={14} /> Key Takeaway</p>
            <p className="text-brand-200 text-sm font-medium leading-relaxed">{answer.summary}</p>
          </div>
        )}

        {/* Concept Chips */}
        {concepts && concepts.length > 0 && (
          <div className="pt-2">
            <p className="section-label flex items-center gap-2 mb-3"><Search size={14} /> Click to Explore Concepts</p>
            <div className="flex flex-wrap gap-2">
              {concepts.map((c) => (
                <button
                  key={c}
                  onClick={() => onConceptClick(c)}
                  className="concept-chip text-sm"
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
