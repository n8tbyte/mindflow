import { memo, useState } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { useMindMapStore } from '../store/mindmapStore';

const depthColors = [
  'bg-gray-900 text-white',
  'bg-gray-700 text-white',
  'bg-gray-600 text-white',
  'bg-gray-500 text-white',
  'bg-gray-400 text-white',
];

const iosDarkDepthColors = [
  'bg-[#0A84FF] text-white',
  'bg-[#5E5CE6] text-white',
  'bg-[#BF5AF2] text-white',
  'bg-[#FF375F] text-white',
  'bg-[#FF9F0A] text-white',
];

const colorfulDepthColors = [
  'bg-blue-600 text-white',
  'bg-emerald-600 text-white',
  'bg-amber-600 text-white',
  'bg-rose-600 text-white',
  'bg-cyan-600 text-white',
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
  const isDark = theme === 'dark';

  const colorSet =
    isDark
      ? iosDarkDepthColors
      : theme === 'colorful'
      ? colorfulDepthColors
      : depthColors;

  const colorClass = colorSet[depth % colorSet.length];

  const sizeClass =
    depth === 0
      ? 'px-5 py-2.5 text-sm font-medium rounded-lg min-w-[140px]'
      : depth === 1
      ? 'px-4 py-2 text-sm font-normal rounded-md min-w-[100px]'
      : 'px-3 py-1.5 text-xs font-normal rounded-md min-w-[70px]';

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

  const selectedStyle = isSelected
    ? isDark
      ? 'ring-2 ring-[#0A84FF] ring-offset-1 ring-offset-[#1C1C1E]'
      : 'ring-2 ring-gray-900 ring-offset-1'
    : '';

  return (
    <div
      className={`${sizeClass} ${colorClass} ${selectedStyle} cursor-pointer transition-all`}
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
