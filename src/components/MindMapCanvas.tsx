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
    
    const edgeColor = isDark ? '#0A84FF' : '#6b7280';
    const themedEdges = newEdges.map(edge => ({
      ...edge,
      style: { ...edge.style, stroke: edgeColor },
    }));
    
    setNodes(newNodes);
    setEdges(themedEdges);
    
    setTimeout(() => {
      fitView({ 
        padding: layout === 'auto' ? 0.15 : 0.2, 
        duration: 300 
      });
    }, 100);
  }, [text, layout, isDark, setNodes, setEdges, fitView]);

  if (storedNodes.length === 0) {
    return (
      <div className={`flex-1 flex items-center justify-center ${
        isDark ? 'bg-[#000000]' : 'bg-gray-50'
      }`}>
        <div className="text-center">
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Start typing in the editor
          </p>
        </div>
      </div>
    );
  }

  const bgColor = isDark ? '#000000' : '#ffffff';
  const bgPatternColor = isDark ? '#1C1C1E' : '#f3f4f6';

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
          className={`!border !rounded-md ${
            isDark 
              ? '!bg-[#1C1C1E] !border-[#2C2C2E]' 
              : '!bg-white !border-gray-200'
          }`}
          showInteractive={false}
        />
        <MiniMap
          className={`!border !rounded-md ${
            isDark 
              ? '!bg-[#1C1C1E] !border-[#2C2C2E]' 
              : '!bg-white !border-gray-200'
          }`}
          nodeColor={isDark ? '#0A84FF' : '#6b7280'}
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
