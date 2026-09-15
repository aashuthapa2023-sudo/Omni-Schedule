import React, { useState } from 'react';
import { FacebookPage, ScheduledPost, QuoteTemplate, Quote } from '../types';
import { Zap, Sparkles, Calendar, CheckCircle2, Clock, Check, X, AlertCircle, Lock } from 'lucide-react';
import { CURATED_BACKGROUNDS, DEFAULT_TEMPLATES, getCuratedBackgroundForNiche } from '../data/defaultData';
import { generateAestheticImage } from '../utils/imageGenerator';

interface BatchAutoSchedulerModalProps {
  isOpen: boolean;
  onClose: () => void;
  pages: FacebookPage[];
  activePage: FacebookPage;
  templates: QuoteTemplate[];
  quotes: Quote[];
  onBatchCreated: (posts: ScheduledPost[]) => void;
}

export const BatchAutoSchedulerModal: React.FC<BatchAutoSchedulerModalProps> = ({
  isOpen,
  onClose,
  pages,
  activePage,
  templates = DEFAULT_TEMPLATES,
  quotes,
  onBatchCreated,
}) => {
  const [selectedPageId, setSelectedPageId] = useState<string>(activePage.id);
  const [postCount, setPostCount] = useState<number>(5);
  const [postsPerDay, setPostsPerDay] = useState<number>(2);
  const [startFromDate, setStartFromDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().slice(0, 10);
  });
  const [engineType, setEngineType] = useState<'python' | 'gemini'>('python');
  const [sourcePref, setSourcePref] = useState<string>('all');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [progressStatus, setProgressStatus] = useState<string>('');
  const [completedPosts, setCompletedPosts] = useState<ScheduledPost[]>([]);

  if (!isOpen) return null;

  const targetPage = pages.find((p) => p.id === selectedPageId) || activePage;

  const handleRunBatch = async () => {
    setIsProcessing(true);

    try {
      const generatedBatch: ScheduledPost[] = [];
      const baseDate = new Date(startFromDate);
      const preferredHours = targetPage.postingCadence?.preferredTimes?.map((t) => parseInt(t.split(':')[0])) || [9, 19];

      if (engineType === 'python') {
        setProgressStatus('1/3: 🐍 Python querying Wikimedia, NASA & Unsplash multi-source image archives for exact niche assets...');

        const res = await fetch('/api/python/batch-generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            pageId: selectedPageId,
            niche: targetPage.nicheCategory || targetPage.niche,
            count: postCount,
            handle: targetPage.brandName || targetPage.handle || targetPage.name,
            template: targetPage.defaultTemplateId || 'tactical-gold-tag',
            sourcePreference: sourcePref !== 'all' ? sourcePref : undefined,
          }),
        });

        const data = await res.json();
        const pythonPosts = data.posts || [];

        setProgressStatus('2/3: 🐍 Applying chiaroscuro grading and typography layout...');

        for (let i = 0; i < pythonPosts.length; i++) {
          const p = pythonPosts[i];
          const dayOffset = Math.floor(i / postsPerDay);
          const slotIdx = i % preferredHours.length;
          const targetHour = preferredHours[slotIdx] || 10;

          const scheduledTime = new Date(baseDate);
          scheduledTime.setDate(scheduledTime.getDate() + dayOffset);
          scheduledTime.setHours(targetHour, 0, 0, 0);

          generatedBatch.push({
            id: p.id || `batch-py-${Date.now()}-${i}`,
            pageId: selectedPageId,
            quoteText: p.quote,
            author: p.author || 'Thinker',
            renderedImageUrl: p.rawSourceImageUrl || p.renderedImageUrl,
            rawImageUrl: p.rawSourceImageUrl,
            imagePrompt: `${p.imageSource || 'Python Engine'}: ${p.imageTitle || targetPage.niche}`,
            caption: p.caption || `"${p.quote}" — ${p.author}`,
            hashtags: p.tags || [`#${targetPage.nicheCategory}`, '#Philosophy'],
            templateId: targetPage.defaultTemplateId || p.suggestedTemplate || 'tactical-gold-tag',
            typography: targetPage.templateCustomization || undefined,
            brandWatermark: targetPage.brandName || targetPage.name,
            aspectRatio: '1:1',
            scheduledTime: scheduledTime.toISOString(),
            status: 'scheduled',
            createdAt: new Date().toISOString(),
          });
        }
      } else {
        // Fallback Gemini engine
        setProgressStatus('1/3: Analyzing page niche and generating profound quotes with Gemini AI...');
        const res = await fetch('/api/gemini/auto-batch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            pageName: targetPage.name,
            niche: targetPage.niche,
            count: postCount,
          }),
        });

        const data = await res.json();
        const postConcepts = data.posts || [];

        setProgressStatus('2/3: Generating atmospheric aesthetic backgrounds and layouts...');

        for (let i = 0; i < postConcepts.length; i++) {
          const concept = postConcepts[i];
          const dayOffset = Math.floor(i / postsPerDay);
          const slotIdx = i % preferredHours.length;
          const targetHour = preferredHours[slotIdx] || 10;

          const scheduledTime = new Date(baseDate);
          scheduledTime.setDate(scheduledTime.getDate() + dayOffset);
          scheduledTime.setHours(targetHour, 0, 0, 0);

          const seed = Math.floor(Math.random() * 9000000) + 1000000;
          let imageUrl = getCuratedBackgroundForNiche(targetPage.nicheCategory || targetPage.niche, i);
          try {
            const gen = await generateAestheticImage({
              prompt: concept.imagePrompt || `${targetPage.niche} cinematic atmospheric wallpaper`,
              seed,
              width: 1080,
              height: 1080,
            });
            if (gen.imageUrl) {
              imageUrl = gen.imageUrl;
            }
          } catch {
            // Fallback
          }

          generatedBatch.push({
            id: `batch-post-${Date.now()}-${i}`,
            pageId: selectedPageId,
            quoteText: concept.quote,
            author: concept.author || 'Thinker',
            renderedImageUrl: imageUrl,
            rawImageUrl: imageUrl,
            imagePrompt: concept.imagePrompt || `${targetPage.niche} aesthetic cinematic wallpaper`,
            caption: concept.caption || `"${concept.quote}" — ${concept.author}`,
            hashtags: concept.tags || [`#${targetPage.nicheCategory}`, '#Quotes', '#Philosophy'],
            templateId: targetPage.defaultTemplateId || concept.suggestedTemplate || 'modern-editorial',
            typography: targetPage.templateCustomization || undefined,
            brandWatermark: targetPage.brandName || targetPage.name,
            aspectRatio: '1:1',
            scheduledTime: scheduledTime.toISOString(),
            status: 'scheduled',
            createdAt: new Date().toISOString(),
          });
        }
      }

      setProgressStatus('3/3: Finalizing schedule queue and cadence timers...');
      setCompletedPosts(generatedBatch);
      onBatchCreated(generatedBatch);
    } catch (e) {
      console.error('Batch error', e);
      setProgressStatus('Error occurred during batch generation. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8 p-6 space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-0.5 flex items-center justify-center">
              <Zap className="w-5 h-5 text-white fill-white" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Batch Auto-Scheduler Pipeline</h3>
              <p className="text-xs text-slate-400">Generate and queue multiple posts automatically</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Configuration Form */}
        {!completedPosts.length ? (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
                Select Target Facebook Page
              </label>
              <select
                value={selectedPageId}
                onChange={(e) => setSelectedPageId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                {pages.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.handle}) — Niche: {p.niche}
                  </option>
                ))}
              </select>

              {/* Locked Fixed Template Badge for Selected Page */}
              <div className="mt-2.5 bg-slate-950 border border-amber-500/30 rounded-xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 bg-amber-500/10 text-amber-400 rounded-lg border border-amber-500/20">
                    <Lock className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-xs font-extrabold text-amber-200 flex items-center gap-1.5">
                      <span>Fixed Template:</span>
                      <span className="text-white underline decoration-amber-400/50">
                        {DEFAULT_TEMPLATES.find((t) => t.id === targetPage.defaultTemplateId)?.name || targetPage.defaultTemplateId || 'Tactical Gold Tag'}
                      </span>
                    </div>
                    <p className="text-[10.5px] text-slate-400">
                      All generated batch quotes for this page will strictly use this locked template style.
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 shrink-0">
                  🔒 Locked
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
                  Number of Posts to Generate
                </label>
                <select
                  value={postCount}
                  onChange={(e) => setPostCount(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value={3}>3 Posts (Weekend Batch)</option>
                  <option value={5}>5 Posts (1 Week)</option>
                  <option value={7}>7 Posts (Full Week)</option>
                  <option value={10}>10 Posts (Extended)</option>
                  <option value={14}>14 Posts (2 Weeks)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
                  Posting Cadence (Per Day)
                </label>
                <select
                  value={postsPerDay}
                  onChange={(e) => setPostsPerDay(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value={1}>1 Post / Day</option>
                  <option value={2}>2 Posts / Day (Recommended)</option>
                  <option value={3}>3 Posts / Day (High Growth)</option>
                </select>
              </div>
            </div>

            {/* Engine Selection */}
            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
                Quote & Image Processing Engine
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setEngineType('python')}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    engineType === 'python'
                      ? 'bg-amber-950/40 border-amber-500/50 text-amber-200 shadow-sm'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="font-bold text-xs flex items-center gap-1.5 text-amber-300">
                    <span>🐍 Python Multi-Source</span>
                    <span className="text-[10px] bg-amber-500/20 px-1.5 py-0.2 rounded text-amber-300 font-mono">Fast</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1 leading-tight">
                    Wikimedia + NASA + Unsplash archives with chiaroscuro grading.
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setEngineType('gemini')}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    engineType === 'gemini'
                      ? 'bg-cyan-950/40 border-cyan-500/50 text-cyan-200 shadow-sm'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="font-bold text-xs flex items-center gap-1.5 text-cyan-300">
                    <span>✨ Gemini AI Engine</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1 leading-tight">
                    Generative AI prompt synthesis with dynamic Perchance background.
                  </div>
                </button>
              </div>
            </div>

            {engineType === 'python' && (
              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
                  Image Source Archive Preference
                </label>
                <select
                  value={sourcePref}
                  onChange={(e) => setSourcePref(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="all">🌐 All Multi-Source Archives (Best Variety)</option>
                  <option value="wikimedia">🏛️ Wikimedia Commons (Public Domain / Military / Classical)</option>
                  <option value="nasa">🚀 NASA Deep Space (Hubble & JWST Observatories)</option>
                  <option value="unsplash">🎬 Unsplash Cinematic HD (Dark Chiaroscuro Portraits)</option>
                </select>
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
                Start Date for Schedule Queue
              </label>
              <input
                type="date"
                value={startFromDate}
                onChange={(e) => setStartFromDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Pipeline Features Checklist */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-2 text-xs text-slate-300">
              <div className="font-semibold text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>What this automated batch will do:</span>
              </div>
              <ul className="space-y-1.5 text-[11px] text-slate-400">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Curates profound quotes tailored to <strong>{targetPage.niche}</strong></span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Applies Perchance aesthetic atmospheric backgrounds and watermark <strong>{targetPage.handle}</strong></span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Writes engaging Facebook captions, questions, and hashtags</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Schedules posts automatically across upcoming days at optimal hours</span>
                </li>
              </ul>
            </div>

            {isProcessing && (
              <div className="p-3 bg-indigo-950/40 border border-indigo-500/30 rounded-xl text-xs text-indigo-300 flex items-center gap-2 animate-pulse">
                <Clock className="w-4 h-4 animate-spin" />
                <span>{progressStatus}</span>
              </div>
            )}

            <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
              <button onClick={onClose} className="px-4 py-2 text-xs text-slate-400 hover:text-white">
                Cancel
              </button>
              <button
                onClick={handleRunBatch}
                disabled={isProcessing}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-cyan-500/20 transition-all"
              >
                <Zap className="w-4 h-4" />
                <span>{isProcessing ? 'Generating Batch...' : `Generate & Auto-Schedule ${postCount} Posts`}</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-emerald-500/20 border border-emerald-500/40 p-4 rounded-xl text-emerald-200 text-xs flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
              <div>
                <div className="font-bold text-sm text-white">Batch Scheduled Successfully!</div>
                <div>{completedPosts.length} posts have been created and added to the queue for {targetPage.name}.</div>
              </div>
            </div>

            <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
              {completedPosts.map((p, idx) => (
                <div key={idx} className="bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img src={p.renderedImageUrl} alt="thumb" className="w-8 h-8 rounded-lg object-cover" />
                    <div className="truncate">
                      <div className="font-semibold text-white truncate">“{p.quoteText}”</div>
                      <div className="text-[10px] text-slate-400">— {p.author}</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-indigo-400 shrink-0">
                    {new Date(p.scheduledTime).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={onClose}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow"
              >
                View in Scheduler
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
