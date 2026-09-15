/**
 * Termux & Low-Resource 24/7 Headless Auto-Posting Worker
 * Runs autonomously on an old Android phone, VPS, or Raspberry Pi.
 * Memory footprint: ~35-50 MB RAM
 */

import fs from "fs";
import path from "path";
import "dotenv/config";

const CONFIG_FILE = path.join(process.cwd(), "worker-config.json");
const HISTORY_FILE = path.join(process.cwd(), "worker-history.json");

interface WorkerConfig {
  niche: string;
  intervalMinutes: number;
  facebookPageId: string;
  facebookAccessToken: string;
  imageStyle: "ghibli" | "anime" | "photorealism" | "watercolor" | "cinematic";
  watermark: string;
  enabled: boolean;
}

const DEFAULT_CONFIG: WorkerConfig = {
  niche: "Wisdom & Deep Philosophy",
  intervalMinutes: 180, // Every 3 hours
  facebookPageId: process.env.FB_PAGE_ID || "",
  facebookAccessToken: process.env.FB_ACCESS_TOKEN || "",
  imageStyle: "ghibli",
  watermark: "@QuoteMaster",
  enabled: true,
};

const SEED_QUOTES = [
  { quote: "The unexamined life is not worth living.", author: "Socrates", tags: ["Wisdom", "Life", "Philosophy"] },
  { quote: "We suffer more often in imagination than in reality.", author: "Seneca", tags: ["Stoicism", "Mindset", "Wisdom"] },
  { quote: "The quieter you become, the more you are able to hear.", author: "Rumi", tags: ["Mindfulness", "Peace", "Silence"] },
  { quote: "He who has a why to live can bear almost any how.", author: "Friedrich Nietzsche", tags: ["Purpose", "Resilience", "Mind"] },
  { quote: "Simplicity is the ultimate sophistication.", author: "Leonardo da Vinci", tags: ["Simplicity", "Art", "Focus"] },
  { quote: "In the middle of difficulty lies opportunity.", author: "Albert Einstein", tags: ["Opportunity", "Hope", "Growth"] },
  { quote: "Happiness depends upon ourselves.", author: "Aristotle", tags: ["Happiness", "Responsibility", "Philosophy"] },
  { quote: "To know thyself is the beginning of wisdom.", author: "Socrates", tags: ["SelfKnowledge", "Wisdom", "Truth"] },
  { quote: "No man ever steps in the same river twice, for it is not the same river and he is not the same man.", author: "Heraclitus", tags: ["Change", "Growth", "Flow"] },
  { quote: "Do not dwell in the past, do not dream of the future, concentrate the mind on the present moment.", author: "Buddha", tags: ["Presence", "Mindfulness", "Zen"] },
];

function loadConfig(): WorkerConfig {
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      return { ...DEFAULT_CONFIG, ...JSON.parse(fs.readFileSync(CONFIG_FILE, "utf-8")) };
    }
  } catch (err) {
    console.error("Warning reading config:", err);
  }
  return DEFAULT_CONFIG;
}

function loadHistory(): Array<{ id: string; quote: string; postedAt: string; fbPostId?: string }> {
  try {
    if (fs.existsSync(HISTORY_FILE)) {
      return JSON.parse(fs.readFileSync(HISTORY_FILE, "utf-8"));
    }
  } catch (err) {
    console.error("Warning reading history:", err);
  }
  return [];
}

function saveHistory(history: any[]) {
  try {
    fs.writeFileSync(HISTORY_FILE, JSON.stringify(history.slice(-500), null, 2));
  } catch (err) {
    console.error("Error writing history log:", err);
  }
}

function getStylePrompt(style: string, theme: string): string {
  switch (style) {
    case "ghibli":
      return `Studio Ghibli aesthetic, Hayao Miyazaki anime style, lush scenery, serene atmosphere, whimsical vibrant colors, nature background for ${theme}, masterpieces 4k`;
    case "anime":
      return `90s retro anime aesthetic, Makoto Shinkai lighting, detailed beautiful illustration, ethereal ambiance, evocative sky, ${theme}`;
    case "watercolor":
      return `Handmade watercolor painting, soft pastel color wash, gentle brush strokes, poetic minimalist scenery, ${theme}`;
    case "cinematic":
      return `Chiaroscuro cinematic lighting, atmospheric deep shadows, 35mm film photograph, moody reflective environment, ${theme}`;
    case "photorealism":
    default:
      return `Award winning nature landscape photograph, golden hour sunlight, 8k resolution, serene majestic environment, ${theme}`;
  }
}

