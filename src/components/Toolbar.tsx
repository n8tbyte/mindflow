import { useEffect, useState } from 'react';
import { useMindMapStore } from '../store/mindmapStore';
import { Maximize2, Minimize2 } from 'lucide-react';
import { toPng, toSvg } from 'html-to-image';

export default function Toolbar() {
  const layout = useMindMapStore((s) => s.layout);
  const setLayout = useMindMapStore((s) => s.setLayout);
  const theme = useMindMapStore((s) => s.theme);
  const setTheme = useMindMapStore((s) => s.setTheme);
  const nodes = useMindMapStore((s) => s.nodes);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const isDark = theme === 'dark';

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

  const toolbarBg = isDark ? 'bg-[#1C1C1E] border-[#2C2C2E]' : 'bg-white border-gray-200';
  const textColor = isDark ? 'text-white' : 'text-gray-900';
  const segmentBg = isDark ? 'bg-[#2C2C2E]' : 'bg-gray-100';
  const segmentActive = isDark ? 'bg-[#3A3A3C] text-white' : 'bg-white text-gray-900 shadow-sm';
  const segmentInactive = isDark ? 'text-gray-400' : 'text-gray-600';
  const btnBg = isDark ? 'bg-[#2C2C2E] hover:bg-[#3A3A3C] text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-900';
  const iconBtn = isDark ? 'hover:bg-[#2C2C2E] text-gray-400' : 'hover:bg-gray-100 text-gray-600';

  return (
    <div className={`h-12 border-b flex items-center justify-between px-4 flex-shrink-0 ${toolbarBg}`}>
      {/* Logo */}
      <div className="flex items-center gap-2">
        <h1 className={`text-sm font-medium ${textColor}`}>MindFlow</h1>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        {/* Layout Toggle */}
        <div className={`flex items-center rounded-md p-0.5 ${segmentBg}`}>
          {(['auto', 'horizontal'] as const).map((l) => (
            <button
              key={l}
              onClick={() => setLayout(l)}
              className={`px-3 py-1 text-xs font-medium rounded transition-all ${
                layout === l ? segmentActive : segmentInactive
              }`}
            >
              {l === 'auto' ? 'Auto' : 'H'}
            </button>
          ))}
        </div>

        {/* Theme Toggle */}
        <div className={`flex items-center rounded-md p-0.5 ${segmentBg}`}>
          {(['default', 'colorful', 'dark'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className={`px-3 py-1 text-xs font-medium rounded transition-all ${
                theme === t ? segmentActive : segmentInactive
              }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Fullscreen */}
        <button
          onClick={toggleFullscreen}
          className={`p-1.5 rounded transition-colors ${iconBtn}`}
          title="Toggle Fullscreen (Ctrl+Shift+F)"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>

        {/* Export */}
        <div className="flex items-center gap-1">
          <button
            onClick={handleExportPNG}
            className={`px-3 py-1 text-xs font-medium rounded transition-colors ${btnBg}`}
            title="Export as PNG (Ctrl+S)"
          >
            PNG
          </button>
          <button
            onClick={handleExportSVG}
            className={`px-3 py-1 text-xs font-medium rounded transition-colors ${btnBg}`}
            title="Export as SVG"
          >
            SVG
          </button>
        </div>
      </div>
    </div>
  );
}
