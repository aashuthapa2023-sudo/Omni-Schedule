import React, { useState, useEffect } from 'react';
import {
  Send,
  Bot,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  MessageSquare,
  Shield,
  Bell,
  ExternalLink,
  Zap,
  Check,
  Radio,
  Sliders,
  Sparkles,
  Search,
  User,
  Users,
  Megaphone,
  HelpCircle,
  Copy,
} from 'lucide-react';
import { TelegramConfig } from '../types';
import { getTelegramConfig, saveTelegramConfig } from '../utils/storage';

interface TelegramBotHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeQuoteCardUrl?: string;
  activeCaption?: string;
}

interface DetectedChat {
  id: string;
  title: string;
  type: 'private' | 'channel' | 'group' | 'supergroup';
  username?: string;
  lastSeen?: string;
  lastMessageText?: string;
}

export const TelegramBotHubModal: React.FC<TelegramBotHubModalProps> = ({
  isOpen,
  onClose,
  activeQuoteCardUrl,
  activeCaption,
}) => {
  const [config, setConfig] = useState<TelegramConfig>(getTelegramConfig());
  const [isLoading, setIsLoading] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message?: string; error?: string } | null>(null);
  const [botInfo, setBotInfo] = useState<{ id?: number; first_name?: string; username?: string } | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  
  // Auto-Detect state
  const [isDetectingChats, setIsDetectingChats] = useState(false);
  const [detectedChats, setDetectedChats] = useState<DetectedChat[]>([]);
  const [detectHelp, setDetectHelp] = useState<string | null>(null);
  const [showTroubleshooter, setShowTroubleshooter] = useState(false);

  // Custom Broadcast state
  const [broadcastMessage, setBroadcastMessage] = useState(activeCaption || '');
  const [isSendingBroadcast, setIsSendingBroadcast] = useState(false);
  const [broadcastStatus, setBroadcastStatus] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    if (isOpen) {
      const stored = getTelegramConfig();
      setConfig(stored);
      checkBotStatus(stored.botToken);
      if (activeCaption) {
        setBroadcastMessage(activeCaption);
      }
    }
  }, [isOpen, activeCaption]);

  const checkBotStatus = async (token: string) => {
    if (!token || token.trim().length < 10) {
      setIsConnected(false);
      setBotInfo(null);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/telegram/status');
      if (res.ok) {
        const data = await res.json();
        setIsConnected(data.isConnected);
        setBotInfo(data.botInfo);
      }
    } catch {
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDetectChatId = async () => {
    if (!config.botToken.trim()) {
      setTestResult({
        success: false,
        error: 'Please enter your Telegram Bot Token first to detect chats.',
      });
      return;
    }

    setIsDetectingChats(true);
    setDetectHelp(null);
    try {
      const res = await fetch('/api/telegram/detect-chat-id', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ botToken: config.botToken }),
      });

      const data = await res.json();
      if (data.success) {
        setDetectedChats(data.detectedChats || []);
        setDetectHelp(data.helpMessage || null);
        if (data.botUsername && !botInfo) {
          setBotInfo({ username: data.botUsername });
        }
        if (data.detectedChats?.length === 0) {
          setShowTroubleshooter(true);
        }
      } else {
        setDetectHelp(data.error || 'Could not query Telegram updates.');
        setShowTroubleshooter(true);
      }
    } catch (err: any) {
      setDetectHelp(err?.message || 'Failed to detect Telegram chats.');
    } finally {
      setIsDetectingChats(false);
    }
  };

  const handleSelectDetectedChat = (chat: DetectedChat) => {
    const updated = { ...config, chatId: chat.id };
    setConfig(updated);
    saveTelegramConfig(updated);
    setTestResult({
      success: true,
      message: `Selected "${chat.title}" (${chat.id}). Click "Send Live Test Ping" to verify!`,
    });
  };

  const handleSaveConfig = async () => {
    setIsLoading(true);
    try {
      saveTelegramConfig(config);
      await fetch('/api/telegram/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      await checkBotStatus(config.botToken);
      setTestResult({ success: true, message: 'Telegram configuration saved successfully.' });
    } catch (err: any) {
      setTestResult({ success: false, error: err?.message || 'Failed to save configuration.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestConnection = async () => {
    if (!config.botToken.trim() || !config.chatId.trim()) {
      setTestResult({
        success: false,
        error: 'Please enter both Bot Token and Chat ID before testing.',
      });
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    try {
      const res = await fetch('/api/telegram/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          botToken: config.botToken,
          chatId: config.chatId,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setTestResult({
          success: true,
          message: data.message || 'Live test message delivered to your Telegram chat successfully!',
        });
        setIsConnected(true);
        saveTelegramConfig({ ...config, enabled: true, lastTestedAt: new Date().toISOString() });
        checkBotStatus(config.botToken);
        setShowTroubleshooter(false);
      } else {
        setTestResult({
          success: false,
          error: data.error || 'Telegram rejected the test message.',
        });
        setShowTroubleshooter(true);
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        error: err?.message || 'Network exception occurred during test.',
      });
      setShowTroubleshooter(true);
    } finally {
      setIsTesting(false);
    }
  };

  const handleSendBroadcast = async () => {
    if (!config.botToken.trim() || !config.chatId.trim()) {
      setBroadcastStatus({
        success: false,
        message: 'Please configure and verify your Telegram Bot Token & Chat ID first.',
      });
      return;
    }

    setIsSendingBroadcast(true);
    setBroadcastStatus(null);

    try {
      const res = await fetch('/api/telegram/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: broadcastMessage,
          photoUrl: activeQuoteCardUrl,
          chatId: config.chatId,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setBroadcastStatus({
          success: true,
          message: 'Quote card and caption successfully broadcasted to your Telegram channel!',
        });
      } else {
        setBroadcastStatus({
          success: false,
          message: data.error || 'Failed to broadcast message to Telegram.',
        });
      }
    } catch (err: any) {
      setBroadcastStatus({
        success: false,
        message: err?.message || 'Broadcast network exception.',
      });
    } finally {
      setIsSendingBroadcast(false);
    }
  };

  if (!isOpen) return null;

  const botUsername = botInfo?.username || '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col my-8 max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-800 bg-zinc-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                Telegram Bot Hub & Broadcast Hub
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 font-semibold border border-sky-500/30">
                  Live Dispatch
                </span>
              </h2>
              <p className="text-xs text-zinc-400">
                Automate real-time alerts on Facebook posts, 24/7 quote generation, and instant channel broadcasts.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm">
          {/* Connection Status Banner */}
          <div className={`p-4 rounded-xl border flex items-center justify-between ${
            isConnected
              ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-300'
              : 'bg-zinc-900/80 border-zinc-800 text-zinc-300'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-600'}`} />
              <div>
                <div className="font-semibold flex items-center gap-2">
                  {isConnected ? (
                    <>
                      Connected to Bot: @{botInfo?.username || 'Verified Bot'}
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    </>
                  ) : (
                    <>Bot Disconnected / Standby</>
                  )}
                </div>
                <div className="text-xs text-zinc-400">
                  {isConnected
                    ? `Ready for automated alerts to Chat ID: ${config.chatId || 'Configured'}`
                    : 'Enter your Telegram Bot Token & Chat ID below to link your channel.'}
                </div>
              </div>
            </div>
            <button
              onClick={() => checkBotStatus(config.botToken)}
              disabled={isLoading}
              className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-zinc-300 flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>

          {/* Configuration Form */}
          <div className="bg-zinc-900/40 p-5 rounded-xl border border-zinc-800/80 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-sky-400" />
                Bot Credentials & Channel Target
              </h3>
              <button
                type="button"
                onClick={handleDetectChatId}
                disabled={isDetectingChats || !config.botToken.trim()}
                className="px-3 py-1.5 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <Search className={`w-3.5 h-3.5 ${isDetectingChats ? 'animate-spin' : ''}`} />
                {isDetectingChats ? 'Detecting...' : 'Auto-Detect My Chat ID'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Telegram Bot Token <span className="text-rose-400">*</span>
                </label>
                <input
                  type="password"
                  placeholder="e.g. 718293849:AAHq_..."
                  value={config.botToken}
                  onChange={(e) => setConfig({ ...config, botToken: e.target.value.trim() })}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-950 border border-zinc-700/80 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-sky-500 text-xs font-mono"
                />
                <span className="text-[11px] text-zinc-500 mt-1 block">
                  Created via <a href="https://t.me/BotFather" target="_blank" rel="noreferrer" className="text-sky-400 hover:underline inline-flex items-center gap-0.5">@BotFather <ExternalLink className="w-3 h-3" /></a>
                </span>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Target Chat / Channel ID <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. -1001234567890 or @channelname"
                  value={config.chatId}
                  onChange={(e) => setConfig({ ...config, chatId: e.target.value.trim() })}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-950 border border-zinc-700/80 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-sky-500 text-xs font-mono"
                />
                <span className="text-[11px] text-zinc-500 mt-1 block">
                  Your numeric ID (e.g. 123456789) or public channel <span className="text-zinc-300 font-mono">@ChannelName</span>
                </span>
              </div>
            </div>

            {/* Detected Chats Quick Select */}
            {detectedChats.length > 0 && (
              <div className="p-3.5 rounded-xl bg-sky-950/20 border border-sky-800/40 space-y-2">
                <div className="text-xs font-semibold text-sky-300 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                    Auto-Detected Telegram Chats ({detectedChats.length}):
                  </span>
                  <span className="text-[10px] text-zinc-400">Click any chat below to select</span>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {detectedChats.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => handleSelectDetectedChat(c)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-all ${
                        config.chatId === c.id
                          ? 'bg-sky-500 text-white border-sky-400 shadow-md'
                          : 'bg-zinc-900/90 text-zinc-300 border-zinc-700 hover:border-sky-500/60 hover:text-white'
                      }`}
                    >
                      {c.type === 'channel' ? <Megaphone className="w-3.5 h-3.5 text-amber-400" /> : c.type === 'group' || c.type === 'supergroup' ? <Users className="w-3.5 h-3.5 text-indigo-400" /> : <User className="w-3.5 h-3.5 text-emerald-400" />}
                      <span className="font-semibold">{c.title}</span>
                      <span className="text-[10px] opacity-75 font-mono">({c.id})</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {detectHelp && (
              <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 flex items-start gap-2">
                <HelpCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="leading-relaxed whitespace-pre-line">{detectHelp}</div>
              </div>
            )}

            {/* Step-by-Step Fix Guide for "Bad Request: chat not found" */}
            {showTroubleshooter && (
              <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-800/40 space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-amber-300">
                  <span className="flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-amber-400" />
                    How to Fix "Bad Request: Chat Not Found"
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowTroubleshooter(false)}
                    className="text-zinc-500 hover:text-zinc-300 text-xs"
                  >
                    Hide
                  </button>
                </div>
                <div className="text-xs text-zinc-300 space-y-2 leading-relaxed">
                  <p className="font-medium text-amber-200">
                    Telegram protects user privacy: A bot cannot message you or a channel until it has been introduced first!
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-1">
                    <div className="p-2.5 rounded-lg bg-zinc-950/80 border border-zinc-800 space-y-1.5">
                      <div className="font-semibold text-sky-400 flex items-center gap-1">
                        <User className="w-3.5 h-3.5" /> 1. Messaging Yourself (Direct)
                      </div>
                      <p className="text-[11px] text-zinc-400">
                        Open your bot in Telegram and tap <b>START</b> or send <code>/start</code> so it is permitted to send you messages.
                      </p>
                      {botUsername && (
                        <a
                          href={`https://t.me/${botUsername.replace('@', '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-sky-600 hover:bg-sky-500 text-white text-[11px] font-medium transition-colors"
                        >
                          <ExternalLink className="w-3 h-3" /> Open @{botUsername.replace('@', '')} on Telegram
                        </a>
                      )}
                    </div>

                    <div className="p-2.5 rounded-lg bg-zinc-950/80 border border-zinc-800 space-y-1.5">
                      <div className="font-semibold text-emerald-400 flex items-center gap-1">
                        <Megaphone className="w-3.5 h-3.5" /> 2. Messaging a Channel
                      </div>
                      <p className="text-[11px] text-zinc-400">
                        Open your Channel Settings &rarr; <b>Administrators</b> &rarr; <b>Add Admin</b> &rarr; Search your bot and grant <b>"Post Messages"</b> permission.
                      </p>
                      <p className="text-[11px] text-zinc-400">
                        Then enter your channel handle like <code>@YourChannelHandle</code> in the Chat ID field.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notification Toggles */}
            <div className="pt-2 border-t border-zinc-800/80 space-y-2.5">
              <div className="text-xs font-medium text-zinc-300 flex items-center gap-1.5 mb-2">
                <Bell className="w-3.5 h-3.5 text-amber-400" />
                Automated 24/7 Notification Triggers:
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <label className="flex items-center gap-2.5 p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-800 cursor-pointer hover:border-zinc-700 transition-colors">
                  <input
                    type="checkbox"
                    checked={config.notifyOnPublish}
                    onChange={(e) => setConfig({ ...config, notifyOnPublish: e.target.checked })}
                    className="rounded border-zinc-700 text-sky-500 focus:ring-sky-500"
                  />
                  <span className="text-xs text-zinc-300">Live Post Published</span>
                </label>

                <label className="flex items-center gap-2.5 p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-800 cursor-pointer hover:border-zinc-700 transition-colors">
                  <input
                    type="checkbox"
                    checked={config.notifyOnSchedule}
                    onChange={(e) => setConfig({ ...config, notifyOnSchedule: e.target.checked })}
                    className="rounded border-zinc-700 text-sky-500 focus:ring-sky-500"
                  />
                  <span className="text-xs text-zinc-300">Queue 7-Day Refilled</span>
                </label>

                <label className="flex items-center gap-2.5 p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-800 cursor-pointer hover:border-zinc-700 transition-colors">
                  <input
                    type="checkbox"
                    checked={config.notifyOnError}
                    onChange={(e) => setConfig({ ...config, notifyOnError: e.target.checked })}
                    className="rounded border-zinc-700 text-sky-500 focus:ring-sky-500"
                  />
                  <span className="text-xs text-zinc-300">Publishing Errors</span>
                </label>
              </div>
            </div>

            {/* Actions for credentials */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSaveConfig}
                  disabled={isLoading}
                  className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Check className="w-4 h-4 text-emerald-400" />
                  Save Settings
                </button>
                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={isTesting || !config.botToken.trim() || !config.chatId.trim()}
                  className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-sky-950 transition-colors disabled:opacity-50"
                >
                  <Zap className={`w-4 h-4 ${isTesting ? 'animate-bounce' : ''}`} />
                  {isTesting ? 'Testing Link...' : 'Send Live Test Ping'}
                </button>
              </div>

              {testResult && (
                <div className={`text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-lg max-w-md ${
                  testResult.success ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-800/40' : 'bg-rose-950/40 text-rose-400 border border-rose-800/40'
                }`}>
                  {testResult.success ? <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> : <AlertCircle className="w-3.5 h-3.5 shrink-0" />}
                  <span className="truncate">{testResult.message || testResult.error}</span>
                </div>
              )}
            </div>
          </div>

          {/* Instant Quote Card Broadcast Section */}
          <div className="bg-zinc-900/40 p-5 rounded-xl border border-zinc-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
                <Send className="w-4 h-4 text-emerald-400" />
                Instant Broadcast Composer
              </h3>
              <span className="text-[11px] text-zinc-500">
                Directly sends rendered quote card + caption to your Telegram channel
              </span>
            </div>

            {activeQuoteCardUrl && (
              <div className="flex items-center gap-3 p-3 bg-zinc-950 rounded-lg border border-zinc-800">
                <img
                  src={activeQuoteCardUrl}
                  alt="Quote Preview"
                  className="w-16 h-16 object-cover rounded-lg border border-zinc-700 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-medium text-zinc-300 truncate">
                    Attached: Active Studio Quote Card (1080x1080)
                  </div>
                  <div className="text-[11px] text-zinc-500 truncate">
                    Photo will be sent with the formatted message below
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Broadcast Caption / Message
              </label>
              <textarea
                rows={3}
                value={broadcastMessage}
                onChange={(e) => setBroadcastMessage(e.target.value)}
                placeholder="Enter caption with hashtags to broadcast to Telegram..."
                className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-950 border border-zinc-700/80 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 text-xs"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={handleSendBroadcast}
                disabled={isSendingBroadcast || !config.botToken.trim()}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-emerald-950 transition-colors disabled:opacity-50"
              >
                <Send className={`w-3.5 h-3.5 ${isSendingBroadcast ? 'animate-pulse' : ''}`} />
                {isSendingBroadcast ? 'Broadcasting...' : 'Broadcast to Telegram Now'}
              </button>

              {broadcastStatus && (
                <div className={`text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${
                  broadcastStatus.success ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-800/40' : 'bg-rose-950/40 text-rose-400 border border-rose-800/40'
                }`}>
                  {broadcastStatus.success ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                  {broadcastStatus.message}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-900/60 flex items-center justify-between">
          <div className="text-xs text-zinc-500 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-sky-400" />
            Tokens are securely stored in local server memory and persist across sessions.
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