async function generateImageUrl(theme: string, style: string): Promise<string> {
  const seed = Math.floor(Math.random() * 1000000);
  const prompt = encodeURIComponent(getStylePrompt(style, theme));
  return `https://image.pollinations.ai/prompt/${prompt}?width=1080&height=1350&model=dreamshaper&seed=${seed}&nologo=true`;
}

async function postToFacebook(imageUrl: string, caption: string, config: WorkerConfig): Promise<string | null> {
  if (!config.facebookPageId || !config.facebookAccessToken) {
    console.log("[SIMULATION MODE] No Facebook credentials configured. Simulating post publish.");
    console.log(`[CAPTION PREVIEW]:\n${caption}`);
    console.log(`[IMAGE URL]: ${imageUrl}`);
    return `sim_post_${Date.now()}`;
  }

  const endpoint = `https://graph.facebook.com/v19.0/${config.facebookPageId}/photos`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      url: imageUrl,
      caption: caption,
      access_token: config.facebookAccessToken,
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(`Facebook API Error: ${JSON.stringify(data)}`);
  }

  return data.id || data.post_id || "ok";
}

async function runCycle() {
  const config = loadConfig();
  if (!config.enabled) {
    console.log(`[${new Date().toLocaleTimeString()}] Worker is disabled in config. Skipping cycle.`);
    return;
  }

  const history = loadHistory();
  const postedQuotes = new Set(history.map((h) => h.quote.toLowerCase()));

  // Pick non-repeated quote
  let selected = SEED_QUOTES.find((q) => !postedQuotes.has(q.quote.toLowerCase()));
  if (!selected) {
    // If all used, pick the oldest
    selected = SEED_QUOTES[Math.floor(Math.random() * SEED_QUOTES.length)];
  }

  console.log(`\n========================================`);
  console.log(`[${new Date().toISOString()}] Starting Auto-Post Cycle`);
  console.log(`Selected Quote: "${selected.quote}" — ${selected.author}`);

  try {
    const imageUrl = await generateImageUrl(selected.tags.join(" "), config.imageStyle);
    console.log(`Image Generator Link Ready.`);

    const hashtagString = selected.tags.map((t) => `#${t.replace(/\s+/g, "")}`).join(" ");
    const caption = `"${selected.quote}"\n\n— ${selected.author}\n\n${hashtagString} #QuoteOfTheDay #Inspiration #Aesthetic\n\n✨ Follow ${config.watermark} for daily wisdom.`;

    const fbPostId = await postToFacebook(imageUrl, caption, config);
    console.log(`Successfully Published! Post ID: ${fbPostId}`);

    history.push({
      id: `post_${Date.now()}`,
      quote: selected.quote,
      postedAt: new Date().toISOString(),
      fbPostId: fbPostId || undefined,
    });
    saveHistory(history);

  } catch (error: any) {
    console.error(`Failed during post cycle:`, error?.message || error);
  }
}

async function startWorker() {
  console.log(`\n======================================================`);
  console.log(`  OmniNiche 24/7 Headless Android / Linux Worker       `);
  console.log(`======================================================`);

  const config = loadConfig();
  console.log(`• Interval: Every ${config.intervalMinutes} minutes`);
  console.log(`• Style: ${config.imageStyle}`);
  console.log(`• Watermark: ${config.watermark}`);
  console.log(`• Facebook Page: ${config.facebookPageId ? config.facebookPageId : "Not configured (Simulation Mode)"}`);
  console.log(`------------------------------------------------------\n`);

  // Run immediate first cycle
  await runCycle();

  // Set recurring interval
  const intervalMs = Math.max(1, config.intervalMinutes) * 60 * 1000;
  setInterval(async () => {
    await runCycle();
  }, intervalMs);
}

startWorker();
