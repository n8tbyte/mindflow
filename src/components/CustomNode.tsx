import { memo, useState } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { useMindMapStore } from '../store/mindmapStore';

// Light theme colors
const depthColors = [
  'bg-indigo-600 text-white shadow-indigo-200/50',
  'bg-violet-500 text-white shadow-violet-200/50',
  'bg-purple-500 text-white shadow-purple-200/50',
  'bg-fuchsia-500 text-white shadow-fuchsia-200/50',
  'bg-pink-500 text-white shadow-pink-200/50',
  'bg-rose-500 text-white shadow-rose-200/50',
  'bg-orange-500 text-white shadow-orange-200/50',
  'bg-amber-500 text-white shadow-amber-200/50',
];

// iOS Dark theme colors - ใช้สีเข้มแบบ iOS
const iosDarkDepthColors = [
  'bg-[#0A84FF] text-white shadow-blue-900/30',
  'bg-[#5E5CE6] text-white shadow-purple-900/30',
  'bg-[#BF5AF2] text-white shadow-purple-900/30',
  'bg-[#FF375F] text-white shadow-pink-900/30',
  'bg-[#FF453A] text-white shadow-red-900/30',
  'bg-[#FF9F0A] text-white shadow-orange-900/30',
  'bg-[#30D158] text-white shadow-green-900/30',
  'bg-[#64D2FF] text-white shadow-cyan-900/30',
];

// Colorful theme
const colorfulDepthColors = [
  'bg-blue-500 text-white shadow-blue-200/50',
  'bg-emerald-500 text-white shadow-emerald-200/50',
  'bg-amber-500 text-white shadow-amber-200/50',
  'bg-rose-500 text-white shadow-rose-200/50',
  'bg-cyan-500 text-white shadow-cyan-200/50',
  'bg-lime-500 text-white shadow-lime-200/50',
  'bg-orange-500 text-white shadow-orange-200/50',
  'bg-pink-500 text-white shadow-pink-200/50',
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

  // iOS-style sizing
  const sizeClass =
    depth === 0
      ? 'px-7 py-3.5 text-base font-semibold rounded-2xl min-w-[160px]'
      : depth === 1
      ? 'px-5 py-2.5 text-sm font-medium rounded-xl min-w-[120px]'
      : 'px-4 py-2 text-sm font-normal rounded-xl min-w-[80px]';

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

  // iOS dark mode specific styles
  const iosDarkStyle = isDark
    ? 'backdrop-blur-xl bg-opacity-90 border border-white/10 shadow-lg'
    : 'shadow-lg';

  const selectedStyle = isSelected
    ? isDark
      ? 'ring-2 ring-[#0A84FF] ring-offset-2 ring-offset-[#1C1C1E] scale-105'
      : 'ring-2 ring-offset-2 ring-indigo-400 scale-105'
    : '';

  return (
    <div
      className={`${sizeClass} ${colorClass} ${iosDarkStyle} ${selectedStyle} cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-xl`}
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
          className={`bg-transparent outline-none w-full text-center min-w-[60px] ${
            isDark ? 'text-white placeholder-white/50' : ''
          }`}
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
