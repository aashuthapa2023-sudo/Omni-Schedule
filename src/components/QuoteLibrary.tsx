import React, { useState } from 'react';
import { Quote, FacebookPage } from '../types';
import {
  BookOpen,
  Search,
  Sparkles,
  Plus,
  Filter,
  Star,
  Copy,
  Check,
  Trash2,
  Share2,
  Tag,
  Wand2,
  Upload,
  Download,
  Layers,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

interface QuoteLibraryProps {
  quotes: Quote[];
  pages: FacebookPage[];
  activePage: FacebookPage;
  onSelectQuoteForStudio: (quote: Quote) => void;
  onAddQuote: (newQuote: Quote) => void;
  onDeleteQuote: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}

export const QuoteLibrary: React.FC<QuoteLibraryProps> = ({
  quotes,
  pages,
  activePage,
  onSelectQuoteForStudio,
  onAddQuote,
  onDeleteQuote,
  onToggleFavorite,
}) => {
  const [selectedNiche, setSelectedNiche] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterFavoritesOnly, setFilterFavoritesOnly] = useState<boolean>(false);
  const [selectedTag, setSelectedTag] = useState<string>('all');
  
  // Modals state
  const [isAiModalOpen, setIsAiModalOpen] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  
  // AI Generator state
  const [aiNiche, setAiNiche] = useState<string>(activePage.niche);
  const [aiTopic, setAiTopic] = useState<string>('reason, skepticism, and humanism in the universe');
  const [aiCount, setAiCount] = useState<number>(6);
  const [aiTone, setAiTone] = useState<string>('profound, poetic and thought-provoking');
  const [isGeneratingAi, setIsGeneratingAi] = useState<boolean>(false);
  const [aiSuccessMessage, setAiSuccessMessage] = useState<string>('');

  // Manual Add Quote Form
  const [newQuoteText, setNewQuoteText] = useState<string>('');
  const [newAuthor, setNewAuthor] = useState<string>('');
  const [newNiche, setNewNiche] = useState<string>(activePage.niche);
  const [newTags, setNewTags] = useState<string>('Reason, Philosophy');
  const [newMood, setNewMood] = useState<string>('Profound');

  // Copy indicator
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Extract all unique tags
  const allTags = Array.from(
    new Set(quotes.flatMap((q) => q.tags || []).filter(Boolean))
  );

  // Filtered quotes
  const filteredQuotes = quotes.filter((q) => {
    if (selectedNiche !== 'all' && q.niche !== selectedNiche) {
      return false;
    }
    if (filterFavoritesOnly && !q.isFavorite) {
      return false;
    }
    if (selectedTag !== 'all' && (!q.tags || !q.tags.includes(selectedTag))) {
      return false;
    }
    if (searchQuery.trim()) {
      const qLower = searchQuery.toLowerCase();
      const matchText = q.quote.toLowerCase().includes(qLower);
      const matchAuthor = q.author.toLowerCase().includes(qLower);
      const matchTags = q.tags?.some((t) => t.toLowerCase().includes(qLower));
      if (!matchText && !matchAuthor && !matchTags) return false;
    }
    return true;
  });

  // Handle AI Generator
  const handleGenerateAiQuotes = async () => {
    setIsGeneratingAi(true);
    setAiSuccessMessage('');
    try {
      const res = await fetch('/api/gemini/generate-quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          niche: aiNiche,
          topic: aiTopic,
          count: aiCount,
          tone: aiTone,
        }),
      });
      const data = await res.json();
      if (data.quotes && Array.isArray(data.quotes)) {
        data.quotes.forEach((qItem: any) => {
          onAddQuote({
            id: `quote-ai-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            quote: qItem.quote,
            author: qItem.author || 'Unknown',
            niche: qItem.niche || aiNiche,
            tags: qItem.tags || ['AI Generated', 'Wisdom'],
            mood: qItem.mood || 'Thoughtful',
            usedCount: 0,
            createdAt: new Date().toISOString(),
          });
        });
        setAiSuccessMessage(`Successfully generated and added ${data.quotes.length} new quotes to your library!`);
      }
    } catch (e) {
      console.error('Error generating AI quotes', e);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // Handle Manual Add
  const handleManualAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuoteText.trim()) return;

    onAddQuote({
      id: `quote-manual-${Date.now()}`,
      quote: newQuoteText.trim(),
      author: newAuthor.trim() || 'Anonymous',
      niche: newNiche,
      tags: newTags.split(',').map((t) => t.trim()).filter(Boolean),
      mood: newMood,
      usedCount: 0,
      createdAt: new Date().toISOString(),
    });

    setNewQuoteText('');
    setNewAuthor('');
    setIsAddModalOpen(false);
  };

  const handleCopyQuote = (quote: Quote) => {
    navigator.clipboard.writeText(`"${quote.quote}" — ${quote.author}`);
    setCopiedId(quote.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BookOpen className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-bold text-white">Niche Quote Library & Knowledge Base</h2>
          </div>
          <p className="text-xs text-slate-400">
            Over {quotes.length} curated quotes categorized across Atheism, Stoicism, Science, Cyberpunk & Philosophy pages.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsAiModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-500/20 transition-all transform active:scale-95"
          >
            <Sparkles className="w-4 h-4" />
            <span>AI Quote Generator (Gemini)</span>
          </button>
          
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2.5 bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white rounded-xl text-xs font-semibold border border-slate-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Custom Quote</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          
          {/* Search Input */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search quotes, authors, or topics..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Niche Selector */}
          <div className="md:col-span-4">
            <select
              value={selectedNiche}
              onChange={(e) => setSelectedNiche(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="all">All Niches ({quotes.length} quotes)</option>
              {Array.from(new Set(quotes.map((q) => q.niche))).map((niche) => (
                <option key={niche} value={niche}>
                  {niche}
                </option>
              ))}
            </select>
          </div>

          {/* Favorites Toggle */}
          <div className="md:col-span-3 flex items-center gap-2">
            <button
              onClick={() => setFilterFavoritesOnly(!filterFavoritesOnly)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                filterFavoritesOnly
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${filterFavoritesOnly ? 'fill-amber-400 text-amber-400' : ''}`} />
              <span>Favorites Only</span>
            </button>
          </div>
        </div>

        {/* Tag Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 text-xs no-scrollbar">
          <span className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
            <Tag className="w-3 h-3" />
            <span>Tags:</span>
          </span>
          <button
            onClick={() => setSelectedTag('all')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium shrink-0 transition-colors ${
              selectedTag === 'all'
                ? 'bg-indigo-600 text-white font-bold'
                : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            All
          </button>
          {allTags.slice(0, 14).map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium shrink-0 transition-colors ${
                selectedTag === tag
                  ? 'bg-indigo-600 text-white font-bold'
                  : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>

      {/* Quote Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredQuotes.map((quote) => (
          <div
            key={quote.id}
            className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 hover:shadow-xl hover:shadow-indigo-500/5 group"
          >
            <div>
              {/* Card Header: Niche & Favorite */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 font-semibold truncate max-w-[200px]">
                  {quote.niche}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onToggleFavorite(quote.id)}
                    className="p-1 text-slate-400 hover:text-amber-400 transition-colors"
                  >
                    <Star
                      className={`w-4 h-4 ${
                        quote.isFavorite ? 'fill-amber-400 text-amber-400' : ''
                      }`}
                    />
                  </button>
                  <button
                    onClick={() => onDeleteQuote(quote.id)}
                    className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                    title="Delete quote"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Quote Text */}
              <p className="text-sm font-medium text-slate-100 italic leading-relaxed mb-3">
                “{quote.quote}”
              </p>

              {/* Author Attribution */}
              <div className="text-xs font-bold text-indigo-300 mb-3 flex items-center justify-between">
                <span>— {quote.author}</span>
                {quote.mood && (
                  <span className="text-[10px] text-slate-400 font-mono">[{quote.mood}]</span>
                )}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-4">
                {quote.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Card Actions */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
              <button
                onClick={() => handleCopyQuote(quote)}
                className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg text-xs font-medium border border-slate-800 transition-colors"
              >
                {copiedId === quote.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>

              <button
                onClick={() => onSelectQuoteForStudio(quote)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold shadow-md shadow-indigo-600/30 transition-colors"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Stamp on Canvas</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredQuotes.length === 0 && (
        <div className="text-center py-12 bg-slate-900 border border-slate-800 rounded-2xl">
          <BookOpen className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-slate-300">No quotes match your filters</h3>
          <p className="text-xs text-slate-500 mt-1">Try resetting the search or generating new quotes with AI</p>
        </div>
      )}

      {/* AI GENERATOR MODAL */}
      {isAiModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-bold text-white">Generate Niche Quotes with Gemini AI</h3>
              </div>
              <button
                onClick={() => setIsAiModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {aiSuccessMessage && (
              <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs p-3 rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{aiSuccessMessage}</span>
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1 block">
                  Target Facebook Page & Niche
                </label>
                <select
                  value={aiNiche}
                  onChange={(e) => setAiNiche(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  {pages.map((p) => (
                    <option key={p.id} value={p.niche}>
                      {p.name} — ({p.niche})
                    </option>
                  ))}
                  <option value="Atheism, Freethought & Scientific Reason">Atheism & Freethought</option>
                  <option value="Stoic Philosophy & Inner Discipline">Stoic Philosophy</option>
                  <option value="Astronomy, Cosmos & Deep Space Awe">Cosmos & Astronomy</option>
                  <option value="Dark Academia, Existentialism & Solitude">Dark Academia & Solitude</option>
                  <option value="Cyberpunk, Future Tech & Digital Philosophy">Cyberpunk Tech</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1 block">
                  Specific Topic / Focus
                </label>
                <input
                  type="text"
                  value={aiTopic}
                  onChange={(e) => setAiTopic(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  placeholder="e.g. freethought, logic vs dogma, cosmic humility, stoic calm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1 block">
                    Quantity
                  </label>
                  <select
                    value={aiCount}
                    onChange={(e) => setAiCount(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value={3}>3 Quotes</option>
                    <option value={6}>6 Quotes (Standard)</option>
                    <option value={10}>10 Quotes (Batch)</option>
                    <option value={15}>15 Quotes (Max)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1 block">
                    Tone / Style
                  </label>
                  <select
                    value={aiTone}
                    onChange={(e) => setAiTone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="profound and philosophical">Profound & Philosophical</option>
                    <option value="bold, skeptical and uncompromising">Bold & Skeptical</option>
                    <option value="poetic and awe-inspiring">Poetic & Awe-Inspiring</option>
                    <option value="short, punchy and memorable">Short & Punchy</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
              <button
                onClick={() => setIsAiModalOpen(false)}
                className="px-4 py-2 text-xs text-slate-400 hover:text-white"
              >
                Close
              </button>
              <button
                onClick={handleGenerateAiQuotes}
                disabled={isGeneratingAi}
                className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isGeneratingAi ? 'Generating Quotes...' : 'Generate & Add to Library'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD CUSTOM QUOTE MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Add Custom Quote</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleManualAdd} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1 block">Quote Text</label>
                <textarea
                  value={newQuoteText}
                  onChange={(e) => setNewQuoteText(e.target.value)}
                  rows={3}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500 resize-none"
                  placeholder="Enter quote words..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1 block">Author / Thinker</label>
                  <input
                    type="text"
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                    placeholder="e.g. Carl Sagan"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1 block">Target Niche</label>
                  <select
                    value={newNiche}
                    onChange={(e) => setNewNiche(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    {pages.map((p) => (
                      <option key={p.id} value={p.niche}>
                        {p.niche}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1 block">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={newTags}
                    onChange={(e) => setNewTags(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                    placeholder="Reason, Logic, Cosmos"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1 block">Mood</label>
                  <input
                    type="text"
                    value={newMood}
                    onChange={(e) => setNewMood(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                    placeholder="Profound, Defiant, Calming"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow transition-colors"
                >
                  Save Quote
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
