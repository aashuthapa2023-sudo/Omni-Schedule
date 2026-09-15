import React, { useState } from 'react';
import { FacebookPage } from '../types';
import { ThumbsUp, MessageCircle, Share2, Globe, MoreHorizontal, CheckCircle2, Bookmark, X, Pin, Sparkles, Zap } from 'lucide-react';

interface FacebookFeedPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  page: FacebookPage;
  imageUrl: string;
  caption: string;
  hashtags?: string[];
  quoteText?: string;
  author?: string;
  hookLine?: string;
  firstComment?: string;
}

export const FacebookFeedPreview: React.FC<FacebookFeedPreviewProps> = ({
  isOpen,
  onClose,
  page,
  imageUrl,
  caption,
  hashtags = [],
  quoteText,
  author,
  hookLine,
  firstComment,
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(284);
  const [isExpanded, setIsExpanded] = useState(false);

  if (!isOpen) return null;

  const toggleLike = () => {
    if (isLiked) {
      setLikeCount(likeCount - 1);
      setIsLiked(false);
    } else {
      setLikeCount(likeCount + 1);
      setIsLiked(true);
    }
  };

  const formattedCaption = caption || 'No caption entered yet...';
  const shouldTruncate = formattedCaption.length > 240 && !isExpanded;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-6">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-slate-900/95 sticky top-0 z-10 backdrop-blur">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#1877F2] flex items-center justify-center text-white font-bold text-lg shadow-sm">
              f
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white flex items-center gap-1.5">
                Facebook Feed Viral Preview
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Niche Optimized
                </span>
              </h3>
              <p className="text-xs text-slate-400">Live feed simulation for {page.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Facebook Feed Card Body */}
        <div className="p-4 bg-slate-950 max-h-[75vh] overflow-y-auto space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
            {/* Post Header */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={page.avatarUrl}
                    alt={page.name}
                    className="w-11 h-11 rounded-full object-cover ring-2 ring-blue-500/40"
                  />
                  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-900 rounded-full" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-white text-sm hover:underline cursor-pointer">
                      {page.name}
                    </span>
                    <CheckCircle2 className="w-4 h-4 text-blue-400 fill-blue-400/20" />
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <span>Just now</span>
                    <span>•</span>
                    <Globe className="w-3 h-3 text-slate-400" />
                    <span>•</span>
                    <span className="text-indigo-400 font-medium">{page.niche}</span>
                  </div>
                </div>
              </div>
              <button className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>

            {/* Scroll-stopping Viral Hook Line */}
            {hookLine && (
              <div className="px-4 pb-2">
                <div className="px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs font-semibold flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>{hookLine}</span>
                </div>
              </div>
            )}

            {/* Post Caption Body */}
            <div className="px-4 pb-3 text-sm text-slate-200 whitespace-pre-line leading-relaxed">
              {shouldTruncate ? `${formattedCaption.slice(0, 240)}...` : formattedCaption}
              {formattedCaption.length > 240 && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="ml-1 text-blue-400 font-semibold hover:underline"
                >
                  {isExpanded ? 'See less' : '... See more'}
                </button>
              )}

              {/* Hashtags */}
              {hashtags && hashtags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  {hashtags.map((tag, idx) => (
                    <span key={idx} className="text-blue-400 hover:underline cursor-pointer text-xs font-medium">
                      {tag.startsWith('#') ? tag : `#${tag}`}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Post Image Container */}
            <div className="relative w-full bg-black flex items-center justify-center overflow-hidden">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt="Post preview"
                  className="w-full h-auto max-h-[520px] object-contain"
                />
              ) : (
                <div className="w-full h-72 flex items-center justify-center text-slate-500 text-xs">
                  Render image first in Quote Studio
                </div>
              )}
            </div>

            {/* Engagement Metrics Bar */}
            <div className="px-4 py-2.5 flex items-center justify-between border-b border-slate-800/80 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-[10px] text-white">
                  👍
                </span>
                <span className="w-5 h-5 rounded-full bg-rose-600 -ml-2.5 flex items-center justify-center text-[10px] text-white">
                  ❤️
                </span>
                <span className="ml-1 font-semibold text-slate-300">{likeCount}</span>
              </div>
              <div className="flex items-center gap-3">
                <span>54 comments</span>
                <span>•</span>
                <span>28 shares</span>
              </div>
            </div>

            {/* Interaction Buttons */}
            <div className="px-2 py-1.5 grid grid-cols-3 gap-1 text-xs font-semibold text-slate-300">
              <button
                onClick={toggleLike}
                className={`flex items-center justify-center gap-2 py-2 rounded-lg transition-colors ${
                  isLiked ? 'text-blue-400 bg-blue-500/10' : 'hover:bg-slate-800'
                }`}
              >
                <ThumbsUp className={`w-4 h-4 ${isLiked ? 'fill-blue-400' : ''}`} />
                <span>Like</span>
              </button>
              <button className="flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-slate-800 transition-colors">
                <MessageCircle className="w-4 h-4" />
                <span>Comment</span>
              </button>
              <button className="flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-slate-800 transition-colors">
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>
            </div>
          </div>

          {/* Pinned First Comment Discussion Section */}
          <div className="bg-slate-900 border border-slate-800/90 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-2">
              <span className="font-semibold text-white flex items-center gap-1.5">
                <Pin className="w-3.5 h-3.5 text-amber-400 rotate-45" /> Auto-Pinned First Comment
              </span>
              <span className="text-[10px] text-emerald-400 font-medium">Algorithmic Boost Active</span>
            </div>

            <div className="flex items-start gap-2.5 pt-1">
              <img
                src={page.avatarUrl}
                alt={page.name}
                className="w-7 h-7 rounded-full object-cover border border-slate-700 mt-0.5"
              />
              <div className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl px-3.5 py-2.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white">{page.name}</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 font-semibold">Author</span>
                </div>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {firstComment || `What are your thoughts on this perspective? Drop your reflection below and tag someone who needs this today 👇`}
                </p>
                <div className="flex items-center gap-3 text-[10px] text-slate-500 font-semibold mt-1.5">
                  <span className="hover:underline cursor-pointer text-slate-400">Like</span>
                  <span className="hover:underline cursor-pointer text-slate-400">Reply</span>
                  <span>Just now</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="px-5 py-3 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <Bookmark className="w-3.5 h-3.5 text-blue-400" />
            <span>Target Page: <strong className="text-white">{page.handle}</strong></span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow transition-colors"
          >
            Done Previewing
          </button>
        </div>
      </div>
    </div>
  );
};
