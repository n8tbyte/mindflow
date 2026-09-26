import TextEditor from './components/TextEditor';
import MindMapCanvas from './components/MindMapCanvas';
import Toolbar from './components/Toolbar';
import { useMindMapStore } from './store/mindmapStore';

function App() {
  const theme = useMindMapStore((s) => s.theme);
  const isDark = theme === 'dark';

  return (
    <div className={`h-screen w-screen flex flex-col overflow-hidden ${
      isDark ? 'bg-[#000000]' : 'bg-gray-50'
    }`}>
      <Toolbar />
      <div className="flex-1 flex overflow-hidden">
        <TextEditor />
        <MindMapCanvas />
      </div>
    </div>
  );
}

export default App;
