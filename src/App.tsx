import React, { useState, useEffect } from 'react';
import { FacebookPage, QuoteTemplate, ScheduledPost } from './types';
import {
  getStoredPages,
  savePages,
  getStoredTemplates,
  saveTemplates,
  getStoredScheduledPosts,
  saveScheduledPosts,
  clearAllScheduledPosts,
  syncWithServerState,
  recordUsedSignature,
} from './utils/storage';
import { Navbar } from './components/Navbar';
import { PageManagerView } from './components/PageManagerView';
import { ScheduleCalendar } from './components/ScheduleCalendar';
import { CanvasStudio } from './components/CanvasStudio';
import { FacebookFeedPreview } from './components/FacebookFeedPreview';
import { StackVerificationModal } from './components/StackVerificationModal';
import { TelegramBotHubModal } from './components/TelegramBotHubModal';

export default function App() {
  // Core State
  const [pages, setPages] = useState<FacebookPage[]>(() => getStoredPages());
  const [activePageId, setActivePageId] = useState<string>(() => {
    const loaded = getStoredPages();
    return loaded[0]?.id || 'page-army-brotherhood';
  });
  const [templates, setTemplates] = useState<QuoteTemplate[]>(() => getStoredTemplates());
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>(() => getStoredScheduledPosts());
  const [isStackModalOpen, setIsStackModalOpen] = useState<boolean>(false);
  const [isTelegramModalOpen, setIsTelegramModalOpen] = useState<boolean>(false);

  // Navigation (3 streamlined tabs)
  const [activeTab, setActiveTab] = useState<'pages' | 'scheduler' | 'studio'>('pages');

  // Selected post for Live Studio / Preview
  const [studioSelectedPost, setStudioSelectedPost] = useState<ScheduledPost | null>(null);

  // Feed preview modal state
  const [feedPreviewData, setFeedPreviewData] = useState<{
    isOpen: boolean;
    imageUrl: string;
    caption: string;
    hashtags: string[];
    hookLine?: string;
    firstComment?: string;
  }>({
    isOpen: false,
    imageUrl: '',
    caption: '',
    hashtags: [],
  });

  // Current Active Page object
  const activePage = pages.find((p) => p.id === activePageId) || pages[0];

  // Initial Sync with Server File Store on Mount
  useEffect(() => {
    syncWithServerState().then((synced) => {
      if (synced) {
        const freshPages = getStoredPages();
        const freshPosts = getStoredScheduledPosts();
        setPages(freshPages);
        setScheduledPosts(freshPosts);
      }
    });
  }, []);

  // Save states to storage
  useEffect(() => {
    savePages(pages);
  }, [pages]);

  useEffect(() => {
    saveTemplates(templates);
  }, [templates]);

  useEffect(() => {
    saveScheduledPosts(scheduledPosts);
  }, [scheduledPosts]);

  // Global feedback toast
  const [toastNotice, setToastNotice] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success', duration = 4000) => {
    setToastNotice({ message, type });
    setTimeout(() => {
      setToastNotice(null);
    }, duration);
  };

  // Handler: Schedule post
  const handleSchedulePost = (post: ScheduledPost) => {
    setScheduledPosts((prev) => [post, ...prev]);
    showToast('Post added to publishing queue!', 'success');
  };

  // Handler: Publish post immediately
  const handlePublishNow = async (id: string) => {
    const post = scheduledPosts.find((p) => p.id === id);
    if (!post) return;
    const page = pages.find((p) => p.id === post.pageId) || activePage;

    showToast(`Publishing post to ${page.name}...`, 'info', 2000);

    try {
      const res = await fetch('/api/facebook/publish-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pageId: page.fbPageId || page.id,
          accessToken: page.fbPageAccessToken || '',
          postId: post.id,
          quoteText: post.quoteText,
          author: post.author,
          caption: post.caption,
          hashtags: post.hashtags,
          templateId: post.templateId,
          imageUrl: post.renderedImageUrl || post.rawImageUrl,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`Successfully published to ${page.name}! (FB Post ID: ${data.postId})`, 'success', 5000);
        setScheduledPosts((prev) =>
          prev.map((p) =>
            p.id === id
              ? {
                  ...p,
                  status: 'published',
                  publishedAt: new Date().toISOString(),
                  fbPostId: data.postId,
                  metrics: {
                    likes: Math.floor(Math.random() * 320) + 40,
                    comments: Math.floor(Math.random() * 35) + 5,
                    shares: Math.floor(Math.random() * 20) + 2,
                    reach: Math.floor(Math.random() * 3500) + 900,
                  },
                }
              : p
          )
        );
      } else {
        showToast(`Facebook Error: ${data.error || 'Token expired or invalid'}`, 'error', 6000);
      }
    } catch (e: any) {
      showToast(`Publishing Notice: ${e?.message || 'Check connection'}`, 'error', 5000);
    }
  };

  // Handler: Delete scheduled post
  const handleDeletePost = (id: string) => {
    setScheduledPosts((prev) => {
      const remaining = prev.filter((p) => p.id !== id);
      saveScheduledPosts(remaining);
      return remaining;
    });
    clearAllScheduledPosts({ postIds: [id] }).catch(() => {});
  };

  // Handler: Bulk Delete queues / posts
  const handleBulkDeleteQueue = async (options?: { pageId?: string; status?: string; postIds?: string[] }) => {
    try {
      const result = await clearAllScheduledPosts(options);
      if (result.success) {
        if (Array.isArray(result.scheduledPosts)) {
          setScheduledPosts(result.scheduledPosts);
          saveScheduledPosts(result.scheduledPosts);
        } else if (options?.postIds && options.postIds.length > 0) {
          const idSet = new Set(options.postIds);
          setScheduledPosts((prev) => {
            const updated = prev.filter((p) => !idSet.has(p.id));
            saveScheduledPosts(updated);
            return updated;
          });
        } else {
          setScheduledPosts((prev) => {
            const updated = prev.filter((p) => {
              const matchesPage = !options?.pageId || options.pageId === 'all' || p.pageId === options.pageId;
              const matchesStatus = !options?.status || options.status === 'all' || p.status === options.status;
              return !(matchesPage && matchesStatus);
            });
            saveScheduledPosts(updated);
            return updated;
          });
        }
        showToast(`Successfully deleted ${result.deletedCount} items from queue!`, 'success');
      } else {
        showToast('Notice: Could not clear queue. Please try again.', 'error');
      }
    } catch (e: any) {
      showToast(`Error clearing queue: ${e?.message || 'Network error'}`, 'error');
    }
  };

  // Handler: Open Feed Preview modal
  const handleOpenFeedPreview = (
    imageUrl: string,
    caption: string,
    hashtags: string[],
    hookLine?: string,
    firstComment?: string
  ) => {
    setFeedPreviewData({
      isOpen: true,
      imageUrl,
      caption,
      hashtags,
      hookLine,
      firstComment,
    });
  };

  // Handler: Select post from queue to open directly in Studio
  const handleSelectPostForStudio = (post: ScheduledPost) => {
    setStudioSelectedPost(post);
    setActivePageId(post.pageId);
    setActiveTab('studio');
  };

  // Handler: Navigate to Studio for a specific page
  const handleNavigateToPreviewForPage = (pageId: string) => {
    setActivePageId(pageId);
    const postForPage = scheduledPosts.find((p) => p.pageId === pageId && p.status === 'scheduled');
    setStudioSelectedPost(postForPage || null);
    setActiveTab('studio');
  };

  // Handler: Add new page
  const handleAddPage = (newPage: FacebookPage) => {
    setPages((prev) => [...prev, newPage]);
    setActivePageId(newPage.id);
  };

  // Handler: Update page
  const handleUpdatePage = (updatedPage: FacebookPage) => {
    setPages((prev) => prev.map((p) => (p.id === updatedPage.id ? updatedPage : p)));
  };

  // Handler: Delete page
  const handleDeletePage = (id: string) => {
    setPages((prev) => {
      const remaining = prev.filter((p) => p.id !== id);
      savePages(remaining);
      return remaining;
    });

    setScheduledPosts((prev) => {
      const remaining = prev.filter((p) => p.pageId !== id);
      saveScheduledPosts(remaining);
      return remaining;
    });

    if (activePageId === id) {
      const remainingPages = pages.filter((p) => p.id !== id);
      if (remainingPages.length > 0) {
        setActivePageId(remainingPages[0].id);
        localStorage.setItem('active_page_id', remainingPages[0].id);
      }
    }

    showToast('Facebook page and associated queue removed successfully.', 'success', 3000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* Streamlined Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pages={pages}
        activePage={activePage}
        onSelectPage={(id) => setActivePageId(id)}
        onOpenNewPageModal={() => setActiveTab('pages')}
        onOpenStackVerification={() => setIsStackModalOpen(true)}
        onOpenTelegramHub={() => setIsTelegramModalOpen(true)}
      />

      {/* Global Toast Notification Banner */}
      {toastNotice && (
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-3">
          <div
            className={`p-3.5 rounded-xl border text-xs font-semibold flex items-center justify-between shadow-lg transition-all animate-fadeIn ${
              toastNotice.type === 'success'
                ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300'
                : toastNotice.type === 'error'
                ? 'bg-rose-950/80 border-rose-500/40 text-rose-300'
                : 'bg-indigo-950/80 border-indigo-500/40 text-indigo-300'
            }`}
          >
            <span>{toastNotice.message}</span>
            <button
              onClick={() => setToastNotice(null)}
              className="ml-3 px-2 py-0.5 rounded bg-black/30 hover:bg-black/50 text-[11px]"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Main Streamlined App View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* TAB 1: AutoPilot Pages Hub */}
        {activeTab === 'pages' && (
          <PageManagerView
            pages={pages}
            activePage={activePage}
            templates={templates}
            scheduledPosts={scheduledPosts}
            onSelectPage={(id) => setActivePageId(id)}
            onAddPage={handleAddPage}
            onUpdatePage={handleUpdatePage}
            onDeletePage={handleDeletePage}
            onNavigateToPreview={handleNavigateToPreviewForPage}
            onOpenTelegramHub={() => setIsTelegramModalOpen(true)}
            onBulkDeleteQueue={handleBulkDeleteQueue}
          />
        )}

        {/* TAB 2: 7-Day Scheduled Queue */}
        {activeTab === 'scheduler' && (
          <ScheduleCalendar
            scheduledPosts={scheduledPosts}
            pages={pages}
            activePage={activePage}
            onPublishNow={handlePublishNow}
            onDeletePost={handleDeletePost}
            onBulkDeleteQueue={handleBulkDeleteQueue}
            onOpenFeedPreview={handleOpenFeedPreview}
            onSelectPostForStudio={handleSelectPostForStudio}
            onUpdateScheduledPosts={(newPosts) => {
              setScheduledPosts(newPosts);
              saveScheduledPosts(newPosts);
            }}
          />
        )}

        {/* TAB 3: Post Preview & Direct Publish */}
        {activeTab === 'studio' && (
          <CanvasStudio
            activePage={activePage}
            pages={pages}
            templates={templates}
            onSchedulePost={handleSchedulePost}
            onOpenFeedPreview={handleOpenFeedPreview}
            onUpdatePage={handleUpdatePage}
            initialPost={studioSelectedPost}
          />
        )}

      </main>

      {/* Facebook Feed Preview Modal */}
      <FacebookFeedPreview
        isOpen={feedPreviewData.isOpen}
        onClose={() => setFeedPreviewData((prev) => ({ ...prev, isOpen: false }))}
        page={activePage}
        imageUrl={feedPreviewData.imageUrl}
        caption={feedPreviewData.caption}
        hashtags={feedPreviewData.hashtags}
        hookLine={feedPreviewData.hookLine}
        firstComment={feedPreviewData.firstComment}
      />

      {/* Stack Responsibilities & Artifacts Verification Modal */}
      <StackVerificationModal
        isOpen={isStackModalOpen}
        onClose={() => setIsStackModalOpen(false)}
      />

      {/* Telegram Bot Hub Modal */}
      <TelegramBotHubModal
        isOpen={isTelegramModalOpen}
        onClose={() => setIsTelegramModalOpen(false)}
        pages={pages}
      />
    </div>
  );
}
