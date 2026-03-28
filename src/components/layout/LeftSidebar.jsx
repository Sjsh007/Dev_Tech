import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useSession } from "../../context/SessionContext";
import { RefreshCw, Plus, MessageSquare, Image as ImageIcon } from "lucide-react";

const categories = ["Classroom", "Tech", "Labs", "Miscellaneous"];

export default function LeftSidebar({ activeCategory, setActiveCategory }) {
  const { user } = useAuth();
  const { chatHistory, startNewChat } = useSession();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredHistory = chatHistory.filter((s) =>
    (s.question || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <aside className="w-64 flex-shrink-0 flex flex-col h-full bg-surface-card border-r border-surface-border overflow-hidden">
      {/* Logo */}
      <div className="p-4 border-b border-surface-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand-600/20 border border-brand-500/30 flex items-center justify-center text-brand-400"><RefreshCw size={20} /></div>
          <div>
            <p className="font-bold text-white text-sm leading-none">RUE</p>
            <p className="text-xs text-gray-500">Recursive Engine</p>
          </div>
        </div>
      </div>

      {/* New Chat */}
      <div className="p-3">
        <button
          onClick={startNewChat}
          className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg bg-brand-600/20 border border-brand-600/30 
                     text-brand-300 hover:bg-brand-600/30 transition-all text-sm font-medium"
        >
          <Plus size={18} />
          New Chat
        </button>
      </div>

      {/* Search */}
      <div className="px-3 pb-2">
        <input
          type="text"
          placeholder="Search chats..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-surface-dark border border-surface-border rounded-lg px-3 py-2 text-sm 
                     text-white placeholder-gray-600 focus:outline-none focus:border-brand-500"
        />
      </div>

      {/* Category Nav */}
      <div className="px-3 pb-3">
        <p className="text-xs text-gray-600 uppercase tracking-wider mb-2 px-1">Categories</p>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`sidebar-item w-full text-left ${activeCategory === cat ? "active" : ""}`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-brand-500 flex-shrink-0" />
            {cat}
          </button>
        ))}
      </div>

      <div className="border-t border-surface-border mx-3" />

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto px-3 py-3">
        <p className="text-xs text-gray-600 uppercase tracking-wider mb-2 px-1">Recent Chats</p>
        {filteredHistory.length === 0 ? (
          <p className="text-xs text-gray-600 px-1 py-4 text-center">
            {chatHistory.length === 0 ? "No chats yet. Ask a question to start!" : "No matches found."}
          </p>
        ) : (
          filteredHistory.map((session) => (
              <div
              key={session.id}
              className="sidebar-item"
            >
              <MessageSquare size={14} className="text-gray-500" />
              <span className="truncate text-xs">{session.question}</span>
            </div>
          ))
        )}
      </div>

      {/* Images section */}
      <div className="border-t border-surface-border p-3">
        <button className="sidebar-item w-full text-left">
          <ImageIcon size={16} />
          <span>Images</span>
        </button>
      </div>
    </aside>
  );
}
