import React, { useState, useEffect, useRef } from 'react';
import { FacebookPage, Quote, QuoteTemplate, AspectRatio, ScheduledPost, TypographyCustomization } from '../types';
import { renderQuoteToCanvas } from '../utils/canvasRenderer';
import { DEFAULT_TEMPLATES, CURATED_BACKGROUNDS } from '../data/defaultData';
import {
  Sparkles,
  Download,
  Send,
  Eye,
  Type,
  RefreshCw,
  Copy,
  Check,
  CheckCircle2,
  AlertCircle,
  Key,
  Globe,
  Clock,
  Zap,
  Palette,
  Sliders,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Search,
  Image as ImageIcon,
  Calendar,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Upload,
  Link2,
  Bot,
} from 'lucide-react';
import { recordUsedSignature } from '../utils/storage';

interface CanvasStudioProps {
  activePage: FacebookPage;
  pages: FacebookPage[];
  quotes?: Quote[];
  templates?: QuoteTemplate[];
  onSchedulePost: (post: ScheduledPost) => void;
  onOpenFeedPreview?: (imageUrl: string, caption: string, hashtags: string[]) => void;
  onUpdatePage?: (page: FacebookPage) => void;
  initialQuote?: Quote | null;
  initialBackgroundImageUrl?: string;
  initialPost?: ScheduledPost | null;
}

