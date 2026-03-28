import { useSession } from "../../context/SessionContext";

export default function BreadcrumbTrail() {
  const { breadcrumb, navigateToBreadcrumb, currentSession } = useSession();

  const rootLabel = currentSession?.question
    ? currentSession.question.slice(0, 30) + (currentSession.question.length > 30 ? "…" : "")
    : "Your Question";

  return (
    <nav className="flex items-center flex-wrap gap-1" aria-label="Concept breadcrumb">
      {/* Root question */}
      <span className="text-xs text-gray-500 font-medium truncate max-w-[120px]" title={currentSession?.question}>
        {rootLabel}
      </span>

      {breadcrumb.map((crumb, idx) => (
        <span key={crumb.nodeId} className="flex items-center gap-1">
          <span className="text-gray-700 text-xs">›</span>
          <button
            onClick={() => navigateToBreadcrumb(crumb.nodeId)}
            className={`text-xs font-medium transition-colors ${
              idx === breadcrumb.length - 1
                ? "text-brand-400 cursor-default"
                : "text-gray-400 hover:text-brand-400 underline underline-offset-2"
            }`}
          >
            {crumb.term}
          </button>
        </span>
      ))}
    </nav>
  );
}
