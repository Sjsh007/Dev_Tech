import { useState, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { Globe, ChevronDown, Sun, Moon, Settings, HelpCircle, LogOut, Hand } from "lucide-react";

const languages = ["English", "Hindi", "Spanish", "French", "German", "Japanese", "Chinese"];

export default function TopBar() {
  const { user, logout } = useAuth();
  const { dark, toggle } = useTheme();
  const [profileOpen, setProfileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState("English");

  const avatar = user?.photoURL
    ? <img src={user.photoURL} alt="avatar" className="w-8 h-8 rounded-full object-cover" />
    : (
      <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center text-white font-semibold text-sm">
        {(user?.displayName || user?.email || "U")[0].toUpperCase()}
      </div>
    );

  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-surface-border bg-surface-dark/80 backdrop-blur-sm flex-shrink-0">
      {/* Left spacer */}
      <div className="flex items-center gap-2">
        <span className="text-white font-semibold flex items-center gap-2">
          Hello, {user?.displayName || user?.email?.split("@")[0] || "there"}
        </span>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2">
        {/* Language selector */}
        <div className="relative">
          <button
            onClick={() => setLangOpen((o) => !o)}
            className="btn-ghost flex items-center gap-1.5 text-sm"
          >
            <Globe size={16} /> <span className="hidden sm:inline">{selectedLang}</span>
            <ChevronDown size={14} className="text-gray-600" />
          </button>
          {langOpen && (
            <div className="absolute right-0 top-full mt-1 w-36 bg-surface-card border border-surface-border rounded-xl shadow-xl z-50 py-1">
              {languages.map((lang) => (
                <button
                  key={lang}
                  onClick={() => { setSelectedLang(lang); setLangOpen(false); }}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-surface-hover transition-colors ${
                    lang === selectedLang ? "text-brand-400" : "text-gray-300"
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Dark/Light Toggle */}
        <button onClick={toggle} className="btn-ghost" title="Toggle theme">
          {dark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Profile Menu */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen((o) => !o)}
            className="flex items-center gap-2 p-1 rounded-xl hover:bg-surface-hover transition-all"
          >
            {avatar}
            <ChevronDown size={14} className="text-gray-600 hidden sm:block" />
          </button>
          {profileOpen && (
            <div className="absolute right-0 top-full mt-1 w-52 bg-surface-card border border-surface-border rounded-xl shadow-xl z-50 py-2">
              <div className="px-4 py-2 border-b border-surface-border">
                <p className="text-white text-sm font-medium truncate">{user?.displayName || "User"}</p>
                <p className="text-gray-500 text-xs truncate">{user?.email}</p>
              </div>
              <button className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-surface-hover hover:text-white flex items-center gap-2">
                <Settings size={16} /> Settings
              </button>
              <button className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-surface-hover hover:text-white flex items-center gap-2">
                <HelpCircle size={16} /> Help & Support
              </button>
              <div className="border-t border-surface-border my-1" />
              <button
                onClick={logout}
                className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-2"
              >
                <LogOut size={16} /> Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
