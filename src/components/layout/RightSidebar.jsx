import { Sparkles, GitMerge, Gem, BookOpen, Lightbulb } from "lucide-react";

export default function RightSidebar({ onAction }) {
  const tools = [
    { icon: <Sparkles size={16} className="text-brand-400" />, label: "Humanise", desc: "Simplify technical jargon", action: "humanise" },
    { icon: <GitMerge size={16} className="text-brand-400" />, label: "Flowchart", desc: "Visualize as a flow", action: "flowchart" },
    { icon: <Gem size={16} className="text-brand-400" />, label: "Polished", desc: "Refine explanation", action: "polished" },
    { icon: <BookOpen size={16} className="text-brand-400" />, label: "Glossary", desc: "Key term definitions", action: "glossary" },
  ];

  return (
    <aside className="w-56 flex-shrink-0 flex flex-col h-full bg-surface-card border-l border-surface-border">
      <div className="p-4 border-b border-surface-border">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Quick Tools</p>
      </div>

      <div className="flex-1 p-3 space-y-2">
        {tools.map((tool) => (
          <button
            key={tool.action}
            onClick={() => onAction && onAction(tool.action)}
            className="w-full p-3 rounded-xl text-left bg-surface-dark border border-surface-border 
                       hover:border-brand-600/50 hover:bg-surface-hover transition-all duration-200 group"
          >
            <div className="flex items-center gap-2 mb-1">
              {tool.icon}
              <span className="text-sm font-semibold text-white group-hover:text-brand-300 transition-colors">
                {tool.label}
              </span>
            </div>
            <p className="text-xs text-gray-500">{tool.desc}</p>
          </button>
        ))}
      </div>

      {/* Concept depth hint */}
      <div className="p-4 border-t border-surface-border">
        <div className="bg-brand-900/40 border border-brand-700/30 rounded-xl p-3">
          <p className="text-xs font-semibold text-brand-400 mb-1 flex items-center gap-1.5"><Lightbulb size={14} /> How RUE works</p>
          <p className="text-xs text-gray-500 leading-relaxed">
            Click any highlighted term in an answer to explore it deeper. Keep clicking to understand recursively!
          </p>
        </div>
      </div>
    </aside>
  );
}
