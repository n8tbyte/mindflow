import { useEffect, useState } from 'react';
import { useMindMapStore } from '../store/mindmapStore';
import { Maximize2, Minimize2 } from 'lucide-react';
import { toPng, toSvg } from 'html-to-image';

export default function Toolbar() {
  const theme = useMindMapStore((s) => s.theme);
  const setTheme = useMindMapStore((s) => s.setTheme);
  const triggerFitView = useMindMapStore((s) => s.triggerFitView);
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
        width: 1920,
        height: 1080,
        style: {
          width: '1920px',
          height: '1080px',
        },
      });
      
      const link = document.createElement('a');
      link.download = 'mindmap-1920x1080.png';
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
        width: 1920,
        height: 1080,
        style: {
          width: '1920px',
          height: '1080px',
        },
      });
      
      const link = document.createElement('a');
      link.download = 'mindmap-1920x1080.svg';
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Export failed:', err);
    }
  };

  const toolbarBg = isDark ? 'bg-[#1C1C1E] border-[#2C2C2E]' : 'bg-white border-gray-200';
  const textColor = isDark ? 'text-white' : 'text-gray-900';
  const segmentActive = isDark ? 'bg-[#3A3A3C] text-white' : 'bg-gray-100 text-gray-900';
  const segmentInactive = isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-900';
  const btnBg = isDark ? 'bg-[#2C2C2E] hover:bg-[#3A3A3C] text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-900';
  const iconBtn = isDark ? 'hover:bg-[#2C2C2E] text-gray-400' : 'hover:bg-gray-100 text-gray-600';

  return (
    <div className={`h-12 border-b flex items-center justify-between px-4 flex-shrink-0 ${toolbarBg}`}>
      {/* Logo */}
      <div className="flex items-center gap-2">
        <h1 className={`text-sm font-medium ${textColor}`}>MindFlow</h1>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-1">
        {/* Auto Layout Button */}
        <button
          onClick={triggerFitView}
          className={`px-3 py-1 text-xs font-medium rounded transition-all ${segmentActive}`}
        >
          Auto
        </button>

        {/* Theme Buttons */}
        <button
          onClick={() => setTheme('default')}
          className={`px-3 py-1 text-xs font-medium rounded transition-all ${
            theme === 'default' ? segmentActive : segmentInactive
          }`}
        >
          Default
        </button>
        <button
          onClick={() => setTheme('colorful')}
          className={`px-3 py-1 text-xs font-medium rounded transition-all ${
            theme === 'colorful' ? segmentActive : segmentInactive
          }`}
        >
          Colorful
        </button>
        <button
          onClick={() => setTheme('dark')}
          className={`px-3 py-1 text-xs font-medium rounded transition-all ${
            theme === 'dark' ? segmentActive : segmentInactive
          }`}
        >
          Dark
        </button>

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
