import { useEffect } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useReactFlow,
  ReactFlowProvider,
  NodeTypes,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useMindMapStore } from '../store/mindmapStore';
import { parseTextToMindMap } from '../utils/textParser';
import CustomNode from './CustomNode';

const nodeTypes: NodeTypes = {
  mindMapNode: CustomNode,
};

function MindMapInner() {
  const text = useMindMapStore((s) => s.text);
  const layout = useMindMapStore((s) => s.layout);
  const theme = useMindMapStore((s) => s.theme);
  const setNodes = useMindMapStore((s) => s.setNodes);
  const setEdges = useMindMapStore((s) => s.setEdges);
  const storedNodes = useMindMapStore((s) => s.nodes);
  const storedEdges = useMindMapStore((s) => s.edges);
  const { fitView } = useReactFlow();
  const isDark = theme === 'dark';

  useEffect(() => {
    const { nodes: newNodes, edges: newEdges } = parseTextToMindMap(text, layout);
    
    // Apply theme-based edge colors
    const edgeColor = isDark ? '#0A84FF' : '#6366f1';
    const themedEdges = newEdges.map(edge => ({
      ...edge,
      style: { ...edge.style, stroke: edgeColor },
    }));
    
    setNodes(newNodes);
    setEdges(themedEdges);
    
    // Auto-fit view after layout changes
    setTimeout(() => {
      fitView({ 
        padding: layout === 'auto' ? 0.15 : 0.2, 
        duration: 400 
      });
    }, 150);
  }, [text, layout, isDark, setNodes, setEdges, fitView]);

  if (storedNodes.length === 0) {
    return (
      <div className={`flex-1 flex items-center justify-center ${
        isDark 
          ? 'bg-gradient-to-br from-[#000000] to-[#1C1C1E]' 
          : 'bg-gradient-to-br from-gray-50 to-indigo-50'
      }`}>
        <div className="text-center">
          <div className="text-6xl mb-4">🧠</div>
          <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
            Start typing in the editor to create your mind map
          </p>
          <p className={`text-sm mt-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            Use indentation to create hierarchy
          </p>
        </div>
      </div>
    );
  }

  // iOS-style background
  const bgColor = isDark ? '#000000' : '#ffffff';
  const bgPatternColor = isDark ? '#2C2C2E' : '#e2e8f0';

  return (
    <div className="flex-1">
      <ReactFlow
        nodes={storedNodes}
        edges={storedEdges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: layout === 'auto' ? 0.15 : 0.2 }}
        minZoom={0.1}
        maxZoom={2}
        proOptions={{ hideAttribution: true }}
        nodesDraggable={true}
        nodesConnectable={false}
        elementsSelectable={true}
      >
        <Background 
          color={bgPatternColor} 
          gap={20} 
          size={1}
          style={{ backgroundColor: bgColor }}
        />
        <Controls
          className={`!border !shadow-lg !rounded-xl ${
            isDark 
              ? '!bg-[#1C1C1E]/80 !border-white/10 !backdrop-blur-xl' 
              : '!bg-white/80 !border-gray-200/50 !backdrop-blur-xl'
          }`}
          showInteractive={false}
        />
        <MiniMap
          className={`!border !shadow-lg !rounded-xl ${
            isDark 
              ? '!bg-[#1C1C1E]/80 !border-white/10 !backdrop-blur-xl' 
              : '!bg-white/80 !border-gray-200/50 !backdrop-blur-xl'
          }`}
          nodeColor={isDark ? '#0A84FF' : '#6366f1'}
          maskColor={isDark ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.08)'}
        />
      </ReactFlow>
    </div>
  );
}

export default function MindMapCanvas() {
  return (
    <ReactFlowProvider>
      <MindMapInner />
    </ReactFlowProvider>
  );
}
