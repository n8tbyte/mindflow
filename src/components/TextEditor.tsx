import { useRef, useState } from 'react';
import { useMindMapStore } from '../store/mindmapStore';

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
  const theme = useMindMapStore((s) => s.theme);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isDark = theme === 'dark';
  const lineCount = text.split('\n').length;

  const handleTab = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      if (e.shiftKey) {
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
        const newText = text.substring(0, start) + '  ' + text.substring(end);
        setText(newText);
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = start + 2;
        }, 0);
      }
    }
  };

  const panelBg = isDark ? 'bg-[#1C1C1E]' : 'bg-white';
  const borderColor = isDark ? 'border-[#2C2C2E]' : 'border-gray-200';
  const textColor = isDark ? 'text-white' : 'text-gray-900';
  const subtextColor = isDark ? 'text-gray-500' : 'text-gray-500';
  const exampleBtn = isDark 
    ? 'bg-[#2C2C2E] hover:bg-[#3A3A3C] text-gray-300' 
    : 'bg-gray-100 hover:bg-gray-200 text-gray-700';
  const textareaBg = isDark ? 'bg-[#000000] text-white placeholder-gray-600' : 'bg-white text-gray-900 placeholder-gray-400';
  const footerBg = isDark ? 'bg-[#1C1C1E] text-gray-500' : 'bg-gray-50 text-gray-500';

  return (
    <div
      className={`flex flex-col border-r transition-all duration-300 ${
        isCollapsed ? 'w-12' : 'w-[400px]'
      } ${panelBg} ${borderColor}`}
    >
      {/* Header */}
      <div className={`flex items-center justify-between px-4 py-2.5 border-b ${borderColor}`}>
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <h2 className={`text-sm font-medium ${textColor}`}>Editor</h2>
            <span className={`text-xs ${subtextColor}`}>({lineCount} lines)</span>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`px-2 py-1 text-xs rounded transition-colors ${
            isDark ? 'hover:bg-[#2C2C2E] text-gray-400' : 'hover:bg-gray-100 text-gray-500'
          }`}
          title={isCollapsed ? 'Expand' : 'Collapse'}
        >
          {isCollapsed ? '→' : '←'}
        </button>
      </div>

      {!isCollapsed && (
        <>
          {/* Examples */}
          <div className={`px-3 py-2 border-b ${borderColor} flex items-center gap-2 flex-wrap`}>
            <span className={`text-xs ${subtextColor}`}>Examples:</span>
            {exampleTexts.map((example) => (
              <button
                key={example.name}
                onClick={() => setText(example.text)}
                className={`text-xs px-2 py-1 rounded transition-colors ${exampleBtn}`}
              >
                {example.name}
              </button>
            ))}
            <button
              onClick={() => setText('')}
              className={`text-xs px-2 py-1 rounded transition-colors ${exampleBtn}`}
            >
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
              className={`w-full h-full p-4 font-mono text-sm leading-relaxed resize-none outline-none ${textareaBg}`}
              placeholder="Type your outline here...&#10;&#10;Use indentation (Tab or 2 spaces)&#10;to create hierarchy:&#10;&#10;Root Topic&#10;  Sub Topic&#10;    Detail&#10;  Another Sub Topic"
              spellCheck={false}
            />
          </div>

          {/* Footer hint */}
          <div className={`px-4 py-2 border-t ${borderColor} ${footerBg}`}>
            <p className="text-xs">
              Tab to indent • Shift+Tab to outdent • Double-click node to edit
            </p>
          </div>
        </>
      )}
    </div>
  );
}
