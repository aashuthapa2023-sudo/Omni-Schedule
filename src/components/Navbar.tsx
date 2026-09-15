import React from 'react';
import { FacebookPage } from '../types';
import {
  Sparkles,
  Layers,
  Calendar,
  Settings,
  Plus,
  Zap,
  CheckCircle2,
  Send,
  Eye,
  Bot,
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'pages' | 'scheduler' | 'studio';
  setActiveTab: (tab: 'pages' | 'scheduler' | 'studio') => void;
  pages: FacebookPage[];
  activePage: FacebookPage;
  onSelectPage: (pageId: string) => void;
  onOpenNewPageModal: () => void;
  onLaunchAutoPilotAll?: () => void;
  onOpenStackVerification?: () => void;
  onOpenTelegramHub?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  pages,
  activePage,
  onSelectPage,
  onOpenNewPageModal,
  onLaunchAutoPilotAll,
  onOpenStackVerification,
  onOpenTelegramHub,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-slate-100 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Brand */}
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => setActiveTab('pages')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-indigo-600 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Zap className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-white">AutoPilot Factory</span>
                <span className="px-1.5 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Auto-Pilot Active
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Multi-Page 7-Day Auto-Tune & Publishing Engine
              </p>
            </div>
          </div>

          {/* Streamlined Core Navigation Tabs */}
          <nav className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('pages')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'pages'
                  ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-850'
              }`}
            >
              <Settings className="w-4 h-4 text-indigo-400" />
              <span>AutoPilot Hub</span>
              <span className="px-1.5 py-0.2 rounded-full bg-indigo-500/30 text-[10px] text-indigo-200">
                {pages.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('scheduler')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'scheduler'
                  ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-850'
              }`}
            >
              <Calendar className="w-4 h-4 text-cyan-400" />
              <span>7-Day Queue</span>
            </button>

            <button
              onClick={() => setActiveTab('studio')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'studio'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-850'
              }`}
            >
              <Eye className="w-4 h-4 text-emerald-400" />
              <span>Preview & Publish</span>
            </button>
          </nav>

          {/* Right Action: Active Page Selector & 1-Click Launch */}
          <div className="flex items-center gap-2.5">
            {/* Page Quick Switcher */}
            <select
              value={activePage.id}
              onChange={(e) => onSelectPage(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-xs font-bold text-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500 max-w-[160px] sm:max-w-[200px] truncate"
            >
              {pages.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>

            {/* Telegram Bot Hub Modal Trigger */}
            {onOpenTelegramHub && (
              <button
                onClick={onOpenTelegramHub}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-500/20 hover:bg-sky-500/30 border border-sky-500/30 hover:border-sky-400 text-sky-200 text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer"
                title="Telegram Bot Hub, Auto-Alerts & Instant Broadcast"
              >
                <Bot className="w-3.5 h-3.5 text-sky-400" />
                <span className="hidden sm:inline">Telegram Bot</span>
                <span className="sm:hidden">TG</span>
              </button>
            )}

            {/* Stack Verification Modal Trigger */}
            {onOpenStackVerification && (
              <button
                onClick={onOpenStackVerification}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500/20 to-indigo-500/20 hover:from-amber-500/30 hover:to-indigo-500/30 border border-amber-500/30 hover:border-amber-400/50 text-amber-200 text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer"
                title="Test all 7 stack layers and inspect generated artifacts"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Stack & Artifacts Test</span>
                <span className="sm:hidden">Test</span>
              </button>
            )}

            {/* Quick Add Page */}
            <button
              onClick={onOpenNewPageModal}
              className="p-2 bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white rounded-xl border border-slate-700 transition-colors cursor-pointer"
              title="Add New Facebook Page"
            >
              <Plus className="w-4 h-4 text-indigo-400 stroke-[2.5]" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
