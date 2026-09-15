import React, { useState, useEffect, useRef } from 'react';
import { FacebookPage, QuoteTemplate, PageTemplateCustomization, AspectRatio } from '../types';
import {
  X,
  Check,
  RotateCcw,
  Sparkles,
  Lock,
  Type,
  MoveVertical,
  Layers,
  Palette,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Sun,
  Eye,
  Sliders,
  Save,
} from 'lucide-react';
import { DEFAULT_TEMPLATES, CURATED_BACKGROUNDS } from '../data/defaultData';
import { renderQuoteToCanvas } from '../utils/canvasRenderer';

interface PageTemplateCustomizerModalProps {
  page: FacebookPage;
  templates?: QuoteTemplate[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedPage: FacebookPage) => void;
}

const FONT_OPTIONS = [
  { name: 'Playfair Display', family: 'Playfair Display', type: 'Serif Classic' },
  { name: 'Cinzel', family: 'Cinzel', type: 'Roman Luxury' },
  { name: 'Montserrat', family: 'Montserrat', type: 'Modern Bold' },
  { name: 'Oswald', family: 'Oswald', type: 'Bold Condensed' },
  { name: 'Syne', family: 'Syne', type: 'Editorial Display' },
  { name: 'Courier Prime', family: 'Courier Prime', type: 'Vintage Typewriter' },
  { name: 'Special Elite', family: 'Special Elite', type: 'Distressed Stencil' },
  { name: 'Cormorant Garamond', family: 'Cormorant Garamond', type: 'Poetic Serif' },
  { name: 'Plus Jakarta Sans', family: 'Plus Jakarta Sans', type: 'Clean Geometric' },
  { name: 'Inter', family: 'Inter', type: 'Clean Neo-Grotesque' },
  { name: 'JetBrains Mono', family: 'JetBrains Mono', type: 'Cyberpunk Monospace' },
  { name: 'Georgia', family: 'Georgia', type: 'Editorial Serif' },
  { name: 'Impact', family: 'Impact', type: 'Heavy Poster' },
];

const SAMPLE_QUOTES = [
  {
    quote: 'We do not rise to the level of our expectations, we fall to the level of our training.',
    author: 'Archilochus',
    niche: 'military',
  },
  {
    quote: 'You have power over your mind - not outside events. Realize this, and you will find strength.',
    author: 'Marcus Aurelius',
    niche: 'stoicism',
  },
  {
    quote: 'In the depth of winter, I finally learned that within me there lay an invincible summer.',
    author: 'Albert Camus',
    niche: 'existentialism',
  },
  {
    quote: 'The cosmos is within us. We are made of star-stuff. We are a way for the cosmos to know itself.',
    author: 'Carl Sagan',
    niche: 'science',
  },
  {
    quote: 'Some things hurt only until you turn them into poetry.',
    author: 'Untold Feelings',
    niche: 'poetry',
  },
];

const PRESET_COLORS = [
  { name: 'Pure White', value: '#ffffff' },
  { name: 'Imperial Gold', value: '#fbbf24' },
  { name: 'Amber Glow', value: '#f59e0b' },
  { name: 'Sky Cyan', value: '#38bdf8' },
  { name: 'Soft Rose', value: '#fb7185' },
  { name: 'Emerald', value: '#34d399' },
  { name: 'Warm Cream', value: '#fef3c7' },
  { name: 'Charcoal Noir', value: '#18181b' },
];

