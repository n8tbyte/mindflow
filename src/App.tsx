import TextEditor from './components/TextEditor';
import MindMapCanvas from './components/MindMapCanvas';
import Toolbar from './components/Toolbar';

function App() {
  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-gray-50">
      {/* Top Toolbar */}
      <Toolbar />
      
      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Text Editor */}
        <TextEditor />
        
        {/* Right: Mind Map Canvas */}
        <MindMapCanvas />
      </div>
    </div>
  );
}

export default App;
