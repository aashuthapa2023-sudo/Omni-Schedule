import React, { useState } from 'react';
import { AestheticStyle, AspectRatio, FacebookPage } from '../types';
import { AESTHETIC_STYLES } from '../data/defaultData';
import { generateAestheticImage, PERCHANCE_ART_STYLES, PerchanceArtStyle } from '../utils/imageGenerator';
import {
  Sparkles,
  Wand2,
  Image as ImageIcon,
  ArrowRight,
  Layers,
  RefreshCw,
  Activity,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Cpu,
  Palette,
} from 'lucide-react';

interface AestheticImageEngineProps {
  activePage: FacebookPage;
  onSelectImageForStudio: (imageUrl: string, prompt: string) => void;
}

export const AestheticImageEngine: React.FC<AestheticImageEngineProps> = ({
  activePage,
  onSelectImageForStudio,
}) => {
  const [prompt, setPrompt] = useState<string>(
    'a lone girl in a dense green jungle, tall trees, sunlight filtering through canopy'
  );
  const [selectedStyleId, setSelectedStyleId] = useState<string>(AESTHETIC_STYLES[0].id);
  const [selectedPerchanceStyleId, setSelectedPerchanceStyleId] = useState<string>('studio-ghibli');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('4:5');
  const [seed, setSeed] = useState<number>(() => Math.floor(Math.random() * 9999999));
  const [selectedEngine, setSelectedEngine] = useState<'perchance' | 'pollinations'>('perchance');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isEnhancing, setIsEnhancing] = useState<boolean>(false);
  const [isTestingSources, setIsTestingSources] = useState<boolean>(false);
  const [batchCount, setBatchCount] = useState<number>(1);
  const [diagnosticResult, setDiagnosticResult] = useState<{
    primary?: { name: string; status: string; latencyMs: number; message?: string };
    secondary?: { name: string; status: string; latencyMs: number; message?: string };
  } | null>(null);

  // Gallery of generated results with engine metadata
  const [generatedGallery, setGeneratedGallery] = useState<Array<{
    url: string;
    prompt: string;
    seed: number;
    source: string;
    engine: string;
    timestamp: string;
  }>>([
    {
      url: 'https://images.unsplash.com/photo-1511497584788-87676104235f?w=1080&auto=format&fit=crop&q=85',
      prompt: 'a lone girl in a dense jungle, Studio Ghibli style, lush green foliage',
      seed: 774812,
      source: 'perchance',
      engine: 'Perchance AI (DREAMSHAPER [Studio Ghibli (Hayao Miyazaki)])',
      timestamp: 'Just now',
    },
    {
      url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1080&auto=format&fit=crop&q=85',
      prompt: 'Cinematic deep cosmic nebula with ethereal starlight dust',
      seed: 421098,
      source: 'perchance',
      engine: 'Perchance AI (Flux Chiaroscuro)',
      timestamp: '5 min ago',
    },
  ]);

  const [activePreviewImage, setActivePreviewImage] = useState<string>(generatedGallery[0].url);
  const [activePreviewEngine, setActivePreviewEngine] = useState<string>(generatedGallery[0].engine);

  const [lastFallbackInfo, setLastFallbackInfo] = useState<{
    triggered: boolean;
    engine: string;
    notice?: string;
  } | null>(null);

  // Apply a style preset
  const handleApplyStyle = (style: AestheticStyle) => {
    setSelectedStyleId(style.id);
    setPrompt(style.promptModifier);
    setAspectRatio(style.recommendedAspect);
  };

  // Enhance prompt with Gemini AI
  const handleEnhancePrompt = async () => {
    setIsEnhancing(true);
    try {
      const res = await fetch('/api/gemini/enhance-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          basePrompt: prompt,
          niche: activePage.niche,
          style: 'Perchance Studio Ghibli and anime character illustration style with lush organic scenery',
        }),
      });
      const data = await res.json();
      if (data.enhancedPrompt) {
        setPrompt(data.enhancedPrompt);
      }
    } catch (e) {
      console.error('Enhance prompt failed', e);
    } finally {
      setIsEnhancing(false);
    }
  };

  // Run live diagnostic test on Perchance (Primary) and Pollinations (Secondary)
  const handleTestImageSources = async () => {
    setIsTestingSources(true);
    try {
      const res = await fetch('/api/test-image-sources');
      const data = await res.json();
      setDiagnosticResult(data);
    } catch (e) {
      console.error('Test sources error', e);
    } finally {
      setIsTestingSources(false);
    }
  };

  // Generate Image with selected Perchance Art Style
  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setLastFallbackInfo(null);

    try {
      const targetHeight = aspectRatio === '4:5' ? 1350 : aspectRatio === '9:16' ? 1920 : 1080;
      const countToGen = Math.min(batchCount, 3);
      const newOutputs = [];

      for (let i = 0; i < countToGen; i++) {
        const currentSeed = i === 0 ? seed : Math.floor(Math.random() * 9999999);
        const result = await generateAestheticImage({
          prompt,
          seed: currentSeed,
          engine: selectedEngine,
          artStyle: selectedPerchanceStyleId,
          width: 1080,
          height: targetHeight,
        });

        if (result.imageUrl) {
          if (i === 0) {
            setActivePreviewImage(result.imageUrl);
            setActivePreviewEngine(result.engine);
            if (result.fallbackTriggered) {
              setLastFallbackInfo({
                triggered: true,
                engine: result.engine,
                notice: `Rendered with optimal resolution via ${result.engine}.`,
              });
            }
          }

          newOutputs.push({
            url: result.imageUrl,
            prompt,
            seed: currentSeed,
            source: result.source,
            engine: result.engine,
            timestamp: 'Just now',
          });
        }
      }

      if (newOutputs.length > 0) {
        setGeneratedGallery((prev) => [...newOutputs, ...prev]);
      }
    } catch (e) {
      console.error('Generate image error', e);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Header Banner & Dual-Engine Status */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <h2 className="text-lg font-bold text-white">Aesthetic AI Image Engine</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-950/80 border border-cyan-500/40 text-cyan-300">
                Primary: Perchance AI
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 border border-slate-700 text-slate-400">
                Secondary: Pollinations
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Generating high-impact chiaroscuro imagery for <strong className="text-slate-200">{activePage.name}</strong> ({activePage.niche}) with automatic failover protection.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleTestImageSources}
              disabled={isTestingSources}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-750 text-cyan-300 rounded-xl text-xs font-semibold border border-slate-700 hover:border-cyan-500/40 transition-colors"
            >
              <Activity className={`w-3.5 h-3.5 ${isTestingSources ? 'animate-spin' : 'text-cyan-400'}`} />
              <span>{isTestingSources ? 'Testing Engines...' : 'Test Image Sources'}</span>
            </button>

            <button
              onClick={() => setSeed(Math.floor(Math.random() * 9999999))}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-750 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Seed: {seed}</span>
            </button>
          </div>
        </div>

        {/* Active Failover Notice */}
        {lastFallbackInfo && (
          <div className="p-3 bg-cyan-950/60 border border-cyan-500/30 rounded-xl flex items-center justify-between text-xs animate-fade-in">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
              <span className="text-slate-300">
                <strong className="text-cyan-300">Failover Protection Active:</strong> Image successfully rendered via <span className="font-semibold text-white">{lastFallbackInfo.engine}</span>. {lastFallbackInfo.notice}
              </span>
            </div>
            <button
              onClick={() => setLastFallbackInfo(null)}
              className="text-slate-400 hover:text-white text-[11px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Live Diagnostics Card */}
        {diagnosticResult && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-800/80 animate-fade-in">
            <div className="p-3 bg-slate-950/80 border border-cyan-500/30 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400 font-bold text-xs">
                  P1
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>Perchance AI Generator</span>
                    <span className="text-[10px] text-cyan-400 font-mono">(Primary)</span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Status: <span className="text-emerald-400 font-semibold">{diagnosticResult.primary?.status}</span> • Latency: {diagnosticResult.primary?.latencyMs}ms
                  </div>
                </div>
              </div>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>

            <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300 font-bold text-xs">
                  P2
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>Pollinations Backup</span>
                    <span className="text-[10px] text-slate-400 font-mono">(Secondary)</span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Status: <span className="text-emerald-400 font-semibold">{diagnosticResult.secondary?.status}</span> • Latency: {diagnosticResult.secondary?.latencyMs}ms
                  </div>
                </div>
              </div>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
        )}
      </div>

      {/* Main Engine Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Prompting & Style Modifiers (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Prompt Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-white flex items-center gap-1.5">
                <Wand2 className="w-4 h-4 text-cyan-400" />
                <span>AI Image Prompt Studio</span>
              </label>

              <button
                onClick={handleEnhancePrompt}
                disabled={isEnhancing}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 text-cyan-300 rounded-lg text-xs font-semibold border border-cyan-500/30 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>{isEnhancing ? 'Enhancing with Gemini...' : 'Perchance Super-Prompt (Gemini)'}</span>
              </button>
            </div>

            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 resize-none leading-relaxed"
              placeholder="Enter atmospheric prompt (e.g. solitary thinker marble statue in misty nebula...)"
            />

            {/* Engine Selection & Aspect Ratio Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
                  Engine Pipeline
                </label>
                <div className="grid grid-cols-2 gap-1 bg-slate-950 p-1 border border-slate-800 rounded-xl">
                  <button
                    onClick={() => setSelectedEngine('perchance')}
                    className={`py-1.5 px-2 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center gap-1 ${
                      selectedEngine === 'perchance'
                        ? 'bg-cyan-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Cpu className="w-3 h-3" />
                    <span>Perchance</span>
                  </button>
                  <button
                    onClick={() => setSelectedEngine('pollinations')}
                    className={`py-1.5 px-2 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center gap-1 ${
                      selectedEngine === 'pollinations'
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <ShieldCheck className="w-3 h-3" />
                    <span>Pollinations</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
                  Perchance Art Style
                </label>
                <select
                  value={selectedPerchanceStyleId}
                  onChange={(e) => setSelectedPerchanceStyleId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-medium"
                >
                  {PERCHANCE_ART_STYLES.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
                  Shape (Ratio)
                </label>
                <div className="grid grid-cols-3 gap-1">
                  {(['1:1', '4:5', '9:16'] as AspectRatio[]).map((ratio) => (
                    <button
                      key={ratio}
                      onClick={() => setAspectRatio(ratio)}
                      className={`py-1.5 px-1.5 rounded-lg text-[11px] font-semibold border transition-all ${
                        aspectRatio === ratio
                          ? 'bg-cyan-600 text-white border-cyan-500 font-bold'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {ratio === '4:5' ? 'Portrait' : ratio === '1:1' ? 'Square' : 'Story'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
                  How Many?
                </label>
                <div className="grid grid-cols-3 gap-1">
                  {[1, 2, 3].map((num) => (
                    <button
                      key={num}
                      onClick={() => setBatchCount(num)}
                      className={`py-1.5 px-2 rounded-lg text-xs font-bold border transition-all ${
                        batchCount === num
                          ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white border-cyan-500 shadow-sm'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Generate Action Button */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="w-full py-3 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all transform active:scale-98"
            >
              <Sparkles className="w-4 h-4" />
              <span>
                {isGenerating
                  ? `Rendering ${batchCount} variation${batchCount > 1 ? 's' : ''} via Perchance Engine...`
                  : `Generate ${batchCount > 1 ? `${batchCount} Variations` : 'Image'} via Perchance AI`}
              </span>
            </button>
          </div>

          {/* Niche Style Presets */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h3 className="text-xs font-bold text-white flex items-center justify-between">
              <span>Aesthetic Niche Style Presets</span>
              <span className="text-[11px] text-slate-400">Click to apply prompt</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {AESTHETIC_STYLES.map((style) => (
                <button
                  key={style.id}
                  onClick={() => handleApplyStyle(style)}
                  className={`p-3 rounded-xl text-left border transition-all flex items-start gap-3 ${
                    selectedStyleId === style.id
                      ? 'bg-cyan-950/40 border-cyan-500 ring-1 ring-cyan-500/40 text-white'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <img
                    src={style.previewUrl}
                    alt={style.name}
                    className="w-14 h-14 object-cover rounded-lg shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold truncate text-white">{style.name}</div>
                    <div className="text-[10px] text-cyan-400 font-medium mb-1">{style.niche}</div>
                    <div className="flex flex-wrap gap-1">
                      {style.tags.slice(0, 2).map((t) => (
                        <span key={t} className="text-[9px] px-1.5 py-0.2 rounded bg-slate-900 text-slate-400">
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Live Generated Preview & Gallery (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="sticky top-20 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-cyan-400" />
                <span>Generated Output Preview</span>
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/30 text-cyan-300 font-mono truncate max-w-[170px]">
                {activePreviewEngine}
              </span>
            </div>

            {/* Image Preview Container */}
            <div className="relative w-full rounded-xl overflow-hidden bg-black border border-slate-800 aspect-square flex items-center justify-center group">
              <img
                src={activePreviewImage}
                alt="AI Generated"
                className="w-full h-full object-cover"
              />

              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button
                  onClick={() => onSelectImageForStudio(activePreviewImage, prompt)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg flex items-center gap-1.5"
                >
                  <Layers className="w-4 h-4" />
                  <span>Use in Quote Studio</span>
                </button>
              </div>
            </div>

            {/* Quick Action Button */}
            <button
              onClick={() => onSelectImageForStudio(activePreviewImage, prompt)}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all"
            >
              <span>Stamp Quotes on this Image in Studio</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Recent Creations Gallery */}
            <div className="pt-3 border-t border-slate-800">
              <label className="text-xs font-semibold text-slate-400 mb-2 block">
                Session Creations Gallery
              </label>
              <div className="grid grid-cols-3 gap-2">
                {generatedGallery.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setActivePreviewImage(item.url);
                      setActivePreviewEngine(item.engine);
                    }}
                    className={`relative rounded-xl overflow-hidden aspect-square border transition-all group ${
                      activePreviewImage === item.url
                        ? 'border-cyan-400 ring-2 ring-cyan-400/40'
                        : 'border-slate-800 hover:border-slate-700 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={item.url} alt="Gallery item" className="w-full h-full object-cover" />
                    <span className="absolute bottom-1 right-1 text-[8px] px-1 py-0.5 rounded bg-black/80 text-cyan-300 font-mono">
                      {item.source === 'perchance' ? 'Perchance' : 'Pollinations'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