export const PageTemplateCustomizerModal: React.FC<PageTemplateCustomizerModalProps> = ({
  page,
  templates = DEFAULT_TEMPLATES,
  isOpen,
  onClose,
  onSave,
}) => {
  const currentTemplate = templates.find((t) => t.id === page.defaultTemplateId) || templates[0];
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(page.defaultTemplateId || currentTemplate.id);
  
  // Active Tab: 'typography' | 'placing' | 'vignette' | 'colors'
  const [activeTab, setActiveTab] = useState<'typography' | 'placing' | 'vignette' | 'colors'>('typography');

  // Customization State (initialized from page.templateCustomization or template defaults)
  const existingCustom = page.templateCustomization || {};
  const activeTmpl = templates.find((t) => t.id === selectedTemplateId) || currentTemplate;

  const [fontFamily, setFontFamily] = useState<string>(existingCustom.fontFamily || activeTmpl.fontFamily || 'Playfair Display');
  const [fontSize, setFontSize] = useState<number>(existingCustom.fontSize || activeTmpl.fontSize || 34);
  const [fontWeight, setFontWeight] = useState<'300' | '400' | '600' | '700' | '900'>(
    existingCustom.fontWeight || (activeTmpl.fontWeight as any) || '700'
  );
  const [fontStyle, setFontStyle] = useState<'normal' | 'italic'>(
    existingCustom.fontStyle || activeTmpl.fontStyle || 'normal'
  );
  const [lineHeight, setLineHeight] = useState<number>(existingCustom.lineHeight || activeTmpl.lineHeight || 1.45);
  const [letterSpacing, setLetterSpacing] = useState<number>(existingCustom.letterSpacing ?? activeTmpl.letterSpacing ?? 0);

  // Placing & Alignment
  const [verticalPosition, setVerticalPosition] = useState<'top' | 'center' | 'bottom'>(
    existingCustom.verticalPosition || 'center'
  );
  const [verticalOffset, setVerticalOffset] = useState<number>(existingCustom.verticalOffset || 0);
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right'>(
    existingCustom.textAlign || activeTmpl.textAlign || 'center'
  );
  const [authorFontSize, setAuthorFontSize] = useState<number>(existingCustom.authorFontSize || 18);

  // Vignette & Atmosphere
  const [overlayType, setOverlayType] = useState<
    'gradient-bottom' | 'radial-vignette' | 'dark-blur' | 'tint-solid' | 'cinematic-cinemascope' | 'paper-texture'
  >(existingCustom.overlayType || activeTmpl.overlayType || 'radial-vignette');
  const [overlayOpacity, setOverlayOpacity] = useState<number>(
    existingCustom.overlayOpacity !== undefined ? existingCustom.overlayOpacity : activeTmpl.overlayOpacity ?? 0.65
  );
  const [vignetteStrength, setVignetteStrength] = useState<number>(
    existingCustom.vignetteStrength !== undefined ? existingCustom.vignetteStrength : activeTmpl.vignetteStrength ?? 0.75
  );
  const [dropShadow, setDropShadow] = useState<boolean>(
    existingCustom.dropShadow !== undefined ? existingCustom.dropShadow : activeTmpl.dropShadow ?? true
  );
  const [dropShadowBlur, setDropShadowBlur] = useState<number>(
    existingCustom.dropShadowBlur !== undefined ? existingCustom.dropShadowBlur : activeTmpl.dropShadowBlur ?? 8
  );

  // Colors
  const [textColor, setTextColor] = useState<string>(existingCustom.textColor || activeTmpl.textColor || '#ffffff');
  const [authorColor, setAuthorColor] = useState<string>(existingCustom.authorColor || activeTmpl.accentColor || '#fbbf24');
  const [accentColor, setAccentColor] = useState<string>(existingCustom.accentColor || activeTmpl.accentColor || '#eab308');

  // Preview Sample States
  const [sampleQuoteIndex, setSampleQuoteIndex] = useState<number>(() => {
    const matchIdx = SAMPLE_QUOTES.findIndex((q) => q.niche === page.nicheCategory);
    return matchIdx !== -1 ? matchIdx : 0;
  });
  const [bgImageIndex, setBgImageIndex] = useState<number>(0);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Background Options for Preview
  const sampleBackgrounds = [
    CURATED_BACKGROUNDS[page.nicheCategory]?.[0]?.url ||
      'https://images.pexels.com/photos/17266185/pexels-photo-17266185.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1080&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1080&auto=format&fit=crop&q=80',
  ];

  // Render live canvas preview
  useEffect(() => {
    if (!isOpen || !canvasRef.current) return;

    const currentQuote = SAMPLE_QUOTES[sampleQuoteIndex];
    const targetTmpl = templates.find((t) => t.id === selectedTemplateId) || currentTemplate;

    const customTypography: PageTemplateCustomization = {
      templateId: selectedTemplateId,
      fontFamily,
      fontSize,
      fontWeight,
      fontStyle,
      textAlign,
      textColor,
      lineHeight,
      letterSpacing,
      verticalPosition,
      verticalOffset,
      authorColor,
      authorFontSize,
      overlayOpacity,
      vignetteStrength,
      overlayType,
      dropShadow,
      dropShadowBlur,
      accentColor,
    };

    renderQuoteToCanvas({
      canvas: canvasRef.current,
      quoteText: currentQuote.quote,
      authorText: currentQuote.author,
      template: targetTmpl,
      aspectRatio,
      backgroundImageUrl: sampleBackgrounds[bgImageIndex % sampleBackgrounds.length],
      watermarkText: page.brandName || page.name,
      watermarkPosition: 'bottom-center',
      watermarkOpacity: 0.85,
      typography: customTypography,
    });
  }, [
    isOpen,
    selectedTemplateId,
    fontFamily,
    fontSize,
    fontWeight,
    fontStyle,
    textAlign,
    textColor,
    lineHeight,
    letterSpacing,
    verticalPosition,
    verticalOffset,
    authorColor,
    authorFontSize,
    overlayOpacity,
    vignetteStrength,
    overlayType,
    dropShadow,
    dropShadowBlur,
    accentColor,
    sampleQuoteIndex,
    bgImageIndex,
    aspectRatio,
    templates,
  ]);

  // Handle template selection change -> load base defaults
  const handleSelectTemplate = (tmplId: string) => {
    setSelectedTemplateId(tmplId);
    const tmpl = templates.find((t) => t.id === tmplId);
    if (tmpl) {
      setFontFamily(tmpl.fontFamily);
      setFontSize(tmpl.fontSize || 34);
      setFontWeight((tmpl.fontWeight as any) || '700');
      setFontStyle(tmpl.fontStyle || 'normal');
      setLineHeight(tmpl.lineHeight || 1.45);
      setLetterSpacing(tmpl.letterSpacing || 0);
      setTextAlign(tmpl.textAlign || 'center');
      setOverlayType(tmpl.overlayType || 'radial-vignette');
      setOverlayOpacity(tmpl.overlayOpacity ?? 0.65);
      setVignetteStrength(tmpl.vignetteStrength ?? 0.75);
      setDropShadow(tmpl.dropShadow ?? true);
      setTextColor(tmpl.textColor || '#ffffff');
      setAuthorColor(tmpl.accentColor || '#fbbf24');
      setAccentColor(tmpl.accentColor || '#eab308');
    }
  };

  // Reset to current template base defaults
  const handleResetToDefaults = () => {
    const tmpl = templates.find((t) => t.id === selectedTemplateId) || currentTemplate;
    setFontFamily(tmpl.fontFamily);
    setFontSize(tmpl.fontSize || 34);
    setFontWeight((tmpl.fontWeight as any) || '700');
    setFontStyle(tmpl.fontStyle || 'normal');
    setLineHeight(tmpl.lineHeight || 1.45);
    setLetterSpacing(tmpl.letterSpacing || 0);
    setVerticalPosition('center');
    setVerticalOffset(0);
    setTextAlign(tmpl.textAlign || 'center');
    setAuthorFontSize(18);
    setOverlayType(tmpl.overlayType || 'radial-vignette');
    setOverlayOpacity(tmpl.overlayOpacity ?? 0.65);
    setVignetteStrength(tmpl.vignetteStrength ?? 0.75);
    setDropShadow(tmpl.dropShadow ?? true);
    setDropShadowBlur(tmpl.dropShadowBlur ?? 8);
    setTextColor(tmpl.textColor || '#ffffff');
    setAuthorColor(tmpl.accentColor || '#fbbf24');
    setAccentColor(tmpl.accentColor || '#eab308');
  };

  // Save changes to Page
  const handleSaveCustomization = async () => {
    const customConfig: PageTemplateCustomization = {
      templateId: selectedTemplateId,
      fontFamily,
      fontSize,
      fontWeight,
      fontStyle,
      textAlign,
      textColor,
      lineHeight,
      letterSpacing,
      verticalPosition,
      verticalOffset,
      authorColor,
      authorFontSize,
      overlayOpacity,
      vignetteStrength,
      overlayType,
      dropShadow,
      dropShadowBlur,
      accentColor,
    };

    const updatedPage: FacebookPage = {
      ...page,
      defaultTemplateId: selectedTemplateId,
      templateCustomization: customConfig,
    };

    try {
      await fetch('/api/pages/save-template-customization', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pageId: page.id,
          defaultTemplateId: selectedTemplateId,
          templateCustomization: customConfig,
        }),
      });
    } catch (err) {
      console.warn('Server save warning:', err);
    }

    onSave(updatedPage);
    setSaveStatus('✅ Template styling saved successfully!');
    setTimeout(() => {
      setSaveStatus(null);
      onClose();
    }, 900);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-5xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-amber-500/20 to-indigo-500/20 text-amber-400 rounded-2xl border border-amber-500/30 shadow-inner">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-1.5">
                  <span>Template Styling & Placing Studio</span>
                </h2>
                <span className="text-[11px] font-bold text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-500/30">
                  {page.name}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Adjust and lock text size, font, placement offset, alignment, vignette darkness, and styling for all batch posts.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetToDefaults}
              className="p-2 text-slate-400 hover:text-amber-300 hover:bg-slate-800 rounded-xl text-xs flex items-center gap-1 transition-colors"
              title="Reset all adjustments to base template defaults"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">Reset Defaults</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Split 2-Column (Left: Live Canvas Preview, Right: Tuning Controls) */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-y-auto min-h-0">
          {/* Left Column: Live Canvas Preview & Test Switchers (5 cols) */}
          <div className="lg:col-span-5 p-4 sm:p-5 bg-slate-950/60 border-b lg:border-b-0 lg:border-r border-slate-800 flex flex-col items-center justify-between">
            <div className="w-full max-w-[380px] flex flex-col items-center">
              <div className="w-full flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Live Render Preview</span>
                </span>
                <span className="text-[10.5px] font-mono text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
                  {fontSize}px • {fontFamily}
                </span>
              </div>

              {/* Live Canvas Element */}
              <div className="relative w-full aspect-square bg-slate-950 rounded-2xl overflow-hidden shadow-2xl border border-slate-800 ring-1 ring-slate-700/50 flex items-center justify-center">
                <canvas
                  ref={canvasRef}
                  className="w-full h-full object-contain"
                  style={{ imageRendering: 'high-quality' }}
                />
              </div>

              {/* Sample Switchers Under Canvas */}
              <div className="w-full mt-3 space-y-2 bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Sample Quote:</span>
                  <button
                    onClick={() => setSampleQuoteIndex((prev) => (prev + 1) % SAMPLE_QUOTES.length)}
                    className="text-amber-300 hover:text-amber-200 font-semibold flex items-center gap-1 bg-slate-800 px-2 py-0.5 rounded transition-colors"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Cycle Quote #{sampleQuoteIndex + 1}</span>
                  </button>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Sample Background:</span>
                  <button
                    onClick={() => setBgImageIndex((prev) => (prev + 1) % sampleBackgrounds.length)}
                    className="text-cyan-300 hover:text-cyan-200 font-semibold flex items-center gap-1 bg-slate-800 px-2 py-0.5 rounded transition-colors"
                  >
                    <Layers className="w-3 h-3" />
                    <span>Cycle Background #{bgImageIndex + 1}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Template Selector Bar Under Preview */}
            <div className="w-full max-w-[380px] mt-4 pt-3 border-t border-slate-800/80">
              <label className="text-[11px] font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Lock className="w-3 h-3 text-amber-400" />
                <span>Base Locked Template:</span>
              </label>
              <select
                value={selectedTemplateId}
                onChange={(e) => handleSelectTemplate(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white focus:ring-1 focus:ring-amber-400 transition-all cursor-pointer"
              >
                {templates.map((tmpl) => (
                  <option key={tmpl.id} value={tmpl.id} className="bg-slate-900 text-white font-medium">
                    🎨 {tmpl.name} ({tmpl.fontFamily})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Right Column: Customization Controls (7 cols) */}
          <div className="lg:col-span-7 p-4 sm:p-6 flex flex-col justify-between overflow-y-auto">
            <div>
              {/* Category Tabs */}
              <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-2xl border border-slate-800 mb-5">
                <button
                  onClick={() => setActiveTab('typography')}
                  className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    activeTab === 'typography'
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md shadow-amber-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <Type className="w-3.5 h-3.5" />
                  <span>Typography</span>
                </button>

                <button
                  onClick={() => setActiveTab('placing')}
                  className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    activeTab === 'placing'
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <MoveVertical className="w-3.5 h-3.5" />
                  <span>Placing</span>
                </button>

                <button
                  onClick={() => setActiveTab('vignette')}
                  className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    activeTab === 'vignette'
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <Sun className="w-3.5 h-3.5" />
                  <span>Vignette</span>
                </button>

                <button
                  onClick={() => setActiveTab('colors')}
                  className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    activeTab === 'colors'
                      ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-md shadow-rose-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <Palette className="w-3.5 h-3.5" />
                  <span>Colors</span>
                </button>
              </div>

              {/* TAB 1: TYPOGRAPHY & FONT */}
              {activeTab === 'typography' && (
                <div className="space-y-4 animate-fade-in">
                  {/* Font Family Selector */}
                  <div>
                    <label className="text-xs font-bold text-slate-200 mb-2 block">
                      Font Family Style
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-44 overflow-y-auto pr-1">
                      {FONT_OPTIONS.map((f) => {
                        const isSelected = fontFamily === f.family;
                        return (
                          <button
                            key={f.family}
                            type="button"
                            onClick={() => setFontFamily(f.family)}
                            className={`p-2.5 rounded-xl border text-left transition-all ${
                              isSelected
                                ? 'bg-amber-500/15 border-amber-400 text-amber-200 ring-1 ring-amber-400/40'
                                : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-850'
                            }`}
                          >
                            <div className="text-xs font-bold truncate">{f.name}</div>
                            <div className="text-[10px] text-slate-400 truncate">{f.type}</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Text Size Slider */}
                  <div className="bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800/80 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-300">Quote Text Size:</span>
                      <span className="font-mono text-amber-400 font-bold bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                        {fontSize} px
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="22"
                        max="68"
                        step="1"
                        value={fontSize}
                        onChange={(e) => setFontSize(Number(e.target.value))}
                        className="flex-1 accent-amber-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                      />
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setFontSize((s) => Math.max(22, s - 2))}
                          className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 rounded-lg"
                        >
                          -
                        </button>
                        <button
                          type="button"
                          onClick={() => setFontSize((s) => Math.min(68, s + 2))}
                          className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 rounded-lg"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Font Weight & Italic Switch */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-300 mb-1.5 block">Font Weight</label>
                      <select
                        value={fontWeight}
                        onChange={(e) => setFontWeight(e.target.value as any)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-white"
                      >
                        <option value="300">300 (Light)</option>
                        <option value="400">400 (Regular)</option>
                        <option value="600">600 (SemiBold)</option>
                        <option value="700">700 (Bold)</option>
                        <option value="900">900 (Black)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-300 mb-1.5 block">Font Posture</label>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setFontStyle('normal')}
                          className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all ${
                            fontStyle === 'normal'
                              ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                              : 'bg-slate-950 border-slate-800 text-slate-400'
                          }`}
                        >
                          Normal
                        </button>
                        <button
                          type="button"
                          onClick={() => setFontStyle('italic')}
                          className={`flex-1 py-2 text-xs font-bold italic rounded-xl border transition-all ${
                            fontStyle === 'italic'
                              ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                              : 'bg-slate-950 border-slate-800 text-slate-400'
                          }`}
                        >
                          Italic
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Line Height & Letter Spacing */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-950/70 p-3 rounded-2xl border border-slate-800/80">
                      <div className="flex items-center justify-between text-[11px] mb-1.5">
                        <span className="font-bold text-slate-400">Line Spacing:</span>
                        <span className="font-mono text-cyan-300 font-bold">{lineHeight.toFixed(2)}x</span>
                      </div>
                      <input
                        type="range"
                        min="1.15"
                        max="2.1"
                        step="0.05"
                        value={lineHeight}
                        onChange={(e) => setLineHeight(Number(e.target.value))}
                        className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                      />
                    </div>

                    <div className="bg-slate-950/70 p-3 rounded-2xl border border-slate-800/80">
                      <div className="flex items-center justify-between text-[11px] mb-1.5">
                        <span className="font-bold text-slate-400">Letter Spacing:</span>
                        <span className="font-mono text-cyan-300 font-bold">{letterSpacing}px</span>
                      </div>
                      <input
                        type="range"
                        min="-1"
                        max="6"
                        step="0.5"
                        value={letterSpacing}
                        onChange={(e) => setLetterSpacing(Number(e.target.value))}
                        className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: PLACING & LAYOUT */}
              {activeTab === 'placing' && (
                <div className="space-y-4 animate-fade-in">
                  {/* Vertical Position Segment */}
                  <div>
                    <label className="text-xs font-bold text-slate-200 mb-2 block">
                      Vertical Placement Alignment
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'top', label: 'Top Weighted', desc: 'Focus high' },
                        { id: 'center', label: 'Center Balanced', desc: 'Standard middle' },
                        { id: 'bottom', label: 'Bottom Weighted', desc: 'Lower half' },
                      ].map((pos) => (
                        <button
                          key={pos.id}
                          type="button"
                          onClick={() => setVerticalPosition(pos.id as any)}
                          className={`p-3 rounded-2xl border text-center transition-all ${
                            verticalPosition === pos.id
                              ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-md ring-1 ring-cyan-400/40'
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                          }`}
                        >
                          <div className="text-xs font-black">{pos.label}</div>
                          <div className="text-[10px] opacity-75">{pos.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Vertical Y-Offset Slider */}
                  <div className="bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800/80 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-300 flex items-center gap-1.5">
                        <MoveVertical className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Vertical Y-Offset Nudge:</span>
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-cyan-300 font-bold bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                          {verticalOffset > 0 ? `+${verticalOffset}` : verticalOffset} px
                        </span>
                        {verticalOffset !== 0 && (
                          <button
                            type="button"
                            onClick={() => setVerticalOffset(0)}
                            className="text-[10px] text-slate-400 hover:text-white bg-slate-800 px-1.5 py-0.5 rounded"
                          >
                            Reset 0
                          </button>
                        )}
                      </div>
                    </div>
                    <input
                      type="range"
                      min="-160"
                      max="160"
                      step="5"
                      value={verticalOffset}
                      onChange={(e) => setVerticalOffset(Number(e.target.value))}
                      className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500">
                      <span>Shift Up (-160px)</span>
                      <span>Center (0px)</span>
                      <span>Shift Down (+160px)</span>
                    </div>
                  </div>

                  {/* Text Alignment */}
                  <div>
                    <label className="text-xs font-bold text-slate-200 mb-2 block">
                      Horizontal Text Alignment
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'left', label: 'Left Aligned', icon: AlignLeft },
                        { id: 'center', label: 'Centered', icon: AlignCenter },
                        { id: 'right', label: 'Right Aligned', icon: AlignRight },
                      ].map((align) => {
                        const Icon = align.icon;
                        const isSelected = textAlign === align.id;
                        return (
                          <button
                            key={align.id}
                            type="button"
                            onClick={() => setTextAlign(align.id as any)}
                            className={`py-2.5 px-3 rounded-2xl border flex items-center justify-center gap-2 transition-all ${
                              isSelected
                                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold ring-1 ring-cyan-400/40'
                                : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                            <span className="text-xs">{align.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Author Font Size */}
                  <div className="bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800/80 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-300">Author Attribution Size:</span>
                      <span className="font-mono text-cyan-300 font-bold">{authorFontSize} px</span>
                    </div>
                    <input
                      type="range"
                      min="13"
                      max="34"
                      step="1"
                      value={authorFontSize}
                      onChange={(e) => setAuthorFontSize(Number(e.target.value))}
                      className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                    />
                  </div>
                </div>
              )}

              {/* TAB 3: VIGNETTE & ATMOSPHERE */}
              {activeTab === 'vignette' && (
                <div className="space-y-4 animate-fade-in">
                  {/* Overlay / Vignette Style */}
                  <div>
                    <label className="text-xs font-bold text-slate-200 mb-2 block">
                      Atmosphere & Vignette Profile
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {[
                        { id: 'radial-vignette', label: 'Radial Vignette', desc: 'Focus spot with dark edges' },
                        { id: 'gradient-bottom', label: 'Bottom Gradient', desc: 'Dark bottom fade' },
                        { id: 'cinematic-cinemascope', label: 'Cinemascope', desc: 'Letterbox cinema bars' },
                        { id: 'paper-texture', label: 'Paper & Watercolor', desc: 'Soft organic tactile' },
                        { id: 'dark-blur', label: 'Deep Tint', desc: 'Uniform dark atmosphere' },
                      ].map((style) => {
                        const isSelected = overlayType === style.id;
                        return (
                          <button
                            key={style.id}
                            type="button"
                            onClick={() => setOverlayType(style.id as any)}
                            className={`p-2.5 rounded-2xl border text-left transition-all ${
                              isSelected
                                ? 'bg-indigo-500/20 border-indigo-400 text-indigo-200 ring-1 ring-indigo-400/40'
                                : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                            }`}
                          >
                            <div className="text-xs font-bold truncate">{style.label}</div>
                            <div className="text-[10px] text-slate-500 line-clamp-1">{style.desc}</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Vignette Strength Slider */}
                  <div className="bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800/80 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-300 flex items-center gap-1.5">
                        <Sun className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Edge Vignette Darkness Intensity:</span>
                      </span>
                      <span className="font-mono text-indigo-300 font-bold">
                        {Math.round(vignetteStrength * 100)}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={vignetteStrength}
                      onChange={(e) => setVignetteStrength(Number(e.target.value))}
                      className="w-full accent-indigo-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500">
                      <span>Soft / Open (0%)</span>
                      <span>Balanced (70%)</span>
                      <span>Deep Chiaroscuro (100%)</span>
                    </div>
                  </div>

                  {/* Background Overlay Opacity Slider */}
                  <div className="bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800/80 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-300">Overall Overlay Darkness:</span>
                      <span className="font-mono text-indigo-300 font-bold">
                        {Math.round(overlayOpacity * 100)}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="0.95"
                      step="0.05"
                      value={overlayOpacity}
                      onChange={(e) => setOverlayOpacity(Number(e.target.value))}
                      className="w-full accent-indigo-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                    />
                  </div>

                  {/* Drop Shadow Toggle & Blur */}
                  <div className="bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800/80 space-y-3">
                    <label className="flex items-center justify-between cursor-pointer">
                      <span className="text-xs font-bold text-slate-300">Typography Drop Shadow</span>
                      <input
                        type="checkbox"
                        checked={dropShadow}
                        onChange={(e) => setDropShadow(e.target.checked)}
                        className="w-4 h-4 rounded text-indigo-500 focus:ring-indigo-400 bg-slate-900 border-slate-700"
                      />
                    </label>

                    {dropShadow && (
                      <div className="space-y-1.5 pt-1 border-t border-slate-800/60">
                        <div className="flex items-center justify-between text-[11px] text-slate-400">
                          <span>Shadow Blur Radius:</span>
                          <span className="font-mono text-indigo-300">{dropShadowBlur} px</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="24"
                          step="1"
                          value={dropShadowBlur}
                          onChange={(e) => setDropShadowBlur(Number(e.target.value))}
                          className="w-full accent-indigo-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 4: COLORS & ACCENTS */}
              {activeTab === 'colors' && (
                <div className="space-y-4 animate-fade-in">
                  {/* Quote Text Color */}
                  <div className="bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800/80 space-y-2">
                    <label className="text-xs font-bold text-slate-200 flex items-center justify-between">
                      <span>Quote Text Color</span>
                      <span className="font-mono text-slate-400 text-[11px]">{textColor}</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={textColor}
                        onChange={(e) => setTextColor(e.target.value)}
                        className="w-9 h-9 rounded-xl bg-transparent border border-slate-700 cursor-pointer p-0.5"
                      />
                      <div className="flex-1 flex flex-wrap gap-1.5">
                        {PRESET_COLORS.map((c) => (
                          <button
                            key={c.value}
                            type="button"
                            onClick={() => setTextColor(c.value)}
                            className={`w-6 h-6 rounded-full border transition-all ${
                              textColor.toLowerCase() === c.value.toLowerCase()
                                ? 'border-amber-400 scale-110 shadow-sm'
                                : 'border-slate-700 hover:scale-105'
                            }`}
                            style={{ backgroundColor: c.value }}
                            title={c.name}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Author Attribution Color */}
                  <div className="bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800/80 space-y-2">
                    <label className="text-xs font-bold text-slate-200 flex items-center justify-between">
                      <span>Author Attribution Color</span>
                      <span className="font-mono text-slate-400 text-[11px]">{authorColor}</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={authorColor}
                        onChange={(e) => setAuthorColor(e.target.value)}
                        className="w-9 h-9 rounded-xl bg-transparent border border-slate-700 cursor-pointer p-0.5"
                      />
                      <div className="flex-1 flex flex-wrap gap-1.5">
                        {PRESET_COLORS.map((c) => (
                          <button
                            key={c.value}
                            type="button"
                            onClick={() => setAuthorColor(c.value)}
                            className={`w-6 h-6 rounded-full border transition-all ${
                              authorColor.toLowerCase() === c.value.toLowerCase()
                                ? 'border-amber-400 scale-110 shadow-sm'
                                : 'border-slate-700 hover:scale-105'
                            }`}
                            style={{ backgroundColor: c.value }}
                            title={c.name}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Tag & Border Accent Color */}
                  <div className="bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800/80 space-y-2">
                    <label className="text-xs font-bold text-slate-200 flex items-center justify-between">
                      <span>Border & Tag Accent Color</span>
                      <span className="font-mono text-slate-400 text-[11px]">{accentColor}</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={accentColor}
                        onChange={(e) => setAccentColor(e.target.value)}
                        className="w-9 h-9 rounded-xl bg-transparent border border-slate-700 cursor-pointer p-0.5"
                      />
                      <div className="flex-1 flex flex-wrap gap-1.5">
                        {PRESET_COLORS.map((c) => (
                          <button
                            key={c.value}
                            type="button"
                            onClick={() => setAccentColor(c.value)}
                            className={`w-6 h-6 rounded-full border transition-all ${
                              accentColor.toLowerCase() === c.value.toLowerCase()
                                ? 'border-amber-400 scale-110 shadow-sm'
                                : 'border-slate-700 hover:scale-105'
                            }`}
                            style={{ backgroundColor: c.value }}
                            title={c.name}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Action Footer */}
            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
              <div>
                {saveStatus ? (
                  <span className="text-xs font-bold text-emerald-400 animate-pulse flex items-center gap-1">
                    <Check className="w-4 h-4" />
                    <span>{saveStatus}</span>
                  </span>
                ) : (
                  <span className="text-[11px] text-slate-500">
                    All 1-Click batch schedules for <strong className="text-slate-300">{page.name}</strong> will strictly use these settings.
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveCustomization}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-amber-500/25 transition-all active:scale-95 cursor-pointer"
                >
                  <Save className="w-4 h-4 stroke-[2.5]" />
                  <span>Save Template for {page.name}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
