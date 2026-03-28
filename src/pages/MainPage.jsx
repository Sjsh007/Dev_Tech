import { useState, useCallback } from "react";
import LeftSidebar from "../components/layout/LeftSidebar";
import RightSidebar from "../components/layout/RightSidebar";
import TopBar from "../components/layout/TopBar";
import SearchBar from "../components/chat/SearchBar";
import AnswerPanel from "../components/chat/AnswerPanel";
import ConceptPanel from "../components/concepts/ConceptPanel";
import { useSession } from "../context/SessionContext";
import { RefreshCw, Brain, Search, AlertTriangle, X } from "lucide-react";

const WELCOME_LINES = [
  "What is quantum entanglement?",
  "How does the internet work?",
  "Explain machine learning simply.",
  "What is the theory of relativity?",
  "How does a blockchain work?",
];

export default function MainPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeCategory, setActiveCategory] = useState("Classroom");
  const [panelLoading, setPanelLoading] = useState(false);

  const {
    currentSession,
    startNewQuestion,
    exploreConcept,
    activeNode,
    breadcrumb,
    panelOpen,
  } = useSession();

  // Handle main question submission
  const handleSearch = useCallback(async (question) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/chat/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      startNewQuestion(question, data.answer, data.concepts || []);
    } catch (err) {
      setError(err.message || "Failed to get answer. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }, [startNewQuestion]);

  // Handle clicking a concept term (from answer or from panel)
  const handleConceptClick = useCallback(async (term) => {
    setPanelLoading(true);
    const contextChain = [
      currentSession?.question,
      ...breadcrumb.map((b) => b.term),
    ].filter(Boolean);

    try {
      const res = await fetch("/chat/expand", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ term, contextChain }),
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      exploreConcept(
        term,
        data.explanation,
        data.concepts || [],
        activeNode?.id || null
      );
    } catch (err) {
      setError(err.message || "Failed to load explanation.");
    } finally {
      setPanelLoading(false);
    }
  }, [currentSession, breadcrumb, activeNode, exploreConcept]);

  return (
    <div className="flex flex-col h-screen bg-surface-dark overflow-hidden">
      <TopBar />

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <LeftSidebar
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
        />

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden relative">
          {/* Content Area */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            {!currentSession ? (
              /* Welcome / Empty State */
              <div className="flex flex-col items-center justify-center h-full text-center animate-fade-in">
                <div className="w-20 h-20 rounded-3xl bg-brand-600/20 border border-brand-500/30 flex items-center justify-center mb-6 animate-pulse-glow">
                  <RefreshCw className="w-10 h-10 text-brand-400" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-3">
                  What do you want to understand?
                </h2>
                <p className="text-gray-500 text-sm max-w-md mb-8">
                  Ask any question. RUE will give you a structured answer, then let you click on any concept to explore it deeper — recursively — until you truly understand.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-xl w-full mb-8">
                  {WELCOME_LINES.map((s) => (
                    <button
                      key={s}
                      onClick={() => handleSearch(s)}
                      className="text-left p-3 rounded-xl bg-surface-card border border-surface-border hover:border-brand-600/50 
                                 hover:bg-surface-hover text-sm text-gray-400 hover:text-white transition-all"
                    >
                      "{s}"
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* Answer Display */
              <div className="flex gap-4 max-w-full">
                {/* Main answer column */}
                <div className={`transition-all duration-300 ${panelOpen ? "flex-1 min-w-0" : "w-full max-w-3xl mx-auto"}`}>
                  {loading ? (
                    <div className="glass-card p-8 text-center animate-pulse">
                      <div className="mb-4 flex justify-center"><Brain className="w-10 h-10 text-brand-400" /></div>
                      <p className="text-white font-semibold">Thinking deeply...</p>
                      <p className="text-gray-500 text-sm mt-2">Structuring your answer and extracting concepts</p>
                      <div className="mt-4 flex justify-center gap-1">
                        {[0, 1, 2].map((i) => (
                          <div
                            key={i}
                            className="w-2 h-2 bg-brand-500 rounded-full animate-bounce"
                            style={{ animationDelay: `${i * 150}ms` }}
                          />
                        ))}
                      </div>
                    </div>
                  ) : (
                    <AnswerPanel
                      question={currentSession.question}
                      answer={currentSession.answer}
                      concepts={currentSession.concepts}
                      onConceptClick={handleConceptClick}
                    />
                  )}
                </div>

                {/* Concept Panel — slides in on the right */}
                {panelOpen && (
                  <div className="w-96 flex-shrink-0 glass-card animate-slide-in-right overflow-hidden flex flex-col">
                    {panelLoading ? (
                      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                        <div className="mb-4 animate-spin flex justify-center"><Search className="w-8 h-8 text-brand-400" /></div>
                        <p className="text-white font-semibold text-sm">Exploring concept...</p>
                        <div className="mt-3 flex gap-1">
                          {[0, 1, 2].map((i) => (
                            <div
                              key={i}
                              className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-bounce"
                              style={{ animationDelay: `${i * 150}ms` }}
                            />
                          ))}
                        </div>
                      </div>
                    ) : (
                      <ConceptPanel 
                        onConceptClick={handleConceptClick} 
                      />
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Error message */}
            {error && (
              <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-red-500/90 text-white px-4 py-3 rounded-xl shadow-lg text-sm flex items-center gap-2 z-50">
                <AlertTriangle size={16} /> {error}
                <button onClick={() => setError("")} className="ml-3 text-white/70 hover:text-white flex items-center justify-center"><X size={14} /></button>
              </div>
            )}
          </div>

          {/* Search Bar — fixed at bottom */}
          <div className="px-6 pb-4 pt-3 border-t border-surface-border bg-surface-dark/90 backdrop-blur-sm flex-shrink-0">
            <SearchBar onSearch={handleSearch} loading={loading || panelLoading} />
          </div>
        </main>

        {/* Right Sidebar */}
        <RightSidebar />
      </div>
    </div>
  );
}
