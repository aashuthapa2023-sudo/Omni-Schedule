import React, { useState } from 'react';
import { OpenSourceImage, OPEN_SOURCE_IMAGE_LIBRARIES } from '../data/openSourceLibraries';
import { FacebookPage } from '../types';
import {
  Globe,
  Search,
  ShieldCheck,
  Sparkles,
  Layers,
  Copy,
  Check,
  Download,
  ExternalLink,
  Filter,
  Eye,
  X,
  Flag,
  Rocket,
  Landmark,
  BookOpen,
  Trees,
  Cpu,
  ArrowRight,
} from 'lucide-react';

interface OpenSourceImageGalleryProps {
  activePage: FacebookPage;
  onSelectImageForStudio: (imageUrl: string, suggestedQuote?: { quote: string; author: string }) => void;
}

export const OpenSourceImageGallery: React.FC<OpenSourceImageGalleryProps> = ({
  activePage,
  onSelectImageForStudio,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(() => {
    if (activePage.nicheCategory === 'military') return 'military';
    if (activePage.nicheCategory === 'science' || activePage.nicheCategory === 'atheism') return 'nasa-cosmos';
    if (activePage.nicheCategory === 'stoicism') return 'classical-stoic';
    if (activePage.nicheCategory === 'existentialism') return 'dark-academia';
    if (activePage.nicheCategory === 'cyberpunk') return 'cyberpunk-tech';
    return 'all';
  });
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [previewModalImage, setPreviewModalImage] = useState<OpenSourceImage | null>(null);

  // Categories config
  const categories = [
    { id: 'all', label: 'All Global Libraries', icon: Globe, count: OPEN_SOURCE_IMAGE_LIBRARIES.length },
    {
      id: 'military',
      label: '🇺🇸 US Army & Patriotism (DoD / DVIDS)',
      icon: Flag,
      count: OPEN_SOURCE_IMAGE_LIBRARIES.filter((img) => img.category === 'military').length,
      badge: 'Public Domain',
    },
    {
      id: 'nasa-cosmos',
      label: '🚀 NASA & Cosmos Archives',
      icon: Rocket,
      count: OPEN_SOURCE_IMAGE_LIBRARIES.filter((img) => img.category === 'nasa-cosmos').length,
      badge: 'NASA CC0',
    },
    {
      id: 'classical-stoic',
      label: '🏛️ Met Museum & Stoic Marbles',
      icon: Landmark,
      count: OPEN_SOURCE_IMAGE_LIBRARIES.filter((img) => img.category === 'classical-stoic').length,
      badge: 'Met CC0',
    },
    {
      id: 'dark-academia',
      label: '📚 Dark Academia & History',
      icon: BookOpen,
      count: OPEN_SOURCE_IMAGE_LIBRARIES.filter((img) => img.category === 'dark-academia').length,
      badge: 'Smithsonian',
    },
    {
      id: 'nordic-solitude',
      label: '🌲 Nordic Solitude & Nature',
      icon: Trees,
      count: OPEN_SOURCE_IMAGE_LIBRARIES.filter((img) => img.category === 'nordic-solitude').length,
      badge: 'Public Domain',
    },
    {
      id: 'cyberpunk-tech',
      label: '⚡ Cyberpunk & Urban Noir',
      icon: Cpu,
      count: OPEN_SOURCE_IMAGE_LIBRARIES.filter((img) => img.category === 'cyberpunk-tech').length,
      badge: 'Creative Commons',
    },
  ];

  // Filter images
  const filteredImages = OPEN_SOURCE_IMAGE_LIBRARIES.filter((img) => {
    if (selectedCategory !== 'all' && img.category !== selectedCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = img.title.toLowerCase().includes(q);
      const matchDesc = img.description.toLowerCase().includes(q);
      const matchTags = img.tags.some((t) => t.toLowerCase().includes(q));
      const matchSource = img.source.toLowerCase().includes(q);
      const matchAuthor = img.authorOrCredit.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchTags && !matchSource && !matchAuthor) {
        return false;
      }
    }
    return true;
  });

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-fade-in">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/70 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Globe className="w-5 h-5 text-indigo-400" />
              <h2 className="text-lg font-bold text-white">Global Free & Open-Source Image Archives</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> 100% Free / Public Domain & CC0
              </span>
            </div>
            <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
              Curated, full-resolution open archives from the <strong>U.S. Department of Defense (DVIDS)</strong>, <strong>NASA Space Telescopes</strong>, <strong>The Metropolitan Museum of Art</strong>, and <strong>Smithsonian Institution</strong>. Perfect 4K/8K backgrounds for your social quote designs.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">
              Active Target Niche: <strong className="text-amber-300 font-semibold">{activePage.name}</strong>
            </span>
          </div>
        </div>

        {/* Search & Stats Bar */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search military training, soldier silhouette, NASA nebula, Marcus Aurelius marble, deep forest..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 px-4 py-2 rounded-xl text-xs text-slate-300 shrink-0">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Showing <strong>{filteredImages.length}</strong> Curated Free HD Assets</span>
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border shrink-0 ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-850 hover:border-slate-700'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-indigo-400'}`} />
              <span>{cat.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-black/30 text-white' : 'bg-slate-800 text-slate-400'}`}>
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Image Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredImages.map((image) => (
          <div
            key={image.id}
            className="group bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-2xl overflow-hidden shadow-lg transition-all flex flex-col justify-between"
          >
            {/* Image Preview Container */}
            <div className="relative aspect-[4/3] bg-black overflow-hidden">
              <img
                src={image.thumbnailUrl}
                alt={image.title}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {/* License Badge Top Left */}
              <div className="absolute top-2.5 left-2.5">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-black/80 backdrop-blur-md border border-white/20 text-emerald-300">
                  {image.license}
                </span>
              </div>

              {/* Resolution Tag Top Right */}
              <div className="absolute top-2.5 right-2.5">
                <span className="px-1.5 py-0.5 rounded-md text-[9px] font-mono bg-black/80 backdrop-blur-md border border-white/10 text-slate-300">
                  {image.dimensions}
                </span>
              </div>

              {/* Hover Overlay Actions */}
              <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2.5 p-4">
                <button
                  onClick={() => onSelectImageForStudio(image.url, image.suggestedQuotes?.[0])}
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Apply to Quote Studio</span>
                </button>

                <div className="flex items-center gap-2 w-full">
                  <button
                    onClick={() => setPreviewModalImage(image)}
                    className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg flex items-center justify-center gap-1 transition-colors border border-slate-700"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>HD Preview</span>
                  </button>

                  <button
                    onClick={() => handleCopyUrl(image.url)}
                    className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs transition-colors border border-slate-700"
                    title="Copy direct image URL"
                  >
                    {copiedUrl === image.url ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Card Content & Details */}
            <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold text-white line-clamp-1 group-hover:text-indigo-300 transition-colors">
                  {image.title}
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">
                  {image.description}
                </p>
              </div>

              {/* Source & Credits */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                <span className="text-slate-400 truncate max-w-[170px]" title={image.source}>
                  🏛️ {image.source}
                </span>
                <span className="text-indigo-400 font-medium truncate max-w-[100px]">
                  {image.authorOrCredit}
                </span>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1">
                {image.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="text-[9px] px-1.5 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Suggested Quote Quick Trigger */}
              {image.suggestedQuotes && image.suggestedQuotes.length > 0 && (
                <div className="pt-2 border-t border-slate-800/80">
                  <button
                    onClick={() => onSelectImageForStudio(image.url, image.suggestedQuotes![0])}
                    className="w-full text-left p-2 rounded-lg bg-slate-950 hover:bg-indigo-950/40 border border-slate-800 hover:border-indigo-500/40 transition-colors group/quote"
                  >
                    <div className="text-[9px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1 mb-0.5">
                      <Sparkles className="w-2.5 h-2.5 text-amber-400" /> Suggested Quote
                    </div>
                    <div className="text-[11px] text-slate-300 italic line-clamp-1 group-hover/quote:text-white">
                      "{image.suggestedQuotes[0].quote}"
                    </div>
                    <div className="text-[9px] text-slate-400 mt-0.5">
                      — {image.suggestedQuotes[0].author}
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Full Resolution Preview Modal */}
      {previewModalImage && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl space-y-4 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">{previewModalImage.title}</h3>
                <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                  <span className="text-emerald-400 font-semibold">{previewModalImage.license}</span>
                  <span>•</span>
                  <span>{previewModalImage.source}</span>
                  <span>•</span>
                  <span className="font-mono">{previewModalImage.dimensions}</span>
                </div>
              </div>
              <button
                onClick={() => setPreviewModalImage(null)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative rounded-xl overflow-hidden bg-black max-h-[60vh] flex items-center justify-center">
              <img
                src={previewModalImage.url}
                alt={previewModalImage.title}
                className="max-h-[60vh] w-auto object-contain rounded-lg"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800">
              <div className="text-xs text-slate-400 max-w-lg">
                {previewModalImage.description}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopyUrl(previewModalImage.url)}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors flex items-center gap-1.5"
                >
                  {copiedUrl === previewModalImage.url ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Direct URL</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => {
                    onSelectImageForStudio(previewModalImage.url, previewModalImage.suggestedQuotes?.[0]);
                    setPreviewModalImage(null);
                  }}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg flex items-center gap-1.5 transition-colors"
                >
                  <Layers className="w-4 h-4" />
                  <span>Load Into Quote Studio</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
