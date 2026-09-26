import { useEffect, useState } from 'react';
import { useMindMapStore } from '../store/mindmapStore';
import {
  Layout,
  Palette,
  Download,
  Brain,
  Maximize2,
  Minimize2,
  Sparkles,
} from 'lucide-react';
import { toPng, toSvg } from 'html-to-image';

export default function Toolbar() {
  const layout = useMindMapStore((s) => s.layout);
  const setLayout = useMindMapStore((s) => s.setLayout);
  const theme = useMindMapStore((s) => s.theme);
  const setTheme = useMindMapStore((s) => s.setTheme);
  const nodes = useMindMapStore((s) => s.nodes);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const isDark = theme === 'dark';

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'f') {
        e.preventDefault();
        toggleFullscreen();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleExportPNG();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const handleExportPNG = async () => {
    const reactFlowWrapper = document.querySelector('.react-flow') as HTMLElement;
    if (!reactFlowWrapper) return;

    try {
      // Set Auto layout before export for best fit
      const dataUrl = await toPng(reactFlowWrapper, {
        backgroundColor: isDark ? '#000000' : '#ffffff',
        quality: 1.0,
        pixelRatio: 2,
      });
      
      const link = document.createElement('a');
      link.download = 'mindmap.png';
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Export failed:', err);
    }
  };

  const handleExportSVG = async () => {
    const reactFlowWrapper = document.querySelector('.react-flow') as HTMLElement;
    if (!reactFlowWrapper) return;

    try {
      const dataUrl = await toSvg(reactFlowWrapper, {
        backgroundColor: isDark ? '#000000' : '#ffffff',
      });
      
      const link = document.createElement('a');
      link.download = 'mindmap.svg';
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Export failed:', err);
    }
  };

  // iOS-style toolbar
  const toolbarBg = isDark
    ? 'bg-[#1C1C1E]/80 backdrop-blur-xl border-white/10'
    : 'bg-white/80 backdrop-blur-xl border-gray-200/50';

  const segmentBg = isDark
    ? 'bg-[#2C2C2E]'
    : 'bg-gray-100';

  const segmentActive = isDark
    ? 'bg-[#3A3A3C] text-white shadow-sm'
    : 'bg-white text-indigo-600 shadow-sm';

  const segmentInactive = isDark
    ? 'text-gray-400 hover:text-gray-200'
    : 'text-gray-500 hover:text-gray-700';

  const iconColor = isDark ? 'text-gray-400' : 'text-gray-400';
  const dividerColor = isDark ? 'bg-white/10' : 'bg-gray-200';
  const exportBtnBase = isDark
    ? 'bg-[#0A84FF]/20 text-[#0A84FF] hover:bg-[#0A84FF]/30'
    : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100';
  const exportBtnSvg = isDark
    ? 'bg-[#5E5CE6]/20 text-[#5E5CE6] hover:bg-[#5E5CE6]/30'
    : 'bg-purple-50 text-purple-600 hover:bg-purple-100';
  const iconBtn = isDark
    ? 'hover:bg-white/10 text-gray-400 hover:text-gray-200'
    : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700';
  const countBadge = isDark
    ? 'bg-[#2C2C2E] text-gray-400'
    : 'bg-gray-100 text-gray-400';

  return (
    <div className={`h-14 border-b flex items-center justify-between px-3 sm:px-4 flex-shrink-0 ${toolbarBg}`}>
      {/* Logo */}
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <Brain className="w-5 h-5 text-white" />
        </div>
        <div className="hidden sm:block">
          <h1 className={`text-lg font-bold leading-tight ${isDark ? 'text-white' : 'bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent'}`}>
            MindFlow
          </h1>
          <p className={`text-[10px] -mt-0.5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Text → Mind Map</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap justify-end">
        {/* Layout Toggle - iOS Segmented Control style */}
        <div className={`flex items-center rounded-lg p-0.5 ${segmentBg}`}>
          <Layout className={`w-3.5 h-3.5 ml-1.5 hidden sm:block ${iconColor}`} />
          {(['auto', 'horizontal', 'vertical', 'radial'] as const).map((l) => (
            <button
              key={l}
              onClick={() => setLayout(l)}
              className={`px-2 sm:px-2.5 py-1.5 text-xs font-medium rounded-md transition-all ${
                layout === l ? segmentActive : segmentInactive
              }`}
            >
              {l === 'auto' && <Sparkles className="w-3 h-3 inline sm:hidden" />}
              {l === 'auto' && <span className="hidden sm:inline">✨ Auto</span>}
              {l === 'horizontal' && <span>H</span>}
              {l === 'vertical' && <span>V</span>}
              {l === 'radial' && <span>R</span>}
              {l !== 'auto' && <span className="hidden sm:inline ml-0.5">{l.charAt(0).toUpperCase() + l.slice(1)}</span>}
            </button>
          ))}
        </div>

        {/* Theme Toggle */}
        <div className={`flex items-center rounded-lg p-0.5 ${segmentBg}`}>
          <Palette className={`w-3.5 h-3.5 ml-1.5 hidden sm:block ${iconColor}`} />
          {(['default', 'colorful', 'dark'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className={`px-2 sm:px-2.5 py-1.5 text-xs font-medium rounded-md transition-all ${
                theme === t ? segmentActive : segmentInactive
              }`}
            >
              {t === 'default' ? '🎨' : t === 'colorful' ? '🌈' : '🌙'}
              <span className="hidden sm:inline ml-0.5">
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </span>
            </button>
          ))}
        </div>

        {/* Divider */}
        <div className={`w-px h-6 hidden sm:block ${dividerColor}`} />

        {/* Fullscreen */}
        <button
          onClick={toggleFullscreen}
          className={`p-2 rounded-lg transition-colors hidden sm:flex ${iconBtn}`}
          title="Toggle Fullscreen (Ctrl+Shift+F)"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>

        {/* Export */}
        <div className="flex items-center gap-1">
          <button
            onClick={handleExportPNG}
            className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors ${exportBtnBase}`}
            title="Export as PNG (Ctrl+S)"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">PNG</span>
          </button>
          <button
            onClick={handleExportSVG}
            className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors ${exportBtnSvg}`}
            title="Export as SVG"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">SVG</span>
          </button>
        </div>

        {/* Node count */}
        <div className={`hidden md:flex items-center text-xs font-mono px-2 py-1 rounded-md ${countBadge}`}>
          {nodes.length}
        </div>
      </div>
    </div>
  );
}
