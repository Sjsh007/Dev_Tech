import { createContext, useContext, useState, useCallback, useEffect } from "react";

const SessionContext = createContext(null);

// Tree node for concept graph
function createNode(term, parentId = null) {
  return {
    id: crypto.randomUUID(),
    term,
    parentId,
    explanation: null,
    concepts: [],
    timestamp: Date.now(),
  };
}

export function SessionProvider({ children }) {
  const [chatHistory, setChatHistory] = useState(() => {
    const saved = localStorage.getItem("rue_chat_history");
    return saved ? JSON.parse(saved) : [];
  });
  const [currentSession, setCurrentSession] = useState(null);
  const [breadcrumb, setBreadcrumb] = useState([]); // [{term, nodeId}]
  const [activeNode, setActiveNode] = useState(null); // currently viewed concept node
  const [conceptTree, setConceptTree] = useState({}); // id → node
  const [panelOpen, setPanelOpen] = useState(false);

  // Sync history to localStorage
  useEffect(() => {
    localStorage.setItem("rue_chat_history", JSON.stringify(chatHistory));
  }, [chatHistory]);

  const startNewQuestion = useCallback((question, answer, concepts) => {
    const session = {
      id: crypto.randomUUID(),
      question,
      answer,
      concepts,
      timestamp: Date.now(),
    };
    setCurrentSession(session);
    setChatHistory((h) => [session, ...h]);
    setBreadcrumb([]);
    setConceptTree({});
    setActiveNode(null);
    setPanelOpen(false);
  }, []);

  const exploreConcept = useCallback((term, explanation, concepts, parentNodeId = null) => {
    const node = createNode(term, parentNodeId);
    node.explanation = explanation;
    node.concepts = concepts;

    setConceptTree((tree) => ({ ...tree, [node.id]: node }));
    setActiveNode(node);
    setBreadcrumb((bc) => {
      // If clicking a breadcrumb term, trim the stack
      const existingIdx = bc.findIndex((b) => b.term === term);
      if (existingIdx !== -1) return bc.slice(0, existingIdx + 1);
      return [...bc, { term, nodeId: node.id }];
    });
    setPanelOpen(true);
    return node.id;
  }, []);

  const navigateToBreadcrumb = useCallback((nodeId) => {
    setConceptTree((tree) => {
      const node = tree[nodeId];
      if (node) setActiveNode(node);
      return tree;
    });
    setBreadcrumb((bc) => {
      const idx = bc.findIndex((b) => b.nodeId === nodeId);
      return idx !== -1 ? bc.slice(0, idx + 1) : bc;
    });
  }, []);

  const closePanel = useCallback(() => {
    setPanelOpen(false);
    setActiveNode(null);
    setBreadcrumb([]);
  }, []);

  const startNewChat = useCallback(() => {
    setCurrentSession(null);
    setBreadcrumb([]);
    setConceptTree({});
    setActiveNode(null);
    setPanelOpen(false);
  }, []);

  return (
    <SessionContext.Provider
      value={{
        chatHistory,
        currentSession,
        breadcrumb,
        activeNode,
        conceptTree,
        panelOpen,
        startNewQuestion,
        exploreConcept,
        navigateToBreadcrumb,
        closePanel,
        startNewChat,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export const useSession = () => useContext(SessionContext);
