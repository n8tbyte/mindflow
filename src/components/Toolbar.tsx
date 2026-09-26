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

  const waitForFitView = () => new Promise(resolve => setTimeout(resolve, 150));

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

  const hideControlsForExport = () => {
    const controls = document.querySelector('.react-flow__controls') as HTMLElement;
    const minimap = document.querySelector('.react-flow__minimap') as HTMLElement;
    if (controls) controls.style.display = 'none';
    if (minimap) minimap.style.display = 'none';
  };

  const showControlsAfterExport = () => {
    const controls = document.querySelector('.react-flow__controls') as HTMLElement;
    const minimap = document.querySelector('.react-flow__minimap') as HTMLElement;
    if (controls) controls.style.display = '';
    if (minimap) minimap.style.display = '';
  };

  const exportToCanvas = async (): Promise<HTMLCanvasElement | null> => {
    const viewport = document.querySelector('.react-flow__viewport') as HTMLElement;
    if (!viewport) return null;

    try {
      triggerFitView();
      await waitForFitView();
      hideControlsForExport();

      // Export viewport content
      const dataUrl = await toPng(viewport, {
        backgroundColor: 'transparent',
        quality: 1.0,
        pixelRatio: 2,
      });

      // Load image
      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = reject;
        image.src = dataUrl;
      });

      // Create 1920x1080 canvas
      const canvas = document.createElement('canvas');
      canvas.width = 1920;
      canvas.height = 1080;
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;

      // Fill background
      ctx.fillStyle = isDark ? '#000000' : '#ffffff';
      ctx.fillRect(0, 0, 1920, 1080);

      // Calculate scale to fit with padding
      const padding = 40;
      const maxW = 1920 - padding * 2;
      const maxH = 1080 - padding * 2;
      const scale = Math.min(maxW / img.width, maxH / img.height, 1);
      const drawW = img.width * scale;
      const drawH = img.height * scale;

      // Center
      const x = (1920 - drawW) / 2;
      const y = (1080 - drawH) / 2;

      ctx.drawImage(img, x, y, drawW, drawH);

      return canvas;
    } catch (err) {
      console.error('Export failed:', err);
      return null;
    } finally {
      showControlsAfterExport();
    }
  };

  const handleExportPNG = async () => {
    const canvas = await exportToCanvas();
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = 'mindmap-1920x1080.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handleExportSVG = async () => {
    const reactFlowWrapper = document.querySelector('.react-flow') as HTMLElement;
    if (!reactFlowWrapper) return;

    try {
      triggerFitView();
      await waitForFitView();
      hideControlsForExport();

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
    } finally {
      showControlsAfterExport();
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
