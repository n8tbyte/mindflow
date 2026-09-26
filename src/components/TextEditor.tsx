import { useRef, useState } from 'react';
import { useMindMapStore } from '../store/mindmapStore';
import { FileText, Sparkles, RotateCcw } from 'lucide-react';

const exampleTexts = [
  {
    name: 'Project Plan',
    text: `My Project
  Planning
    Define Goals
    Research
    Timeline
  Design
    Wireframes
    UI Design
    Prototyping
  Development
    Frontend
      React
      Tailwind CSS
    Backend
      API Design
      Database
  Testing
    Unit Tests
    Integration Tests
  Launch
    Marketing
    Deployment`,
  },
  {
    name: 'Book Summary',
    text: `Atomic Habits
  The Fundamentals
    Why Tiny Changes Matter
    Identity-Based Habits
    The Habit Loop
  The 4 Laws
    Make It Obvious
    Make It Attractive
    Make It Easy
    Make It Satisfying
  Advanced Tactics
    Genetics and Talent
    The Goldilocks Rule
    Review and Reflection`,
  },
  {
    name: 'Meeting Notes',
    text: `Team Meeting - Q4 Planning
  Review Last Quarter
    Revenue Growth
    Customer Feedback
    Team Performance
  Q4 Goals
    Product Launch
      New Features
      Beta Testing
      Marketing Campaign
    Customer Success
      Onboarding Improvement
      Support Response Time
    Team Growth
      Hiring Plan
      Training Programs
  Action Items
    Assign Owners
    Set Deadlines
    Schedule Check-ins`,
  },
];

export default function TextEditor() {
  const text = useMindMapStore((s) => s.text);
  const setText = useMindMapStore((s) => s.setText);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const lineCount = text.split('\n').length;

  const handleTab = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      if (e.shiftKey) {
        // Remove indent
        const beforeCursor = text.substring(0, start);
        const lineStart = beforeCursor.lastIndexOf('\n') + 1;
        const linePrefix = text.substring(lineStart, start);
        if (linePrefix.startsWith('  ')) {
          const newText = text.substring(0, lineStart) + text.substring(lineStart + 2);
          setText(newText);
          setTimeout(() => {
            textarea.selectionStart = Math.max(start - 2, lineStart);
            textarea.selectionEnd = Math.max(end - 2, lineStart);
          }, 0);
        }
      } else {
        // Add indent
        const newText = text.substring(0, start) + '  ' + text.substring(end);
        setText(newText);
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = start + 2;
        }, 0);
      }
    }
  };

  return (
    <div
      className={`flex flex-col bg-white border-r border-gray-200 transition-all duration-300 ${
        isCollapsed ? 'w-12' : 'w-[400px]'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-600" />
            <h2 className="text-sm font-semibold text-gray-700">Text Editor</h2>
            <span className="text-xs text-gray-400 ml-1">({lineCount} lines)</span>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-lg hover:bg-white/80 transition-colors text-gray-500"
          title={isCollapsed ? 'Expand' : 'Collapse'}
        >
          <Sparkles className="w-4 h-4" />
        </button>
      </div>

      {!isCollapsed && (
        <>
          {/* Examples */}
          <div className="px-3 py-2 border-b border-gray-100 flex items-center gap-2 flex-wrap">
            <span className="text-xs text-gray-400">Examples:</span>
            {exampleTexts.map((example) => (
              <button
                key={example.name}
                onClick={() => setText(example.text)}
                className="text-xs px-2 py-1 rounded-md bg-gray-100 hover:bg-indigo-100 hover:text-indigo-700 text-gray-600 transition-colors"
              >
                {example.name}
              </button>
            ))}
            <button
              onClick={() => setText('')}
              className="text-xs px-2 py-1 rounded-md bg-gray-100 hover:bg-red-100 hover:text-red-700 text-gray-600 transition-colors flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              Clear
            </button>
          </div>

          {/* Textarea */}
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleTab}
              className="w-full h-full p-4 font-mono text-sm leading-relaxed resize-none outline-none bg-white text-gray-800 placeholder-gray-300"
              placeholder="Type your outline here...&#10;&#10;Use indentation (Tab or 2 spaces)&#10;to create hierarchy:&#10;&#10;Root Topic&#10;  Sub Topic&#10;    Detail&#10;  Another Sub Topic"
              spellCheck={false}
            />
          </div>

          {/* Footer hint */}
          <div className="px-4 py-2 border-t border-gray-100 bg-gray-50">
            <p className="text-xs text-gray-400">
              💡 <strong>Tab</strong> to indent • <strong>Shift+Tab</strong> to outdent • <strong>Double-click</strong> node to edit
            </p>
          </div>
        </>
      )}
    </div>
  );
}
