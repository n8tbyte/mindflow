import { create } from 'zustand';
import { Node, Edge } from 'reactflow';

const DEFAULT_TEXT = `My Project
  Planning
    Define Goals
    Research
    Timeline
  Design
    Wireframes
    UI Design
    Prototyping
  Development
    Frontend
      React
      Tailwind CSS
    Backend
      API Design
      Database
  Testing
    Unit Tests
    Integration Tests
    User Testing
  Launch
    Marketing
    Deployment
    Feedback`;

// Load from localStorage
function loadFromStorage(): { text: string; theme: string } {
  try {
    const saved = localStorage.getItem('mindflow-state');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    // ignore
  }
  return { text: DEFAULT_TEXT, theme: 'default' };
}

const saved = loadFromStorage();

interface MindMapState {
  text: string;
  nodes: Node[];
  edges: Edge[];
  selectedNodeId: string | null;
  theme: 'default' | 'dark' | 'colorful';
  fitViewTrigger: number;
  setText: (text: string) => void;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  setSelectedNodeId: (id: string | null) => void;
  setTheme: (theme: 'default' | 'dark' | 'colorful') => void;
  updateNodeText: (id: string, text: string) => void;
  triggerFitView: () => void;
}

export const useMindMapStore = create<MindMapState>((set, get) => ({
  text: saved.text,
  nodes: [],
  edges: [],
  selectedNodeId: null,
  theme: (saved.theme as 'default' | 'dark' | 'colorful') || 'default',
  fitViewTrigger: 0,
  setText: (text) => {
    set({ text });
    try {
      const state = get();
      localStorage.setItem('mindflow-state', JSON.stringify({
        text,
        theme: state.theme,
      }));
    } catch (e) {
      // ignore
    }
  },
  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),
  setSelectedNodeId: (id) => set({ selectedNodeId: id }),
  setTheme: (theme) => {
    set({ theme });
    try {
      const state = get();
      localStorage.setItem('mindflow-state', JSON.stringify({
        text: state.text,
        theme,
      }));
    } catch (e) {
      // ignore
    }
  },
  updateNodeText: (id, text) =>
    set((state) => ({
      nodes: state.nodes.map((n) =>
        n.id === id ? { ...n, data: { ...n.data, label: text } } : n
      ),
    })),
  triggerFitView: () => set((state) => ({ fitViewTrigger: state.fitViewTrigger + 1 })),
}));
