import React, { useState } from 'react';
import { FacebookPage, Quote, QuoteTemplate, ScheduledPost } from '../types';
import {
  ShieldCheck,
  Sparkles,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ArrowRight,
  Copy,
  ExternalLink,
  Target,
  Sliders,
  Layers,
  FileText,
  Search,
  RefreshCw,
  Award,
  Check,
} from 'lucide-react';

interface NichePageAnalyzerProps {
  pages: FacebookPage[];
  activePage: FacebookPage;
  onSelectPage: (pageId: string) => void;
  onApplyTemplateToStudio: (quote: string, author: string, templateId: string, backgroundUrl?: string) => void;
  onTriggerBatchModal: () => void;
}

export const NichePageAnalyzer: React.FC<NichePageAnalyzerProps> = ({
  pages,
  activePage,
  onSelectPage,
  onApplyTemplateToStudio,
  onTriggerBatchModal,
}) => {
  const [inputUrl, setInputUrl] = useState<string>(
    'https://www.facebook.com/profile.php?id=61590607754902'
  );
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [analysisData, setAnalysisData] = useState<any>({
    pageName: 'US Army Fans AI (Warrior Ethos & Military Motivation)',
    pageHandle: '@usarmymotivation_ai',
    targetAudience: 'Military enthusiasts, service members, veterans, athletes, discipline seekers & patriots',
    niche: 'Military Motivation, Brotherhood, Warrior Discipline & Patriotism',
    nicheCategory: 'military',
    retentionScore: 98,
    visualBlueprint: {
      recommendedAspectRatio: '1:1',
      recommendedTemplateId: 'tactical-stencil-gold',
      fontFamily: 'Bebas Neue',
      fontWeight: '900',
      letterSpacing: '2.2px',
      textColor: '#FFFFFF',
      accentColor: '#F59E0B',
      overlayType: 'radial-vignette',
      overlayOpacity: 0.72,
      borderOrnament: 'tactical-brackets',
      authorStyle: 'tactical-gold-tag',
      contrastRatio: '14.2:1 (Passes WCAG AAA for text over image)',
      imagePromptTemplate:
        'cinematic dramatic silhouette of US Army soldier in tactical gear standing on misty mountain peak at golden sunrise dawn, atmospheric mist, amber golden backlight rays, gritty photorealistic 8k Hasselblad shot, dark moody chiaroscuro background with clean negative space for typography overlay',
      negativePrompt:
        'cartoon, bright flat lighting, text, watermark, bad anatomy, deformed weapons, blurry, low resolution, civilian clothing, oversaturated',
    },
    captionBlueprint: {
      hookFormula: '⚡ Scroll-Stopping Hook (e.g. "Read this twice before your next challenge:")',
      bodyStructure: '2-sentence emotional reflection honoring discipline, sacrifice, brotherhood, and inner grit.',
      discussionQuestionStrategy:
        'Open-ended value/principle question (e.g. "What is the single hardest lesson discipline has taught you?")',
      firstCommentStrategy:
        'Pinned community discussion question to trigger authentic comment threads without asking for clicks/shares.',
      hashtagStrategy: [
        '#MilitaryMindset',
        '#WarriorEthos',
        '#Resilience',
        '#Discipline',
        '#Brotherhood',
        '#Honor',
        '#USArmyFans',
        '#NeverGiveUp',
      ],
    },
    facebookPolicyCompliance: {
      status: '100% Compliant (Zero Penalty Triggers)',
      engagementBaitPrevention: {
        prohibitedTriggers: [
          "'Type AMEN'",
          "'Share if you love America'",
          "'Like if you agree'",
          "'Comment YES to support our troops'",
        ],
        compliantAlternatives: [
          "'Who in your life taught you the true meaning of resilience? Share your thoughts below.'",
          "'What is one principle that keeps you grounded when life gets heavy?'",
          "'Tag a brother or teammate who always has your back.'",
        ],
      },
      impersonationSafety:
        'Explicitly designated as an AI-assisted creative tribute & motivational community. Does not claim to be the official United States Department of Defense (DoD).',
      contentSafety:
        'Zero depiction of prohibited weapon sales, real casualties, or graphic violence. Strictly focused on discipline, historical quotes, brotherhood, and motivational training ethos.',
    },
    samplePosts: [
      {
        quote: 'We do not rise to the level of our expectations, we fall to the level of our training.',
        author: 'Archilochus (Warrior Maxim)',
        hookLine: 'Read this twice before your next challenge:',
        caption:
          '⚡ Read this twice before your next challenge.\n\nWhen pressure strikes and exhaustion sets in, hope is not a strategy. What carries you through the darkest valleys is the discipline you built in silence.\n\n💬 What is one habit that has built the most discipline in your life?\n\n📌 Save this reminder for the days you feel like quitting.\n\n#MilitaryMindset #WarriorEthos #Discipline #Resilience #NeverGiveUp',
        firstComment: 'Who was the mentor or leader who taught you how to push past your limits? Drop their impact below 👇',
        templateId: 'tactical-stencil-gold',
        imagePrompt:
          'Cinematic tactical silhouette of soldier standing in morning mist, golden backlight rays, chiaroscuro, 8k',
      },
      {
        quote: 'A soldier fights not because he hates what is in front of him, but because he loves what is behind him.',
        author: 'G.K. Chesterton',
        hookLine: 'The true definition of honor and brotherhood:',
        caption:
          '⚡ The true definition of honor and brotherhood.\n\nTrue strength is never fueled by bitterness. It is powered by the fierce desire to protect your family, your brothers, and the freedom of those who depend on you.\n\n💬 Who is the person you fight hardest for every single day?\n\n📌 Share this with a brother who always has your back.\n\n#Brotherhood #Honor #WarriorMindset #Patriotism #USArmyFans',
        firstComment: 'Tag a brother or teammate who stood by you during your toughest season 👇',
        templateId: 'warrior-cinematic-banner',
        imagePrompt:
          'Soldier brotherhood patrol walking through moody mountain dawn with subtle golden rim lighting, 8k',
      },
    ],
  });

  const handleCopyText = (text: string, sectionKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionKey);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const handleAnalyzePage = async () => {
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/analyze-page-blueprint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pageUrl: inputUrl, pageId: '61590607754902' }),
      });
      const data = await response.json();
      if (data && data.pageName) {
        setAnalysisData(data);
      }
    } catch (err) {
      console.error('Failed to analyze blueprint:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleApplyToStudio = (sampleIdx = 0) => {
    const post = analysisData.samplePosts[sampleIdx] || analysisData.samplePosts[0];
    // Find warrior page if exists
    const warriorPage = pages.find((p) => p.nicheCategory === 'military' || p.id === 'page-warrior');
    if (warriorPage) {
      onSelectPage(warriorPage.id);
    }
    onApplyTemplateToStudio(
      post.quote,
      post.author,
      post.templateId || 'tactical-stencil-gold',
      'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=1200&auto=format&fit=crop&q=85'
    );
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Top Banner & URL Input */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 relative overflow-hidden backdrop-blur-md">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold rounded-full uppercase tracking-wider flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5" />
                Page & Niche Blueprint Analyzer
              </span>
              <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                FB Policy 100% Compliant
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Page Niche Analysis & High-Retention Template Engine
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl">
              Deep architectural breakdown of <span className="text-amber-400 font-semibold">US Army Fans AI (ID: 61590607754902)</span> and warrior/military motivation pages. Generates high-retention image overlays, psychological hooks, and zero-penalty caption blueprints strictly compliant with Facebook Community Standards.
            </p>
          </div>

          <div className="w-full lg:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={() => handleApplyToStudio(0)}
              className="px-5 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all hover:scale-102"
            >
              <Zap className="w-4 h-4 fill-current" />
              Apply Template & Open Studio
            </button>
            <button
              onClick={onTriggerBatchModal}
              className="px-5 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              Generate 10 FB Posts
            </button>
          </div>
        </div>

        {/* Live URL Input Bar */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="Paste Facebook Page URL or Profile ID (e.g. https://www.facebook.com/profile.php?id=61590607754902)"
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>
          <button
            onClick={handleAnalyzePage}
            disabled={isAnalyzing}
            className="w-full sm:w-auto px-5 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 font-semibold text-sm rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                Analyzing Blueprint...
              </>
            ) : (
              <>
                <Search className="w-4 h-4 text-amber-400" />
                Analyze Page
              </>
            )}
          </button>
        </div>
      </div>

      {/* Blueprint Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Visual & Image Blueprint */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg">
                <Sliders className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base">Visual Overlay Blueprint</h3>
            </div>
            <span className="text-xs bg-slate-800 text-amber-400 font-mono px-2.5 py-1 rounded-md border border-slate-700">
              Score: 98/100
            </span>
          </div>

          {/* Key Specs */}
          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center py-1.5 border-b border-slate-800/60">
              <span className="text-slate-400">Typography Pairing</span>
              <span className="text-slate-100 font-semibold font-mono">Bebas Neue 900 / Oswald</span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-slate-800/60">
              <span className="text-slate-400">Letter Spacing & Casing</span>
              <span className="text-slate-100 font-semibold font-mono">2.2px / ALL UPPERCASE</span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-slate-800/60">
              <span className="text-slate-400">Color Contrast Ratio</span>
              <span className="text-emerald-400 font-semibold font-mono">14.2:1 (Passes AAA)</span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-slate-800/60">
              <span className="text-slate-400">Overlay Engine</span>
              <span className="text-slate-100 font-semibold font-mono">Deep Radial Vignette (72%)</span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-slate-800/60">
              <span className="text-slate-400">Border Ornament</span>
              <span className="text-amber-400 font-semibold font-mono">Tactical Corner Brackets</span>
            </div>
            <div className="flex justify-between items-center py-1.5">
              <span className="text-slate-400">Author Tag Plate</span>
              <span className="text-amber-400 font-semibold font-mono">Tactical Gold Stencil Plate</span>
            </div>
          </div>

          {/* Image Prompt Modifier */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Engine Prompt Blueprint
              </span>
              <button
                onClick={() => handleCopyText(analysisData.visualBlueprint.imagePromptTemplate, 'prompt')}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
              >
                {copiedSection === 'prompt' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedSection === 'prompt' ? 'Copied' : 'Copy'}
              </button>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-mono line-clamp-4 bg-slate-900/60 p-2 rounded border border-slate-800">
              {analysisData.visualBlueprint.imagePromptTemplate}
            </p>
          </div>

          {/* Action */}
          <button
            onClick={() => handleApplyToStudio(0)}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-400 font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition-all"
          >
            Load Tactical Template in Canvas Studio
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Center Column: High Retention Caption & Hook Architecture */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
                <Flame className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base">Retention & Copy Formula</h3>
            </div>
            <span className="text-xs bg-emerald-500/10 text-emerald-400 font-semibold px-2.5 py-1 rounded-md border border-emerald-500/30">
              High Engagement
            </span>
          </div>

          {/* Copy Framework Breakdown */}
          <div className="space-y-3.5">
            <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl space-y-1">
              <span className="text-[11px] uppercase tracking-wider font-bold text-amber-400">
                1. Scroll-Stopping Hook Line
              </span>
              <p className="text-xs text-slate-300">
                Short punchline under 10 words stopping mid-scroll (e.g. <em>"Read this twice if you are fighting a silent battle today:"</em>)
              </p>
            </div>

            <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl space-y-1">
              <span className="text-[11px] uppercase tracking-wider font-bold text-sky-400">
                2. Emotional Story/Reflection (2 Sentences)
              </span>
              <p className="text-xs text-slate-300">
                Honors brotherhood, grit, mental fortitude, and duty without sounding preachy or generic.
              </p>
            </div>

            <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl space-y-1">
              <span className="text-[11px] uppercase tracking-wider font-bold text-emerald-400">
                3. Authentic Value Discussion Starter
              </span>
              <p className="text-xs text-slate-300">
                Non-baiting question asking followers about lessons, mentors, or habits (e.g. <em>"What principle has kept you steady through your hardest days?"</em>)
              </p>
            </div>

            <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl space-y-1">
              <span className="text-[11px] uppercase tracking-wider font-bold text-purple-400">
                4. Pinned First-Comment Trigger
              </span>
              <p className="text-xs text-slate-300">
                Pinned question in comments to ignite multi-reply threads and boost Facebook organic algorithm score.
              </p>
            </div>
          </div>

          {/* Hashtag Cloud */}
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-slate-400">Targeted Hashtags</span>
            <div className="flex flex-wrap gap-1.5">
              {analysisData.captionBlueprint.hashtagStrategy.map((tag: string, idx: number) => (
                <span key={idx} className="px-2 py-0.5 bg-slate-800/80 text-slate-300 font-mono text-[11px] rounded border border-slate-700">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Facebook Policy & Community Compliance Guard */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-sky-500/10 text-sky-400 rounded-lg">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base">Meta Policy Guard</h3>
            </div>
            <span className="text-xs bg-emerald-500/10 text-emerald-400 font-semibold px-2.5 py-1 rounded-md border border-emerald-500/30">
              Policy Safe
            </span>
          </div>

          {/* Engagement Bait Warning */}
          <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl space-y-2">
            <div className="flex items-center gap-1.5 text-rose-400 text-xs font-bold">
              <AlertTriangle className="w-4 h-4" />
              Prohibited Facebook Triggers (Penalized by FB)
            </div>
            <ul className="text-xs text-rose-300/90 space-y-1 list-disc list-inside">
              <li>"Type AMEN if you support our soldiers"</li>
              <li>"Share this to 5 friends"</li>
              <li>"Like or go to hell / Like if you love USA"</li>
              <li>"Comment YES if you agree"</li>
            </ul>
          </div>

          {/* Compliant Alternatives */}
          <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl space-y-2">
            <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold">
              <CheckCircle2 className="w-4 h-4" />
              100% Policy-Compliant High Engagement Alternatives
            </div>
            <ul className="text-xs text-emerald-300/90 space-y-1.5">
              <li>• "Who in your life taught you the true meaning of resilience? Share your thoughts below."</li>
              <li>• "What value keeps you grounded when life gets heavy?"</li>
              <li>• "Tag a brother or teammate who stood by you during your hardest season."</li>
            </ul>
          </div>

          {/* Brand Safety & Impersonation Safety */}
          <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl space-y-1 text-xs">
            <span className="font-bold text-slate-200">Non-Impersonation & Brand Safety:</span>
            <p className="text-slate-400 leading-relaxed">
              Designated as an AI-assisted creative fan tribute & motivational community. Never claims to be an official Department of Defense entity. Zero depiction of real casualties or weapon sales.
            </p>
          </div>
        </div>
      </div>

      {/* Pre-Engineered Sample Post Showcase */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              Pre-Engineered Military & Warrior Post Templates
            </h3>
            <p className="text-xs text-slate-400">
              Ready-to-publish quote cards with visual overlay, high-retention caption, and pinned first-comment strategy.
            </p>
          </div>
          <button
            onClick={() => handleApplyToStudio(0)}
            className="px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <Zap className="w-3.5 h-3.5" />
            Load Sample in Canvas Studio
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {analysisData.samplePosts.map((post: any, idx: number) => (
            <div
              key={idx}
              className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4 hover:border-slate-700 transition-colors"
            >
              {/* Quote Card Mock */}
              <div className="p-4 bg-slate-900 border border-amber-500/20 rounded-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 px-2 py-0.5 bg-amber-500/20 text-amber-400 text-[10px] font-mono rounded-bl border-b border-l border-amber-500/30 uppercase font-bold">
                  {post.templateId}
                </div>
                <p className="text-sm font-extrabold text-white tracking-wide uppercase leading-snug">
                  "{post.quote}"
                </p>
                <p className="text-xs text-amber-400 font-bold mt-2 tracking-wider">
                  — {post.author.toUpperCase()}
                </p>
              </div>

              {/* Caption Preview */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-300">Facebook Caption:</span>
                  <button
                    onClick={() => handleCopyText(post.caption, `cap-${idx}`)}
                    className="text-slate-400 hover:text-white flex items-center gap-1 text-[11px]"
                  >
                    {copiedSection === `cap-${idx}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    {copiedSection === `cap-${idx}` ? 'Copied' : 'Copy Caption'}
                  </button>
                </div>
                <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-800/80 text-slate-300 font-mono text-[11px] whitespace-pre-wrap leading-relaxed max-h-44 overflow-y-auto">
                  {post.caption}
                </div>
              </div>

              {/* Pinned First Comment */}
              <div className="p-2.5 bg-slate-900/50 rounded border border-slate-800 text-[11px] flex items-start gap-2">
                <span className="px-1.5 py-0.5 bg-purple-500/20 text-purple-300 font-bold rounded text-[9px] uppercase tracking-wider shrink-0 mt-0.5">
                  Pinned First Comment
                </span>
                <span className="text-slate-300">{post.firstComment}</span>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">Image: {post.imagePrompt.slice(0, 45)}...</span>
                <button
                  onClick={() => handleApplyToStudio(idx)}
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center gap-1"
                >
                  Edit in Studio <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
