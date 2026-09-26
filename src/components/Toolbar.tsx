import { useEffect } from 'react';
import { useMindMapStore } from '../store/mindmapStore';
import {
  Layout,
  Palette,
  Download,
  Brain,
  Maximize2,
  Minimize2,
  Undo2,
  Redo2,
} from 'lucide-react';
import { toPng, toSvg } from 'html-to-image';
import { useState } from 'react';

export default function Toolbar() {
  const layout = useMindMapStore((s) => s.layout);
  const setLayout = useMindMapStore((s) => s.setLayout);
  const theme = useMindMapStore((s) => s.theme);
  const setTheme = useMindMapStore((s) => s.setTheme);
  const nodes = useMindMapStore((s) => s.nodes);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + Shift + F = Fullscreen
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'f') {
        e.preventDefault();
        toggleFullscreen();
      }
      // Ctrl/Cmd + S = Export PNG
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
        backgroundColor: '#ffffff',
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
        backgroundColor: '#ffffff',
      });
      
      const link = document.createElement('a');
      link.download = 'mindmap.svg';
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Export failed:', err);
    }
  };

  return (
    <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-3 sm:px-4 shadow-sm flex-shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
          <Brain className="w-5 h-5 text-white" />
        </div>
        <div className="hidden sm:block">
          <h1 className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent leading-tight">
            MindFlow
          </h1>
          <p className="text-[10px] text-gray-400 -mt-0.5">Text → Mind Map</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap justify-end">
        {/* Layout Toggle */}
        <div className="flex items-center bg-gray-100 rounded-lg p-0.5">
          <Layout className="w-3.5 h-3.5 text-gray-400 ml-1.5 hidden sm:block" />
          {(['horizontal', 'vertical', 'radial'] as const).map((l) => (
            <button
              key={l}
              onClick={() => setLayout(l)}
              className={`px-2 py-1.5 text-xs font-medium rounded-md transition-all ${
                layout === l
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {l === 'horizontal' ? 'H' : l === 'vertical' ? 'V' : 'R'}
              <span className="hidden sm:inline ml-0.5">
                {l.charAt(0).toUpperCase() + l.slice(1)}
              </span>
            </button>
          ))}
        </div>

        {/* Theme Toggle */}
        <div className="flex items-center bg-gray-100 rounded-lg p-0.5">
          <Palette className="w-3.5 h-3.5 text-gray-400 ml-1.5 hidden sm:block" />
          {(['default', 'colorful', 'dark'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className={`px-2 py-1.5 text-xs font-medium rounded-md transition-all ${
                theme === t
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
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
        <div className="w-px h-6 bg-gray-200 hidden sm:block" />

        {/* Fullscreen */}
        <button
          onClick={toggleFullscreen}
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors hidden sm:flex"
          title="Toggle Fullscreen (Ctrl+Shift+F)"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>

        {/* Export */}
        <div className="flex items-center gap-1">
          <button
            onClick={handleExportPNG}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors"
            title="Export as PNG (Ctrl+S)"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">PNG</span>
          </button>
          <button
            onClick={handleExportSVG}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors"
            title="Export as SVG"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">SVG</span>
          </button>
        </div>

        {/* Node count */}
        <div className="hidden md:flex items-center gap-1 text-xs text-gray-400">
          <span className="px-2 py-1 bg-gray-100 rounded-md font-mono">{nodes.length}</span>
        </div>
      </div>
    </div>
  );
}
