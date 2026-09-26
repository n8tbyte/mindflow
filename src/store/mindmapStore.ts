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
function loadFromStorage(): { text: string; layout: string; theme: string } {
  try {
    const saved = localStorage.getItem('mindflow-state');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    // ignore
  }
  return { text: DEFAULT_TEXT, layout: 'auto', theme: 'default' };
}

const saved = loadFromStorage();

interface MindMapState {
  text: string;
  nodes: Node[];
  edges: Edge[];
  selectedNodeId: string | null;
  layout: 'horizontal' | 'auto';
  theme: 'default' | 'dark' | 'colorful';
  setText: (text: string) => void;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  setSelectedNodeId: (id: string | null) => void;
  setLayout: (layout: 'horizontal' | 'auto') => void;
  setTheme: (theme: 'default' | 'dark' | 'colorful') => void;
  updateNodeText: (id: string, text: string) => void;
}

export const useMindMapStore = create<MindMapState>((set, get) => ({
  text: saved.text,
  nodes: [],
  edges: [],
  selectedNodeId: null,
  layout: (saved.layout as 'horizontal' | 'auto') || 'auto',
  theme: (saved.theme as 'default' | 'dark' | 'colorful') || 'default',
  setText: (text) => {
    set({ text });
    try {
      const state = get();
      localStorage.setItem('mindflow-state', JSON.stringify({
        text,
        layout: state.layout,
        theme: state.theme,
      }));
    } catch (e) {
      // ignore
    }
  },
  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),
  setSelectedNodeId: (id) => set({ selectedNodeId: id }),
  setLayout: (layout) => {
    set({ layout });
    try {
      const state = get();
      localStorage.setItem('mindflow-state', JSON.stringify({
        text: state.text,
        layout,
        theme: state.theme,
      }));
    } catch (e) {
      // ignore
    }
  },
  setTheme: (theme) => {
    set({ theme });
    try {
      const state = get();
      localStorage.setItem('mindflow-state', JSON.stringify({
        text: state.text,
        layout: state.layout,
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
}));
