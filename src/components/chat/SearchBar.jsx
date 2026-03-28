import { useState, useRef } from "react";
import { FileUp, Microscope, Globe, Book, Beaker, Mic, Sparkles, Check, ArrowUp } from "lucide-react";

const MODELS = ["Llama 3.3 70B"];
const TOOLS = [
  { icon: <Globe size={16} />, label: "Web Search" },
  { icon: <Book size={16} />, label: "Study / Learn" },
  { icon: <Beaker size={16} />, label: "Quiz Mode" },
];

export default function SearchBar({ onSearch, loading }) {
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState(MODELS[0]);
  const [isListening, setIsListening] = useState(false);
  const fileInputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim() && !loading) {
      onSearch(query.trim());
      setQuery("");
    }
  };

  const handleVoice = () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("Speech recognition not supported in this browser.");
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setQuery(transcript);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto">
      {/* Asterisk Menu */}
      {menuOpen && (
        <div className="absolute bottom-full mb-2 left-0 w-72 bg-surface-card border border-surface-border rounded-2xl shadow-2xl z-50 p-2 animate-fade-in">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 py-1.5">Add Context</p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-surface-hover text-gray-300 hover:text-white text-sm transition-all"
          >
            <FileUp size={16} /> Upload File or Image
          </button>
          <input ref={fileInputRef} type="file" className="hidden" />

          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-surface-hover text-gray-300 hover:text-white text-sm transition-all">
            <Microscope size={16} /> Deep Research
          </button>

          <div className="border-t border-surface-border my-1.5" />
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 py-1.5">AI Model</p>
          {MODELS.map((m) => (
            <button
              key={m}
              onClick={() => { setSelectedModel(m); setMenuOpen(false); }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-all
                ${selectedModel === m
                  ? "bg-brand-700/30 text-brand-300"
                  : "hover:bg-surface-hover text-gray-300 hover:text-white"}`}
            >
              {m}
              {selectedModel === m && <Check size={16} />}
            </button>
          ))}

          <div className="border-t border-surface-border my-1.5" />
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 py-1.5">Tools</p>
          {TOOLS.map((t) => (
            <button key={t.label} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-surface-hover text-gray-300 hover:text-white text-sm transition-all">
              {t.icon} {t.label}
            </button>
          ))}
        </div>
      )}

      {/* Input Bar */}
      <form onSubmit={handleSubmit} className="relative flex items-center gap-2 bg-surface-card border border-surface-border rounded-2xl px-3 py-2.5 shadow-lg hover:border-brand-600/50 focus-within:border-brand-500 transition-all">
        {/* Menu button */}
        <button
          type="button"
          onClick={() => setMenuOpen((o) => !o)}
          className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all text-lg font-bold
            ${menuOpen ? "bg-brand-600 text-white" : "text-gray-500 hover:bg-surface-hover hover:text-white"}`}
          title="Options"
        >
          <Sparkles size={18} />
        </button>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={loading ? "Thinking deeply..." : "Ask anything to understand it deeply..."}
          disabled={loading}
          className="flex-1 bg-transparent text-white placeholder-gray-600 outline-none text-sm py-1"
        />

        {/* Voice input */}
        <button
          type="button"
          onClick={handleVoice}
          className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all
            ${isListening ? "bg-red-500/20 text-red-400 animate-pulse" : "text-gray-500 hover:bg-surface-hover hover:text-white"}`}
          title="Voice input"
        >
          <Mic size={18} />
        </button>

        {/* Submit */}
        <button
          type="submit"
          disabled={!query.trim() || loading}
          className="w-9 h-9 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-40 disabled:cursor-not-allowed 
                     flex items-center justify-center text-white transition-all active:scale-95 flex-shrink-0"
        >
          {loading ? (
            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            <ArrowUp size={20} strokeWidth={2.5} />
          )}
        </button>
      </form>

      {/* Active model badge */}
      <p className="text-center text-xs text-gray-600 mt-2">
        Using <span className="text-brand-500">{selectedModel}</span> · All responses structured for deep learning
      </p>
    </div>
  );
}
