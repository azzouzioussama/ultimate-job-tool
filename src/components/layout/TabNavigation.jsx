/**
 * ============================================================================
 * FILE: TabNavigation.jsx
 * PURPOSE: The horizontal tab bar for switching between app views.
 * ============================================================================
 *
 * WHAT IS THIS?
 * The row of buttons under the header: Prompts, Assistant IA, Offre,
 * Mon CV, PDF Maker, Test ATS. Clicking a tab changes the active view.
 *
 * HOW TO ADD A NEW TAB:
 * 1. Import the icon you want from 'lucide-react'.
 * 2. Add a new object to the `tabs` array below with { id, icon, label }.
 * 3. Create the corresponding tab component in src/components/tabs/.
 * 4. Add a rendering block for the new tab in App.jsx.
 *
 * PROPS:
 *   - activeTab:   The currently active tab id (string).
 *   - onTabChange: Function called with the new tab id when user clicks.
 */


import { Settings, Bot, FileText, User, FileOutput, Activity, LayoutDashboard } from 'lucide-react';

// ── Tab Definitions ──────────────────────────────────────────────────────────
// Each tab has an id (used for logic), an icon (from lucide-react),
// and a label (displayed in the UI).
const tabs = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'templates', icon: Settings,   label: 'Prompts' },
  { id: 'ai',        icon: Bot,        label: 'Assistant IA' },
  { id: 'job',       icon: FileText,   label: 'Offre' },
  { id: 'cv',        icon: User,       label: 'Mon CV' },
  { id: 'pdf',       icon: FileOutput, label: 'PDF Maker' },
  { id: 'ats',       icon: Activity,   label: 'Test ATS' },
];

export default function TabNavigation({ activeTab, onTabChange }) {
  return (
    <div className="max-w-5xl mx-auto px-4 border-t border-slate-100 bg-white flex overflow-x-auto custom-scrollbar">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex-1 min-w-[120px] py-3 text-sm font-medium border-b-2 flex justify-center items-center gap-2 transition-colors whitespace-nowrap ${
            activeTab === tab.id
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <tab.icon size={16} /> <span>{tab.label}</span>
        </button>
      ))}
    </div>
  );
}