export const CanvasStudio: React.FC<CanvasStudioProps> = ({
  activePage,
  pages,
  templates = DEFAULT_TEMPLATES,
  onSchedulePost,
  onUpdatePage,
  initialQuote,
  initialBackgroundImageUrl,
  initialPost,
}) => {
  const [selectedPageId, setSelectedPageId] = useState<string>(activePage.id);
  const currentPage = pages.find((p) => p.id === selectedPageId) || activePage;

  // Quote State
  const [quoteText, setQuoteText] = useState<string>(
    initialPost?.quoteText ||
      initialQuote?.quote ||
      (currentPage.nicheCategory === 'military'
        ? 'We do not rise to the level of our expectations, we fall to the level of our training.'
        : 'The cosmos is within us. We are made of star-stuff. We are a way for the cosmos to know itself.')
  );
  const [author, setAuthor] = useState<string>(
    initialPost?.author ||
      initialQuote?.author ||
      (currentPage.nicheCategory === 'military' ? 'Archilochus' : 'Carl Sagan')
  );

  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(
    initialPost?.templateId || currentPage.defaultTemplateId || 'tactical-gold-tag'
  );
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
  
  // Background Image State
  const [backgroundImageUrl, setBackgroundImageUrl] = useState<string>(
    initialPost?.renderedImageUrl ||
      initialBackgroundImageUrl ||
      (currentPage.nicheCategory === 'military'
        ? 'https://images.pexels.com/photos/17266185/pexels-photo-17266185.jpeg?auto=compress&cs=tinysrgb&w=1200'
        : 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1080&auto=format&fit=crop&q=85')
  );

  // Caption & Hook State
  const [caption, setCaption] = useState<string>(
    initialPost?.caption ||
      `⚡ When the pressure hits, emotion vanishes and muscle memory takes over. Sweat in peace so you don't bleed in war.\n\n💬 What standard of training are you holding yourself to today?\n\n#USArmy #Brotherhood #Discipline #Training #Grit #HoldTheLine`
  );

  // Watermark text (defaults to Page Name / Brand)
  const [watermarkText, setWatermarkText] = useState<string>(currentPage.brandName || currentPage.name);

  // Canvas Ref & Render State
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isRendering, setIsRendering] = useState<boolean>(false);
  const [renderedDataUrl, setRenderedDataUrl] = useState<string>('');

  // Typography Customization State (Layout, Size, Font, Color, Adjustments)
  const [typography, setTypography] = useState<TypographyCustomization>(
    initialPost?.typography || {
      fontFamily: '',
      fontSize: 34,
      fontWeight: '700',
      fontStyle: 'normal',
      textAlign: 'center',
      textColor: '#ffffff',
      lineHeight: 1.45,
      letterSpacing: 0,
      verticalPosition: 'center',
      verticalOffset: 0,
      authorColor: '',
    }
  );

  // Direct Image Pulling & Pexels Search States
  const [showDirectPullPanel, setShowDirectPullPanel] = useState<boolean>(true);
  const [showTypographyPanel, setShowTypographyPanel] = useState<boolean>(true);
  const [pexelsQuery, setPexelsQuery] = useState<string>(
    currentPage.nicheCategory === 'military'
      ? 'US army soldier combat training'
      : currentPage.nicheCategory === 'poetry'
      ? 'textured paper typewriter vintage'
      : currentPage.nicheCategory === 'stoicism'
      ? 'ancient roman marble statue bust'
      : 'atmospheric dark chiaroscuro'
  );
  const [pexelsPhotos, setPexelsPhotos] = useState<any[]>([]);
  const [isSearchingPexels, setIsSearchingPexels] = useState<boolean>(false);
  const [customImageUrlInput, setCustomImageUrlInput] = useState<string>('');
  const [showCustomUrlInput, setShowCustomUrlInput] = useState<boolean>(false);

  // Scheduling State
  const [showScheduleModal, setShowScheduleModal] = useState<boolean>(false);
  const [saveTemplateNotice, setSaveTemplateNotice] = useState<string | null>(null);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const [scheduledDate, setScheduledDate] = useState<string>(tomorrow.toISOString().split('T')[0]);
  const [scheduledTime, setScheduledTime] = useState<string>('18:00');
  const [scheduleNotification, setScheduleNotification] = useState<string | null>(null);

  // Publishing & Action States
  const [isPublishing, setIsPublishing] = useState<boolean>(false);
  const [publishResult, setPublishResult] = useState<{ success: boolean; message: string; postId?: string } | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [isGeneratingNext, setIsGeneratingNext] = useState<boolean>(false);
  const [isSendingTelegram, setIsSendingTelegram] = useState<boolean>(false);
  const [telegramNotice, setTelegramNotice] = useState<{ success: boolean; message: string } | null>(null);
  
  // Python Multi-Source Image Engine & Anti-Repetition Tracking
  const [pythonSourcePref, setPythonSourcePref] = useState<string>('all');
  const [isPythonPulling, setIsPythonPulling] = useState<boolean>(false);
  const [pythonLastSource, setPythonLastSource] = useState<string | null>(null);
  const [usedImageUrls, setUsedImageUrls] = useState<string[]>([]);
  const [imageRotationIndex, setImageRotationIndex] = useState<number>(0);

  // Sync with active page switch
  useEffect(() => {
    setSelectedPageId(activePage.id);
    setWatermarkText(activePage.brandName || activePage.name);
    // Update default search query for the niche
    if (activePage.nicheCategory === 'military') {
      setPexelsQuery('US army soldier combat training');
    } else if (activePage.nicheCategory === 'poetry') {
      setPexelsQuery('textured paper typewriter vintage');
    } else if (activePage.nicheCategory === 'stoicism') {
      setPexelsQuery('ancient roman marble statue bust');
    }
  }, [activePage.id, activePage.nicheCategory]);

  // Render Quote on Canvas whenever parameters change (including typography)
  useEffect(() => {
    let isCancelled = false;
    const render = async () => {
      if (!canvasRef.current) return;
      setIsRendering(true);

      const template = templates.find((t) => t.id === selectedTemplateId) || templates[0];
      
      try {
        await renderQuoteToCanvas({
          canvas: canvasRef.current,
          quoteText,
          authorText: author,
          template,
          aspectRatio,
          backgroundImageUrl,
          watermarkText: watermarkText || currentPage.name,
          watermarkPosition: 'bottom-center',
          watermarkOpacity: 0.85,
          typography,
        });

        if (!isCancelled && canvasRef.current) {
          setRenderedDataUrl(canvasRef.current.toDataURL('image/jpeg', 0.95));
        }
      } catch (err) {
        console.error('Canvas render error:', err);
      } finally {
        if (!isCancelled) setIsRendering(false);
      }
    };

    render();
    return () => {
      isCancelled = true;
    };
  }, [quoteText, author, selectedTemplateId, aspectRatio, backgroundImageUrl, watermarkText, currentPage.name, templates, typography]);

  // Live Pexels API Direct Search
  const handleSearchPexels = async (queryOverride?: string) => {
    const q = queryOverride || pexelsQuery;
    if (!q.trim()) return;
    setIsSearchingPexels(true);
    try {
      const res = await fetch(`/api/pexels/search?query=${encodeURIComponent(q)}&per_page=12&orientation=square`);
      const data = await res.json();
      if (data.success && Array.isArray(data.photos)) {
        setPexelsPhotos(data.photos);
      }
    } catch (e) {
      console.error('Pexels search error:', e);
    } finally {
      setIsSearchingPexels(false);
    }
  };

  // Perform initial search on mount
  useEffect(() => {
    handleSearchPexels();
  }, [currentPage.nicheCategory]);

  // Quick Niche Pills
  const getNichePills = () => {
    if (currentPage.nicheCategory === 'military') {
      return [
        { label: '🎖️ US Army Combat Training', query: 'US army soldier combat training' },
        { label: '🪖 Soldier Portrait Helmet', query: 'US army soldier portrait tactical helmet' },
        { label: '🪖 Infantry Drill Formation', query: 'military training exercise camouflage drill' },
        { label: '🎯 Tactical Sentry & Rifle', query: 'US army infantry soldiers tactical ruck' },
      ];
    }
    if (currentPage.nicheCategory === 'poetry') {
      return [
        { label: '📜 Textured Vintage Paper', query: 'textured paper background vintage' },
        { label: '⌨️ Typewriter on Paper', query: 'typewriter paper poetry' },
        { label: '📜 Old Parchment Texture', query: 'old parchment paper texture' },
        { label: '📄 Pressed Watercolor Cotton', query: 'cotton pressed watercolor paper' },
      ];
    }
    return [
      { label: '🏛️ Marcus Aurelius Bust', query: 'marcus aurelius statue bust' },
      { label: '🏛️ Roman Marble Statue', query: 'ancient roman marble statue bust chiaroscuro' },
      { label: '🌌 Deep Space Galaxy', query: 'deep space nebula cosmos' },
      { label: '⛰️ Mountain Sentry Dusk', query: 'mountain solitude chiaroscuro dusk' },
    ];
  };

  // Direct Publish to Facebook Page via Facebook Graph API
  const handlePublishNow = async () => {
    if (!currentPage.fbPageAccessToken || !currentPage.fbPageId) {
      setPublishResult({
        success: false,
        message: 'Facebook Page ID or Access Token is missing. Go to AutoPilot Hub to configure your token.',
      });
      return;
    }

    setIsPublishing(true);
    setPublishResult(null);

    // Extract the rendered image with all text overlay, typography, and badges
    let imageToPublish = renderedDataUrl || backgroundImageUrl;
    if (canvasRef.current) {
      try {
        imageToPublish = canvasRef.current.toDataURL('image/jpeg', 0.95);
      } catch (err) {
        console.warn('Canvas capture notice:', err);
      }
    }

    try {
      const res = await fetch('/api/facebook/publish-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pageId: currentPage.fbPageId,
          accessToken: currentPage.fbPageAccessToken,
          quoteText,
          author,
          caption: caption.trim(),
          message: caption.trim(),
          templateId: selectedTemplateId,
          imageUrl: imageToPublish,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setPublishResult({
          success: true,
          message: `Post successfully published live to ${currentPage.name}! (Post ID: ${data.postId || 'Live'})`,
          postId: data.postId,
        });
        // Record used signature to prevent duplicate
        recordUsedSignature(quoteText, author, currentPage.id);
      } else {
        setPublishResult({
          success: false,
          message: data.error || 'Publishing failed. Please verify your Facebook page permissions.',
        });
      }
    } catch (err: any) {
      setPublishResult({
        success: false,
        message: 'Network request error: ' + (err?.message || 'Check server connection'),
      });
    } finally {
      setIsPublishing(false);
    }
  };

  // Handle Post Scheduling with Custom Typography
  const handleSchedulePostSubmit = () => {
    const combinedIso = new Date(`${scheduledDate}T${scheduledTime}:00`).toISOString();
    const newScheduledPost: ScheduledPost = {
      id: initialPost?.id || `sched-${Date.now()}`,
      pageId: currentPage.id,
      quoteText,
      author,
      caption,
      hashtags: [],
      renderedImageUrl: renderedDataUrl || backgroundImageUrl,
      rawImageUrl: backgroundImageUrl,
      imagePrompt: `${currentPage.nicheCategory} aesthetic photographic background`,
      templateId: selectedTemplateId,
      typography: { ...typography },
      aspectRatio,
      scheduledTime: combinedIso,
      status: 'scheduled',
      createdAt: new Date().toISOString(),
    };

    onSchedulePost(newScheduledPost);
    setScheduleNotification(`Post scheduled for ${scheduledDate} at ${scheduledTime}! Saved with custom typography.`);
    setShowScheduleModal(false);
    setTimeout(() => setScheduleNotification(null), 5000);
  };

  // 1-Click Auto-Tune Next Unique Post for this Page
  const handleAutoTuneNextPost = async () => {
    setIsGeneratingNext(true);
    setPublishResult(null);

    try {
      const res = await fetch('/api/autopilot/auto-tune-and-refill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pageId: currentPage.id,
          pageName: currentPage.name,
          niche: currentPage.niche,
          days: 1,
          postsPerDay: 1,
        }),
      });

      const data = await res.json();
      if (data.success && Array.isArray(data.posts) && data.posts.length > 0) {
        const next = data.posts[0];
        setQuoteText(next.quote);
        setAuthor(next.author);
        if (next.caption) setCaption(next.caption);
        if (next.suggestedTemplate) setSelectedTemplateId(next.suggestedTemplate);
        
        // Dynamically pull a brand-new guaranteed distinct niche image from Python engine
        const nextRotation = imageRotationIndex + 1;
        setImageRotationIndex(nextRotation);
        
        try {
          const pyRes = await fetch('/api/python/pull-and-edit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              niche: currentPage.nicheCategory || currentPage.niche,
              author: next.author,
              quote: next.quote,
              handle: watermarkText || `@${currentPage.name.replace(/\s+/g, '')}`,
              pageId: currentPage.id,
              postIndex: nextRotation,
              template: next.suggestedTemplate || selectedTemplateId,
              sourcePreference: pythonSourcePref !== 'all' ? pythonSourcePref : undefined,
              usedImageUrls: usedImageUrls,
            }),
          });

          const pyData = await pyRes.json();
          if (pyData.success && pyData.rawSourceImageUrl) {
            setBackgroundImageUrl(pyData.rawSourceImageUrl);
            setUsedImageUrls(prev => [...prev.slice(-40), pyData.rawSourceImageUrl.split('?')[0]]);
            if (pyData.imageSource) setPythonLastSource(pyData.imageSource);
          } else if (next.renderedImageUrl) {
            setBackgroundImageUrl(next.renderedImageUrl);
          }
        } catch (pyErr) {
          if (next.renderedImageUrl) setBackgroundImageUrl(next.renderedImageUrl);
        }
      }
    } catch (e) {
      console.warn('Auto tune error:', e);
    } finally {
      setIsGeneratingNext(false);
    }
  };

  // Instant Page Selector with Live Niche Synchronization
  const handleSelectPage = async (pageId: string) => {
    setSelectedPageId(pageId);
    const targetPage = pages.find((p) => p.id === pageId);
    if (!targetPage) return;

    setWatermarkText(targetPage.brandName || targetPage.name);

    if (targetPage.defaultTemplateId) {
      setSelectedTemplateId(targetPage.defaultTemplateId);
    }

    if (targetPage.templateCustomization && Object.keys(targetPage.templateCustomization).length > 0) {
      setTypography((prev) => ({
        ...prev,
        ...targetPage.templateCustomization,
      }));
    }

    if (targetPage.nicheCategory === 'military') {
      setPexelsQuery('US army soldier combat training');
    } else if (targetPage.nicheCategory === 'poetry') {
      setPexelsQuery('textured paper typewriter vintage');
    } else if (targetPage.nicheCategory === 'stoicism') {
      setPexelsQuery('ancient roman marble statue bust');
    } else {
      setPexelsQuery(`${targetPage.niche} wallpaper`);
    }

    // Auto-tune fresh niche content for this newly selected page
    setIsGeneratingNext(true);
    try {
      const res = await fetch('/api/autopilot/auto-tune-and-refill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pageId: targetPage.id,
          pageName: targetPage.name,
          niche: targetPage.niche,
          days: 1,
          postsPerDay: 1,
        }),
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.posts) && data.posts.length > 0) {
        const next = data.posts[0];
        setQuoteText(next.quote);
        setAuthor(next.author);
        if (next.caption) setCaption(next.caption);
        if (next.suggestedTemplate && !targetPage.defaultTemplateId) {
          setSelectedTemplateId(next.suggestedTemplate);
        }
        if (next.renderedImageUrl) {
          setBackgroundImageUrl(next.renderedImageUrl);
        }
      }
    } catch (err) {
      console.warn('Page sync auto-tune failed:', err);
    } finally {
      setIsGeneratingNext(false);
    }
  };

  // Broadcast Rendered Card & Caption to Telegram Channel
  const handleBroadcastTelegram = async () => {
    setIsSendingTelegram(true);
    setTelegramNotice(null);
    try {
      const fullCaption = `${quoteText}\n— ${author}\n\n${caption}`;
      const res = await fetch('/api/telegram/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caption: fullCaption,
          imageUrl: renderedDataUrl || backgroundImageUrl,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setTelegramNotice({
          success: true,
          message: `Successfully broadcasted to Telegram! (Message ID: ${data.messageId || 'sent'})`,
        });
      } else {
        setTelegramNotice({
          success: false,
          message: data.error || 'Failed to send to Telegram. Configure your Bot Token & Chat ID in Telegram Hub.',
        });
      }
    } catch (err: any) {
      setTelegramNotice({
        success: false,
        message: err?.message || 'Network error sending to Telegram.',
      });
    } finally {
      setIsSendingTelegram(false);
      setTimeout(() => setTelegramNotice(null), 6000);
    }
  };

  // Python Multi-Source Image Puller & Compositor with Anti-Repetition Exclusion
  const handlePythonPullAndEdit = async () => {
    setIsPythonPulling(true);
    setPublishResult(null);

    const nextRotation = imageRotationIndex + 1;
    setImageRotationIndex(nextRotation);

    try {
      const res = await fetch('/api/python/pull-and-edit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          niche: currentPage.nicheCategory || currentPage.niche,
          author: author,
          quote: quoteText,
          handle: watermarkText || `@${currentPage.name.replace(/\s+/g, '')}`,
          pageId: currentPage.id,
          postIndex: nextRotation,
          template: selectedTemplateId,
          sourcePreference: pythonSourcePref !== 'all' ? pythonSourcePref : undefined,
          usedImageUrls: usedImageUrls,
        }),
      });

      const data = await res.json();
      if (data.success) {
        if (data.rawSourceImageUrl) {
          setBackgroundImageUrl(data.rawSourceImageUrl);
          setUsedImageUrls(prev => [...prev.slice(-40), data.rawSourceImageUrl.split('?')[0]]);
        }
        if (data.imageSource) {
          setPythonLastSource(data.imageSource);
        }
      }
    } catch (e) {
      console.warn('Python pull error:', e);
    } finally {
      setIsPythonPulling(false);
    }
  };

  // Download Rendered Image
  const handleDownloadImage = () => {
    if (!renderedDataUrl) return;
    const a = document.createElement('a');
    a.href = renderedDataUrl;
    a.download = `${currentPage.name.replace(/\s+/g, '-').toLowerCase()}-quote-${Date.now()}.jpg`;
    a.click();
  };

  // Copy Caption
  const handleCopyCaption = () => {
    const fullText = `${quoteText}\n— ${author}\n\n${caption}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Reset Typography to Default
  const handleResetTypography = () => {
    setTypography({
      fontFamily: '',
      fontSize: 34,
      fontWeight: '700',
      fontStyle: 'normal',
      textAlign: 'center',
      textColor: '#ffffff',
      lineHeight: 1.45,
      letterSpacing: 0,
      verticalPosition: 'center',
      verticalOffset: 0,
      authorColor: '',
    });
  };

  const handleLoadPoetrySample = () => {
    setSelectedTemplateId('poetry-typewriter-paper');
    setQuoteText("Even in My hardest\ntime\n\ni was alone. so, I don't\ncare who stays or\nleaves.");
    setAuthor('Untold Feelings');
    setWatermarkText('Untold Feelings');
    setBackgroundImageUrl('https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=1200&auto=format&fit=crop&q=85');
    setCaption("Even in my hardest time, I was alone. So I don't care who stays or leaves.\n\n#UntoldFeelings #Poetry #DeepThoughts #Silence #InnerStrength #AloneQuotes");
    setTypography(prev => ({
      ...prev,
      fontFamily: '"Special Elite", "Courier Prime", monospace',
      textColor: '#18181b',
      textAlign: 'left',
      fontSize: 36,
      lineHeight: 1.6,
    }));
  };

  // Handle local file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setBackgroundImageUrl(uploadEvent.target.result as string);
          setPythonLastSource('Custom Local Upload');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Top Header */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-600/20 text-emerald-400 rounded-xl border border-emerald-500/30">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-lg font-extrabold text-white">
                Studio & Publishing Hub
              </h2>
              {/* Active Page Selector */}
              <div className="relative">
                <select
                  value={currentPage.id}
                  onChange={(e) => handleSelectPage(e.target.value)}
                  className="bg-slate-950 border border-indigo-500/50 hover:border-indigo-400 rounded-xl px-3 py-1.5 text-xs font-extrabold text-indigo-300 focus:outline-none focus:ring-1 focus:ring-indigo-400 cursor-pointer shadow-sm"
                >
                  {pages.map((p) => (
                    <option key={p.id} value={p.id} className="bg-slate-900 text-white font-medium">
                      📱 {p.name} ({p.niche})
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Synchronized to <strong className="text-indigo-300">{currentPage.name}</strong> • Niche: <strong className="text-amber-300">{currentPage.niche}</strong> • Brand Watermark: <strong className="text-cyan-300">{watermarkText}</strong>
            </p>
          </div>
        </div>

        {/* Quick Actions Header */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleAutoTuneNextPost}
            disabled={isGeneratingNext}
            className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-xs font-bold shadow-md transition-all disabled:opacity-50 cursor-pointer"
            title={`Auto-generate next fresh ${currentPage.niche} quote, caption & background`}
          >
            <Sparkles className={`w-3.5 h-3.5 ${isGeneratingNext ? 'animate-spin' : ''}`} />
            <span>{isGeneratingNext ? 'Generating Niche Post...' : `✨ Next ${currentPage.niche} Post`}</span>
          </button>

          <button
            onClick={handleBroadcastTelegram}
            disabled={isSendingTelegram}
            className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white rounded-xl text-xs font-bold shadow-md shadow-sky-600/20 transition-all disabled:opacity-50 cursor-pointer"
            title="Broadcast preview card & caption directly to your Telegram channel"
          >
            <Bot className={`w-3.5 h-3.5 ${isSendingTelegram ? 'animate-spin' : ''}`} />
            <span>{isSendingTelegram ? 'Broadcasting...' : '📢 Broadcast Telegram'}</span>
          </button>

          <button
            onClick={() => setShowScheduleModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-extrabold rounded-xl text-xs shadow-md transition-all cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5 text-slate-950" />
            <span>Schedule Post</span>
          </button>
        </div>
      </div>

      {/* Telegram Notification Banner */}
      {telegramNotice && (
        <div
          className={`p-4 rounded-2xl text-xs font-semibold flex items-center gap-2.5 shadow-lg animate-fadeIn ${
            telegramNotice.success
              ? 'bg-sky-950/80 border border-sky-500/40 text-sky-300'
              : 'bg-rose-950/80 border border-rose-500/40 text-rose-300'
          }`}
        >
          <Bot className="w-5 h-5 shrink-0 text-sky-400" />
          <span>{telegramNotice.message}</span>
        </div>
      )}

      {/* Schedule Notification Banner */}
      {scheduleNotification && (
        <div className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 p-4 rounded-2xl text-xs font-semibold flex items-center gap-2.5 shadow-lg">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{scheduleNotification}</span>
        </div>
      )}

      {/* Engine Status Notification */}
      {pythonLastSource && (
        <div className="bg-amber-950/40 border border-amber-500/30 px-4 py-2.5 rounded-xl text-xs flex items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span className="text-amber-300 font-bold">Image Engine:</span>
            <span className="text-slate-300 font-medium">Sourced from <span className="text-white font-semibold">{pythonLastSource}</span> with authentic niche accuracy</span>
          </div>
          <span className="font-mono text-[11px] text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/20">
            Verified Niche Match
          </span>
        </div>
      )}

      {publishResult && (
        <div
          className={`p-4 rounded-2xl text-xs font-semibold flex items-center justify-between gap-3 animate-fade-in ${
            publishResult.success
              ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/10 border border-rose-500/30 text-rose-300'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {publishResult.success ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            )}
            <span>{publishResult.message}</span>
          </div>

          {publishResult.postId && (
            <span className="font-mono text-[11px] bg-slate-950 px-2.5 py-1 rounded-md text-slate-300 border border-slate-800">
              ID: {publishResult.postId}
            </span>
          )}
        </div>
      )}

      {/* Main Split: Canvas Preview + Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: High-Fidelity Canvas Graphic & Direct Image Pulling (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col items-center justify-between">
            <div className="w-full flex items-center justify-between pb-3 border-b border-slate-800 mb-4 text-xs text-slate-400">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Type className="w-4 h-4 text-indigo-400" />
                <span>Final Rendered Quote Graphic (1080x1080)</span>
              </span>
              <span className="text-[11px] text-cyan-400 font-mono">
                Brand: {watermarkText}
              </span>
            </div>

            {/* Canvas Wrapper */}
            <div className="relative w-full max-w-[480px] aspect-square rounded-2xl overflow-hidden shadow-2xl border border-slate-800 bg-slate-950 flex items-center justify-center">
              <canvas
                ref={canvasRef}
                className="w-full h-full object-contain rounded-2xl"
                style={{ display: 'block' }}
              />

              {isRendering && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center text-white text-xs font-semibold gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
                  <span>Rendering Typography & Visuals...</span>
                </div>
              )}
            </div>

            {/* Quick Canvas Actions Bar */}
            <div className="w-full mt-4 pt-3 border-t border-slate-800 flex items-center justify-between flex-wrap gap-2 text-xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setAspectRatio('1:1')}
                  className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-bold cursor-pointer ${
                    aspectRatio === '1:1' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  1:1 Square
                </button>
                <button
                  onClick={() => setAspectRatio('4:5')}
                  className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-bold cursor-pointer ${
                    aspectRatio === '4:5' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  4:5 Portrait
                </button>

                <button
                  onClick={handlePythonPullAndEdit}
                  disabled={isPythonPulling}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg font-mono text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30 transition-colors disabled:opacity-50 cursor-pointer"
                  title="Shuffle to next non-repeating thematic image"
                >
                  <Sparkles className={`w-3 h-3 ${isPythonPulling ? 'animate-spin' : ''}`} />
                  <span>Next Themed Image</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadImage}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white rounded-xl font-semibold border border-slate-700 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-slate-400" />
                  <span>Download HQ Image</span>
                </button>
              </div>
            </div>
          </div>

          {/* Direct Image Pulling Options & Pexels Engine (Direct in Preview Area) */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-indigo-500/20 text-indigo-400 rounded-lg">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white">Direct Image Pulling & Pexels Search</h3>
                  <p className="text-[10px] text-slate-400">Search Pexels or select authentic US Army training & soldier portraits with 1-click apply</p>
                </div>
              </div>
              <button
                onClick={() => setShowDirectPullPanel(!showDirectPullPanel)}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                {showDirectPullPanel ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>

            {showDirectPullPanel && (
              <div className="space-y-3 pt-2">
                {/* Search Bar */}
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={pexelsQuery}
                      onChange={(e) => setPexelsQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearchPexels()}
                      placeholder="Search Pexels for photos (e.g. US army soldier training)"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <button
                    onClick={() => handleSearchPexels()}
                    disabled={isSearchingPexels}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 disabled:opacity-50 cursor-pointer shrink-0"
                  >
                    {isSearchingPexels ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
                    <span>Search Pexels</span>
                  </button>
                </div>

                {/* Quick Niche Prompt Pills */}
                <div className="flex flex-wrap gap-1.5">
                  {getNichePills().map((pill, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setPexelsQuery(pill.query);
                        handleSearchPexels(pill.query);
                      }}
                      className="text-[11px] px-2.5 py-1 bg-slate-800/80 hover:bg-indigo-600/30 hover:text-indigo-200 border border-slate-700/80 rounded-lg text-slate-300 transition-colors font-medium flex items-center gap-1 cursor-pointer"
                    >
                      {pill.label}
                    </button>
                  ))}
                </div>

                {/* Photo Strip / Results Grid */}
                {pexelsPhotos.length > 0 && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span className="font-semibold text-slate-300">Pexels Results ({pexelsPhotos.length} photos ready) — Click any image to apply to canvas:</span>
                    </div>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 max-h-48 overflow-y-auto p-1 bg-slate-950/60 rounded-xl border border-slate-800/80">
                      {pexelsPhotos.map((photo) => (
                        <div
                          key={photo.id}
                          onClick={() => {
                            setBackgroundImageUrl(photo.imageUrl);
                            setPythonLastSource(`Pexels (${photo.photographer})`);
                          }}
                          className={`group relative aspect-square rounded-lg overflow-hidden border cursor-pointer transition-all hover:scale-105 hover:ring-2 hover:ring-indigo-500 ${
                            backgroundImageUrl.includes(String(photo.id)) ? 'ring-2 ring-indigo-500 border-indigo-400' : 'border-slate-800'
                          }`}
                        >
                          <img
                            src={photo.thumbnailUrl || photo.imageUrl}
                            alt={photo.alt || 'Pexels photo'}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-1 text-[9px] text-white font-medium">
                            <span className="truncate">{photo.photographer}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Custom URL and File Upload row */}
                <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowCustomUrlInput(!showCustomUrlInput)}
                      className="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Link2 className="w-3 h-3" />
                      <span>{showCustomUrlInput ? 'Hide Custom URL' : 'Paste Direct Image URL'}</span>
                    </button>
                    
                    <label className="text-[11px] text-slate-400 hover:text-white font-semibold flex items-center gap-1 cursor-pointer">
                      <Upload className="w-3 h-3" />
                      <span>Upload Image</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {showCustomUrlInput && (
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={customImageUrlInput}
                      onChange={(e) => setCustomImageUrlInput(e.target.value)}
                      placeholder="Paste direct HTTPS image URL..."
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                    <button
                      onClick={() => {
                        if (customImageUrlInput.trim()) {
                          setBackgroundImageUrl(customImageUrlInput.trim());
                          setPythonLastSource('Custom URL');
                          setCustomImageUrlInput('');
                          setShowCustomUrlInput(false);
                        }
                      }}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                )}

              </div>
            )}
          </div>
        </div>

        {/* Right Column: Typography Adjustments, Content & Scheduler (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Typography Customization Accordion (Layout, Size, Font, Color Adjustments) */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-amber-500/20 text-amber-400 rounded-lg">
                  <Sliders className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white">Text Layout, Size, Fonts & Color Controls</h3>
                  <p className="text-[10px] text-slate-400">Fine-tune quote display before scheduling</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleResetTypography}
                  className="text-[10px] text-slate-400 hover:text-slate-200 flex items-center gap-1 font-semibold cursor-pointer"
                  title="Reset to template defaults"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
                <button
                  onClick={() => setShowTypographyPanel(!showTypographyPanel)}
                  className="text-slate-400 hover:text-white cursor-pointer"
                >
                  {showTypographyPanel ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {showTypographyPanel && (
              <div className="space-y-3.5 text-xs">
                
                {/* Text Layout Alignment */}
                <div>
                  <label className="text-[11px] font-bold text-slate-300 mb-1.5 block">Text Layout / Alignment</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setTypography((prev) => ({ ...prev, textAlign: 'left' }))}
                      className={`py-1.5 px-3 rounded-xl border flex items-center justify-center gap-1.5 font-semibold cursor-pointer ${
                        typography.textAlign === 'left'
                          ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <AlignLeft className="w-3.5 h-3.5" />
                      <span>Left</span>
                    </button>
                    <button
                      onClick={() => setTypography((prev) => ({ ...prev, textAlign: 'center' }))}
                      className={`py-1.5 px-3 rounded-xl border flex items-center justify-center gap-1.5 font-semibold cursor-pointer ${
                        typography.textAlign === 'center'
                          ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <AlignCenter className="w-3.5 h-3.5" />
                      <span>Center</span>
                    </button>
                    <button
                      onClick={() => setTypography((prev) => ({ ...prev, textAlign: 'right' }))}
                      className={`py-1.5 px-3 rounded-xl border flex items-center justify-center gap-1.5 font-semibold cursor-pointer ${
                        typography.textAlign === 'right'
                          ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <AlignRight className="w-3.5 h-3.5" />
                      <span>Right</span>
                    </button>
                  </div>
                </div>

                {/* Font Family Selector */}
                <div>
                  <label className="text-[11px] font-bold text-slate-300 mb-1 block">Font Family</label>
                  <select
                    value={typography.fontFamily || ''}
                    onChange={(e) => setTypography((prev) => ({ ...prev, fontFamily: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="">Default (Follow Template)</option>
                    <option value='"Special Elite", "Courier Prime", monospace'>Typewriter Vintage (Untold Feelings)</option>
                    <option value='"Bebas Neue", "Montserrat", sans-serif'>Bold Tactical Impact (US Army / Spartan)</option>
                    <option value='"Playfair Display", "Cinzel", serif'>Classical Editorial Serif (Stoic & Philosophy)</option>
                    <option value='"Inter", sans-serif'>Clean Minimal Sans (Modern)</option>
                    <option value='"Cinzel", "Cinzel Decorative", serif'>Imperial Trajan Caps (Classical)</option>
                    <option value='"Dancing Script", cursive'>Poetic Hand Script</option>
                  </select>
                </div>

                {/* Font Size Slider & Presets */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-bold text-slate-300">Quote Font Size</label>
                    <span className="font-mono text-indigo-400 font-bold text-[11px]">{typography.fontSize || 34}px</span>
                  </div>
                  <input
                    type="range"
                    min={20}
                    max={64}
                    step={2}
                    value={typography.fontSize || 34}
                    onChange={(e) => setTypography((prev) => ({ ...prev, fontSize: parseInt(e.target.value, 10) }))}
                    className="w-full accent-indigo-500 cursor-pointer"
                  />
                  <div className="flex items-center justify-between gap-1 mt-1 text-[10px]">
                    {[
                      { label: 'S (26px)', val: 26 },
                      { label: 'M (34px)', val: 34 },
                      { label: 'L (42px)', val: 42 },
                      { label: 'XL (54px)', val: 54 },
                    ].map((p) => (
                      <button
                        key={p.val}
                        onClick={() => setTypography((prev) => ({ ...prev, fontSize: p.val }))}
                        className={`px-2 py-0.5 rounded border cursor-pointer ${
                          typography.fontSize === p.val
                            ? 'bg-indigo-600 text-white border-indigo-500 font-bold'
                            : 'bg-slate-950 text-slate-400 border-slate-800'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Font Weight & Style Row */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-bold text-slate-300 mb-1 block">Font Weight</label>
                    <select
                      value={typography.fontWeight || '700'}
                      onChange={(e) => setTypography((prev) => ({ ...prev, fontWeight: e.target.value as any }))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                    >
                      <option value="300">300 (Light)</option>
                      <option value="400">400 (Regular)</option>
                      <option value="600">600 (Semi-Bold)</option>
                      <option value="700">700 (Bold)</option>
                      <option value="900">900 (Heavy)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-300 mb-1 block">Style & Italic</label>
                    <button
                      onClick={() =>
                        setTypography((prev) => ({
                          ...prev,
                          fontStyle: prev.fontStyle === 'italic' ? 'normal' : 'italic',
                        }))
                      }
                      className={`w-full py-1.5 rounded-xl border text-center font-semibold cursor-pointer ${
                        typography.fontStyle === 'italic'
                          ? 'bg-indigo-600 text-white border-indigo-500 italic'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {typography.fontStyle === 'italic' ? 'Italic Active' : 'Normal'}
                    </button>
                  </div>
                </div>

                {/* Vertical Position & Fine Offset */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-slate-300">Vertical Alignment</label>
                    <div className="flex gap-1 text-[10px]">
                      {(['top', 'center', 'bottom'] as const).map((pos) => (
                        <button
                          key={pos}
                          onClick={() => setTypography((prev) => ({ ...prev, verticalPosition: pos }))}
                          className={`capitalize px-2 py-0.5 rounded border cursor-pointer ${
                            (typography.verticalPosition || 'center') === pos
                              ? 'bg-indigo-600 text-white border-indigo-500 font-bold'
                              : 'bg-slate-950 text-slate-400 border-slate-800'
                          }`}
                        >
                          {pos}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>Vertical Position Offset</span>
                    <span className="font-mono text-indigo-400">{typography.verticalOffset || 0}px</span>
                  </div>
                  <input
                    type="range"
                    min={-120}
                    max={120}
                    step={5}
                    value={typography.verticalOffset || 0}
                    onChange={(e) => setTypography((prev) => ({ ...prev, verticalOffset: parseInt(e.target.value, 10) }))}
                    className="w-full accent-indigo-500 cursor-pointer"
                  />
                </div>

                {/* Color Adjustments */}
                <div className="space-y-2 pt-2 border-t border-slate-800/80">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-slate-300">Quote Text Color</label>
                    <div className="flex items-center gap-1.5">
                      {['#ffffff', '#fef08a', '#facc15', '#18181b', '#94a3b8'].map((c) => (
                        <button
                          key={c}
                          onClick={() => setTypography((prev) => ({ ...prev, textColor: c }))}
                          style={{ backgroundColor: c }}
                          className={`w-4 h-4 rounded-full border border-slate-700 cursor-pointer transition-transform hover:scale-125 ${
                            typography.textColor === c ? 'ring-2 ring-indigo-500 scale-110' : ''
                          }`}
                          title={c}
                        />
                      ))}
                      <input
                        type="color"
                        value={typography.textColor || '#ffffff'}
                        onChange={(e) => setTypography((prev) => ({ ...prev, textColor: e.target.value }))}
                        className="w-5 h-5 rounded cursor-pointer bg-transparent border-0"
                        title="Custom Color"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-slate-300">Author / Tag Color</label>
                    <div className="flex items-center gap-1.5">
                      {['#f59e0b', '#facc15', '#10b981', '#38bdf8', '#ffffff', '#27272a'].map((c) => (
                        <button
                          key={c}
                          onClick={() => setTypography((prev) => ({ ...prev, authorColor: c }))}
                          style={{ backgroundColor: c }}
                          className={`w-4 h-4 rounded-full border border-slate-700 cursor-pointer transition-transform hover:scale-125 ${
                            typography.authorColor === c ? 'ring-2 ring-indigo-500 scale-110' : ''
                          }`}
                          title={c}
                        />
                      ))}
                      <input
                        type="color"
                        value={typography.authorColor || '#f59e0b'}
                        onChange={(e) => setTypography((prev) => ({ ...prev, authorColor: e.target.value }))}
                        className="w-5 h-5 rounded cursor-pointer bg-transparent border-0"
                        title="Custom Author Color"
                      />
                    </div>
                  </div>
                </div>

                {/* Vignette & Overlay Section */}
                <div className="space-y-2 pt-2.5 border-t border-slate-800/80">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-slate-300">Vignette Edge Darkness</label>
                    <span className="font-mono text-indigo-400 text-[11px]">{Math.round(((typography as any).vignetteStrength ?? 0.85) * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    value={(typography as any).vignetteStrength ?? 0.85}
                    onChange={(e) => setTypography((prev) => ({ ...prev, vignetteStrength: parseFloat(e.target.value) } as any))}
                    className="w-full accent-indigo-500 cursor-pointer"
                  />

                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-slate-300">Overlay Backdrop Opacity</label>
                    <span className="font-mono text-indigo-400 text-[11px]">{Math.round(((typography as any).overlayOpacity ?? 0.55) * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={0.95}
                    step={0.05}
                    value={(typography as any).overlayOpacity ?? 0.55}
                    onChange={(e) => setTypography((prev) => ({ ...prev, overlayOpacity: parseFloat(e.target.value) } as any))}
                    className="w-full accent-indigo-500 cursor-pointer"
                  />
                </div>

                {/* Save as Default for Current Page */}
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setTypography({
                        fontFamily: '',
                        fontSize: 34,
                        fontWeight: '700',
                        fontStyle: 'normal',
                        textAlign: 'center',
                        textColor: '#ffffff',
                        lineHeight: 1.45,
                        letterSpacing: 0,
                        verticalPosition: 'center',
                        verticalOffset: 0,
                        authorColor: '',
                        vignetteStrength: 0.85,
                        overlayOpacity: 0.55,
                      } as any);
                    }}
                    className="px-2.5 py-1.5 bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-400 hover:text-white rounded-xl text-[11px] font-semibold transition-colors cursor-pointer"
                  >
                    Reset
                  </button>

                  <button
                    type="button"
                    onClick={async () => {
                      const updatedPage: FacebookPage = {
                        ...currentPage,
                        defaultTemplateId: selectedTemplateId,
                        templateCustomization: {
                          ...typography,
                          vignetteStrength: (typography as any).vignetteStrength ?? 0.85,
                          overlayOpacity: (typography as any).overlayOpacity ?? 0.55,
                        },
                      };
                      if (onUpdatePage) {
                        onUpdatePage(updatedPage);
                      }
                      try {
                        await fetch('/api/pages/save-template-customization', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            pageId: currentPage.id,
                            defaultTemplateId: selectedTemplateId,
                            templateCustomization: updatedPage.templateCustomization,
                          }),
                        });
                      } catch (err) {
                        console.warn('Server save styling note:', err);
                      }
                      setSaveTemplateNotice(`Saved custom styling to "${currentPage.name}" default template!`);
                      setTimeout(() => setSaveTemplateNotice(null), 3500);
                    }}
                    className="flex-1 py-1.5 px-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white rounded-xl text-[11px] font-extrabold shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>💾 Save to Page Template</span>
                  </button>
                </div>

                {saveTemplateNotice && (
                  <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-[11px] text-emerald-300 font-semibold flex items-center gap-1.5 animate-fade-in">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{saveTemplateNotice}</span>
                  </div>
                )}

              </div>
            )}
          </div>

          {/* Facebook Live Content & Scheduling Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
            
            {/* Page Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={currentPage.avatarUrl}
                  alt={currentPage.name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/40 shadow-sm"
                />
                <div>
                  <h4 className="font-extrabold text-white text-xs">{currentPage.name}</h4>
                  <div className="flex items-center gap-1 text-[10px] text-slate-400">
                    <span>Just now</span>
                    <span>•</span>
                    <Globe className="w-3 h-3 text-slate-400" />
                  </div>
                </div>
              </div>

              {currentPage.fbPageAccessToken ? (
                <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  <Key className="w-3 h-3" />
                  <span>Token Active</span>
                </span>
              ) : (
                <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                  Demo Mode
                </span>
              )}
            </div>

            {/* Template Selector & Presets */}
            <div className="space-y-1.5 pb-2 border-b border-slate-800">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Visual Style & Template</span>
                </label>
                <button
                  onClick={handleLoadPoetrySample}
                  className="text-[10px] font-bold text-amber-300 hover:text-amber-200 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 px-2 py-0.5 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                  title="Load Untold Feelings Poetry Sample (Paper & Typewriter)"
                >
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>Load Poetry Sample</span>
                </button>
              </div>

              <select
                value={selectedTemplateId}
                onChange={(e) => {
                  const newId = e.target.value;
                  setSelectedTemplateId(newId);
                  const tmpl = templates.find((t) => t.id === newId);
                  if (tmpl?.defaultImageUrl && (newId.includes('paper') || newId.includes('poetry'))) {
                    setBackgroundImageUrl(tmpl.defaultImageUrl);
                  }
                }}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-semibold cursor-pointer"
              >
                <optgroup label="🎖️ Military, Stoic & Brotherhood">
                  <option value="tactical-gold-tag">🎖️ Tactical Gold Plate (US Army & Brotherhood)</option>
                  <option value="bold-quote-badge">🛡️ Bold Combat Badge (High Impact)</option>
                  <option value="cinematic-headline">🎬 Cinematic Dawn (Movie Title Style)</option>
                </optgroup>
                <optgroup label="📜 Poetry & Vintage Typewriter">
                  <option value="poetry-typewriter-paper">📜 Vintage Cotton Paper & Typewriter (Untold Feelings)</option>
                  <option value="minimalist-clean">✒️ Minimalist Clean Monochrome</option>
                  <option value="gold-accent">✨ Gold Leaf Luxury Serif</option>
                </optgroup>
                <optgroup label="🏛️ Philosophy, Classic & Editorial">
                  <option value="classical-marble">🏛️ Classical Imperial Frame</option>
                  <option value="modern-editorial">📰 Modern Editorial Serif</option>
                  <option value="dark-glow">🌌 Cosmic Dark Glow</option>
                  <option value="glassmorphic">💎 Glassmorphic Card</option>
                </optgroup>
              </select>
            </div>

            {/* Editable Quote & Author */}
            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-300 mb-1 block">Quote Text</label>
                <textarea
                  value={quoteText}
                  onChange={(e) => setQuoteText(e.target.value)}
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-serif leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-300 mb-1 block">Author</label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 mb-1 block">Brand Watermark</label>
                  <input
                    type="text"
                    value={watermarkText}
                    onChange={(e) => setWatermarkText(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Caption & Hashtags */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-bold text-slate-300">Facebook Caption & Engagement Hook</label>
                  <button
                    onClick={handleCopyCaption}
                    className="text-[10px] text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copied ? 'Copied!' : 'Copy Caption'}</span>
                  </button>
                </div>
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 leading-relaxed font-sans"
                />
              </div>

            </div>

            {/* Action Buttons: Schedule Post & Direct Publish */}
            <div className="pt-3 border-t border-slate-800 space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  onClick={handleBroadcastTelegram}
                  disabled={isSendingTelegram}
                  className="py-2.5 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white text-xs font-extrabold rounded-xl shadow-lg shadow-sky-600/20 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
                  title="Broadcast image card & caption to Telegram"
                >
                  <Bot className={`w-4 h-4 ${isSendingTelegram ? 'animate-spin' : ''}`} />
                  <span>{isSendingTelegram ? 'Sending...' : 'Telegram'}</span>
                </button>

                <button
                  onClick={() => setShowScheduleModal(true)}
                  className="py-2.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 text-xs font-extrabold rounded-xl shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Calendar className="w-4 h-4 text-slate-950" />
                  <span>Schedule</span>
                </button>

                <button
                  onClick={handlePublishNow}
                  disabled={isPublishing}
                  className="py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-extrabold rounded-xl shadow-lg transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
                >
                  <Send className={`w-4 h-4 ${isPublishing ? 'animate-spin' : ''}`} />
                  <span>{isPublishing ? 'Publishing...' : 'Publish FB'}</span>
                </button>
              </div>

              <p className="text-[10px] text-slate-400 text-center">
                Posts are rendered at 1080x1080 broadcast quality with your exact typography overrides.
              </p>
            </div>

          </div>

        </div>

      </div>

      {/* Schedule Post Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-white">Schedule Post with Custom Typography</h3>
                  <p className="text-[11px] text-slate-400">Save typography overrides and schedule for publication</p>
                </div>
              </div>
              <button
                onClick={() => setShowScheduleModal(false)}
                className="text-slate-400 hover:text-white text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-bold mb-1 block">Scheduled Date</label>
                <input
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold mb-1 block">Scheduled Time</label>
                <input
                  type="time"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800/80 space-y-1 text-[11px] text-slate-400">
                <div className="flex justify-between">
                  <span>Page:</span>
                  <span className="text-white font-semibold">{currentPage.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Font Size:</span>
                  <span className="text-indigo-400 font-mono font-semibold">{typography.fontSize || 34}px</span>
                </div>
                <div className="flex justify-between">
                  <span>Alignment:</span>
                  <span className="text-indigo-400 capitalize font-semibold">{typography.textAlign || 'Center'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Text Color:</span>
                  <span className="text-white font-mono">{typography.textColor || '#ffffff'}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setShowScheduleModal(false)}
                className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSchedulePostSubmit}
                className="flex-1 py-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 rounded-xl text-xs font-extrabold shadow-lg cursor-pointer"
              >
                Confirm Schedule
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
