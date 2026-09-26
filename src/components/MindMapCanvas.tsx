import { useEffect, useRef } from 'react';
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
  const setNodes = useMindMapStore((s) => s.setNodes);
  const setEdges = useMindMapStore((s) => s.setEdges);
  const storedNodes = useMindMapStore((s) => s.nodes);
  const storedEdges = useMindMapStore((s) => s.edges);
  const { fitView } = useReactFlow();
  const isFirstRender = useRef(true);

  useEffect(() => {
    const { nodes: newNodes, edges: newEdges } = parseTextToMindMap(text, layout);
    setNodes(newNodes);
    setEdges(newEdges);
    
    // Fit view after a short delay to allow rendering
    setTimeout(() => {
      fitView({ padding: 0.2, duration: 300 });
    }, 150);
  }, [text, layout, setNodes, setEdges, fitView]);

  if (storedNodes.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-indigo-50">
        <div className="text-center">
          <div className="text-6xl mb-4">🧠</div>
          <p className="text-gray-500 text-lg">Start typing in the editor to create your mind map</p>
          <p className="text-gray-400 text-sm mt-2">Use indentation to create hierarchy</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1">
      <ReactFlow
        nodes={storedNodes}
        edges={storedEdges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.1}
        maxZoom={2}
        proOptions={{ hideAttribution: true }}
        nodesDraggable={true}
        nodesConnectable={false}
        elementsSelectable={true}
      >
        <Background color="#e2e8f0" gap={20} size={1} />
        <Controls
          className="!bg-white !border-gray-200 !shadow-lg !rounded-xl"
          showInteractive={false}
        />
        <MiniMap
          className="!bg-white !border-gray-200 !shadow-lg !rounded-xl"
          nodeColor="#6366f1"
          maskColor="rgba(0,0,0,0.08)"
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
