import { memo, useState } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { useMindMapStore } from '../store/mindmapStore';

const depthColors = [
  'bg-indigo-600 text-white shadow-indigo-200',
  'bg-violet-500 text-white shadow-violet-200',
  'bg-purple-500 text-white shadow-purple-200',
  'bg-fuchsia-500 text-white shadow-fuchsia-200',
  'bg-pink-500 text-white shadow-pink-200',
  'bg-rose-500 text-white shadow-rose-200',
  'bg-orange-500 text-white shadow-orange-200',
  'bg-amber-500 text-white shadow-amber-200',
];

const darkDepthColors = [
  'bg-indigo-900 text-indigo-100 border-indigo-700 shadow-indigo-900/50',
  'bg-violet-900 text-violet-100 border-violet-700 shadow-violet-900/50',
  'bg-purple-900 text-purple-100 border-purple-700 shadow-purple-900/50',
  'bg-fuchsia-900 text-fuchsia-100 border-fuchsia-700 shadow-fuchsia-900/50',
  'bg-pink-900 text-pink-100 border-pink-700 shadow-pink-900/50',
  'bg-rose-900 text-rose-100 border-rose-700 shadow-rose-900/50',
  'bg-orange-900 text-orange-100 border-orange-700 shadow-orange-900/50',
  'bg-amber-900 text-amber-100 border-amber-700 shadow-amber-900/50',
];

const colorfulDepthColors = [
  'bg-blue-500 text-white shadow-blue-200',
  'bg-emerald-500 text-white shadow-emerald-200',
  'bg-amber-500 text-white shadow-amber-200',
  'bg-rose-500 text-white shadow-rose-200',
  'bg-cyan-500 text-white shadow-cyan-200',
  'bg-lime-500 text-white shadow-lime-200',
  'bg-orange-500 text-white shadow-orange-200',
  'bg-pink-500 text-white shadow-pink-200',
];

function CustomNode({ data, id }: NodeProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(data.label);
  const theme = useMindMapStore((s) => s.theme);
  const updateNodeText = useMindMapStore((s) => s.updateNodeText);
  const selectedNodeId = useMindMapStore((s) => s.selectedNodeId);
  const setSelectedNodeId = useMindMapStore((s) => s.setSelectedNodeId);

  const depth = data.depth || 0;
  const isSelected = selectedNodeId === id;

  const colorSet =
    theme === 'dark'
      ? darkDepthColors
      : theme === 'colorful'
      ? colorfulDepthColors
      : depthColors;

  const colorClass = colorSet[depth % colorSet.length];

  const sizeClass =
    depth === 0
      ? 'px-6 py-3 text-lg font-bold rounded-2xl min-w-[160px]'
      : depth === 1
      ? 'px-4 py-2.5 text-base font-semibold rounded-xl min-w-[120px]'
      : 'px-3 py-2 text-sm font-medium rounded-lg min-w-[80px]';

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
    setEditText(data.label);
  };

  const handleBlur = () => {
    setIsEditing(false);
    updateNodeText(id, editText);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setIsEditing(false);
      updateNodeText(id, editText);
    }
    if (e.key === 'Escape') {
      setIsEditing(false);
      setEditText(data.label);
    }
  };

  return (
    <div
      className={`${sizeClass} ${colorClass} shadow-lg cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-xl ${
        isSelected ? 'ring-2 ring-offset-2 ring-indigo-400 scale-105' : ''
      } ${theme === 'dark' ? 'border' : ''}`}
      onClick={() => setSelectedNodeId(id)}
      onDoubleClick={handleDoubleClick}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!w-2 !h-2 !bg-white/50 !border-0"
      />
      {isEditing ? (
        <input
          autoFocus
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="bg-transparent outline-none w-full text-center min-w-[60px]"
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <span className="whitespace-nowrap">{data.label}</span>
      )}
      <Handle
        type="source"
        position={Position.Right}
        className="!w-2 !h-2 !bg-white/50 !border-0"
      />
    </div>
  );
}

export default memo(CustomNode);
