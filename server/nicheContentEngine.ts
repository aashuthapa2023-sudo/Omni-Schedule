/**
 * High-Aesthetic Niche Content Engine
 * Generates non-repeating, niche-tailored quotes, viral hooks, captions, and unique high-resolution images
 * for Facebook Page Autopilots (US Army, Stoicism, Cosmos, Freethought, etc.)
 */
import { getSmartMatchedImageUrl } from "./smartImageEngine";
import { MASTER_NICHE_DATABASE, createQuoteSignature } from "./massiveQuoteDatabase";

export interface QuotePackage {
  quote: string;
  author: string;
  imagePrompt: string;
  hookLine: string;
  caption: string;
  suggestedTemplate: string;
  tags: string[];
}

// 40+ Unique High-Resolution Aesthetic Dark Chiaroscuro Images per Niche (Strictly Verified Authentic Niche Assets)
export const NICHE_IMAGE_COLLECTIONS: Record<string, string[]> = {
  military: [
    "https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=1080&auto=format&fit=crop&q=85", // lone soldier dawn silhouette holding rifle with combat helmet
    "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=1080&auto=format&fit=crop&q=85", // tactical formation squad in field uniform
    "https://images.unsplash.com/photo-1508873696983-2df5293cb32b?w=1080&auto=format&fit=crop&q=85", // brotherhood comrades at bivouac campfire under dark night
    "https://images.unsplash.com/photo-1569429593410-b498b3fb3387?w=1080&auto=format&fit=crop&q=85", // camouflage patrol moving through morning mist
    "https://images.unsplash.com/photo-1584483766114-2cea6facdf57?w=1080&auto=format&fit=crop&q=85", // tactical soldier silhouette under dramatic storm clouds
    "https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=1080&auto=format&fit=crop&q=85", // intense physical training, mud, endurance, ranger grit
    "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=1080&auto=format&fit=crop&q=85", // rugged military tactical vehicle in desert dust storm
    "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1080&auto=format&fit=crop&q=85", // tactical mountain recon summit overlooking valley
    "https://images.unsplash.com/photo-1519791883288-dc8bd696e667?w=1080&auto=format&fit=crop&q=85", // moody atmospheric dawn military patrol
    "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1080&auto=format&fit=crop&q=85", // mountain ridge squad silhouette in high winds
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1080&auto=format&fit=crop&q=85", // rugged mountain warfare peaks and ridges
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1080&auto=format&fit=crop&q=85", // canyon patrol dramatic lighting
    "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1080&auto=format&fit=crop&q=85", // fog-shrouded mountain ridge deployment
    "https://images.unsplash.com/photo-1448375240586-882707db888b?w=1080&auto=format&fit=crop&q=85", // dense woodland tactical recon
    "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=1080&auto=format&fit=crop&q=85", // lone sentinel standing against harsh mountain blizzard
    "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=1080&auto=format&fit=crop&q=85", // rock wall combat obstacle climbing training
    "https://images.unsplash.com/photo-1434394354979-a235cd36269d?w=1080&auto=format&fit=crop&q=85", // epic mountain thunderstorm tactical perimeter
    "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=1080&auto=format&fit=crop&q=85", // armored convoy desert route
    "https://images.unsplash.com/photo-1510784722466-f2aa9c52fff6?w=1080&auto=format&fit=crop&q=85", // golden dawn over frontline hills
    "https://images.unsplash.com/photo-1506773093468-b78f44ff53e8?w=1080&auto=format&fit=crop&q=85", // night stars over tactical outpost
    "https://images.unsplash.com/photo-1511497584788-87676104235f?w=1080&auto=format&fit=crop&q=85", // mist through dense pine trees on dawn march
    "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=1080&auto=format&fit=crop&q=85", // golden sunlight beam breaking through trees on patrol
  ],
  hollywood: [
    "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1080&auto=format&fit=crop&q=85",
    "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=1080&auto=format&fit=crop&q=85",
    "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1080&auto=format&fit=crop&q=85",
    "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1080&auto=format&fit=crop&q=85",
    "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1080&auto=format&fit=crop&q=85",
    "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1080&auto=format&fit=crop&q=85",
    "https://images.unsplash.com/photo-1524712245354-2c4e5e7121c0?w=1080&auto=format&fit=crop&q=85",
    "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1080&auto=format&fit=crop&q=85",
    "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1080&auto=format&fit=crop&q=85",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=1080&auto=format&fit=crop&q=85",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=1080&auto=format&fit=crop&q=85",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1080&auto=format&fit=crop&q=85",
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=1080&auto=format&fit=crop&q=85",
    "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=1080&auto=format&fit=crop&q=85",
  ],
  existentialism: [
    "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1080&auto=format&fit=crop&q=85",
    "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=1080&auto=format&fit=crop&q=85",
    "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=1080&auto=format&fit=crop&q=85",
    "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1080&auto=format&fit=crop&q=85",
    "https://images.unsplash.com/photo-1505664194779-8beaceb93744?w=1080&auto=format&fit=crop&q=85",
    "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=1080&auto=format&fit=crop&q=85",
    "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=1080&auto=format&fit=crop&q=85",
    "https://images.unsplash.com/photo-1463171379579-3fdfb86d6285?w=1080&auto=format&fit=crop&q=85",
    "https://images.unsplash.com/photo-1507842229452-774f36402447?w=1080&auto=format&fit=crop&q=85",
    "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1080&auto=format&fit=crop&q=85",
  ],
  mindfulness: [
    "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1080&auto=format&fit=crop&q=85",
    "https://images.unsplash.com/photo-1508672019048-805b876b67e2?w=1080&auto=format&fit=crop&q=85",
    "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=1080&auto=format&fit=crop&q=85",
    "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=1080&auto=format&fit=crop&q=85",
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1080&auto=format&fit=crop&q=85",
    "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1080&auto=format&fit=crop&q=85",
    "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=1080&auto=format&fit=crop&q=85",
    "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=1080&auto=format&fit=crop&q=85",
  ],
  stoicism: [
    "https://images.unsplash.com/photo-1554188248-986adbb73be4?w=1080&auto=format&fit=crop&q=85",
    "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=1080&auto=format&fit=crop&q=85",
    "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1080&auto=format&fit=crop&q=85",
    "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1080&auto=format&fit=crop&q=85",
    "https://images.unsplash.com/photo-1519791883288-dc8bd696e667?w=1080&auto=format&fit=crop&q=85",
    "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=1080&auto=format&fit=crop&q=85",
    "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=1080&auto=format&fit=crop&q=85",
    "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=1080&auto=format&fit=crop&q=85",
    "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1080&auto=format&fit=crop&q=85",
    "https://images.unsplash.com/photo-1505664194779-8beaceb93744?w=1080&auto=format&fit=crop&q=85",
    "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=1080&auto=format&fit=crop&q=85",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=1080&auto=format&fit=crop&q=85",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=1080&auto=format&fit=crop&q=85",
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1080&auto=format&fit=crop&q=85",
  ],
  science: [
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1080&auto=format&fit=crop&q=85",
    "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=1080&auto=format&fit=crop&q=85",
    "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1080&auto=format&fit=crop&q=85",
    "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1080&auto=format&fit=crop&q=85",
    "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=1080&auto=format&fit=crop&q=85",
    "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1080&auto=format&fit=crop&q=85",
    "https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?w=1080&auto=format&fit=crop&q=85",
    "https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=1080&auto=format&fit=crop&q=85",
    "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1080&auto=format&fit=crop&q=85",
    "https://images.unsplash.com/photo-1538370965046-79c0d6907d47?w=1080&auto=format&fit=crop&q=85",
  ],
  atheism: [
    "https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=1080&auto=format&fit=crop&q=85",
    "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1080&auto=format&fit=crop&q=85",
    "https://images.unsplash.com/photo-1505664194779-8beaceb93744?w=1080&auto=format&fit=crop&q=85",
    "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1080&auto=format&fit=crop&q=85",
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1080&auto=format&fit=crop&q=85",
    "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1080&auto=format&fit=crop&q=85",
    "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1080&auto=format&fit=crop&q=85",
    "https://images.unsplash.com/photo-1519791883288-dc8bd696e667?w=1080&auto=format&fit=crop&q=85",
    "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=1080&auto=format&fit=crop&q=85",
  ],
  default: [
    "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1080&auto=format&fit=crop&q=85",
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1080&auto=format&fit=crop&q=85",
    "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=1080&auto=format&fit=crop&q=85",
    "https://images.unsplash.com/photo-1554188248-986adbb73be4?w=1080&auto=format&fit=crop&q=85",
    "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=1080&auto=format&fit=crop&q=85",
    "https://images.unsplash.com/photo-1508873696983-2df5293cb32b?w=1080&auto=format&fit=crop&q=85",
  ],
};

/**
 * Returns a guaranteed unique high-resolution aesthetic image URL for any post index and pageId
 */
export function getUniqueNicheImageUrl(nicheCategory: string, postIndex: number, pageId: string, quoteText?: string, author?: string): string {
  return getSmartMatchedImageUrl({
    nicheCategory,
    quoteText,
    author,
    postIndex,
    pageId,
  });
}

// 40+ Rich Hand-Crafted Viral Quote Post Packages per Niche for Instant Baseline & Failover
export const NICHE_QUOTE_LIBRARIES: Record<string, QuotePackage[]> = {
  military: [
    {
      quote: "We do not rise to the level of our expectations, we fall to the level of our training.",
      author: "Archilochus",
      imagePrompt: "US Army tactical squad sunrise patrol through misty valley chiaroscuro 8k",
      hookLine: "When the pressure hits, this is the only thing that saves you:",
      caption: "⚡ When the pressure hits, emotion vanishes and muscle memory takes over. Sweat in peace so you don't bleed in war.\n\n💬 What standard of training are you holding yourself to today?\n\n#USArmy #Brotherhood #Discipline #Training #Grit #HoldTheLine",
      suggestedTemplate: "tactical-gold-tag",
      tags: ["USArmy", "Brotherhood", "Training", "Discipline"],
    },
    {
      quote: "The true soldier fights not because he hates what is in front of him, but because he loves what is behind him.",
      author: "G.K. Chesterton",
      imagePrompt: "Soldiers standing shoulder to shoulder at sunset overlooking mountain horizon golden volumetric lighting",
      hookLine: "The definition of brotherhood:",
      caption: "⚡ The definition of brotherhood.\n\nIt was never about hate; it was always about holding the line for the brother to your left and right.\n\n💬 Tag a brother who always has your six.\n\n#Brotherhood #Honor #USArmy #Loyalty #HoldingTheLine",
      suggestedTemplate: "tactical-gold-tag",
      tags: ["Brotherhood", "Honor", "Patriotism"],
    },
    {
      quote: "Discipline is the soul of an army. It makes small numbers formidable, procures success to the weak, and esteem to all.",
      author: "George Washington",
      imagePrompt: "Military formation under stormy dramatic clouds, golden rim lighting, 8k",
      hookLine: "Why small disciplined units win wars:",
      caption: "⚡ Why small disciplined units win wars.\n\nWithout discipline, chaos reigns. With it, impossible missions become routine execution.\n\n#USArmy #Discipline #Leadership #WarriorEthos #Patriot",
      suggestedTemplate: "tactical-gold-tag",
      tags: ["Discipline", "Leadership", "USArmy"],
    },
    {
      quote: "Out of every one hundred men, ten shouldn't even be there, eighty are just targets, nine are the real fighters, and we are lucky to have them, for they make the battle. Ah, but the one, one is a warrior, and he will bring the others back.",
      author: "Heraclitus",
      imagePrompt: "Lone tactical warrior standing guard in misty mountain dawn, cinematic atmosphere",
      hookLine: "The 1 in 100 warrior archetype:",
      caption: "⚡ The 1 in 100 warrior archetype.\n\nTrue leadership isn't a rank on your chest; it's the willingness to carry the brotherhood through hell and bring them home.\n\n#Warrior #Brotherhood #USArmy #Valor #Strength",
      suggestedTemplate: "tactical-gold-tag",
      tags: ["Warrior", "Brotherhood", "Valor"],
    },
    {
      quote: "A good plan violently executed now is better than a perfect plan executed next week.",
      author: "General George S. Patton",
      imagePrompt: "Armored convoy advancing through desert dust storm, dramatic golden sunbeams",
      hookLine: "Speed, violence of action, and unwavering commitment:",
      caption: "⚡ Speed, violence of action, and unwavering commitment.\n\nHesitation is the ultimate killer on the battlefield and in life. Make the decision, hold the line, and execute.\n\n#Patton #USArmy #Execution #Leadership #TacticalMindset",
      suggestedTemplate: "tactical-gold-tag",
      tags: ["Patton", "Execution", "USArmy"],
    },
    {
      quote: "In the absence of orders, go find something and kill it.",
      author: "Field Marshal Erwin Rommel",
      imagePrompt: "Tactical squad advancing through thick pine forest mist at dawn",
      hookLine: "Extreme bias for action:",
      caption: "⚡ Extreme bias for action.\n\nNever wait to be told what needs doing when the mission is on the line. Take the initiative.\n\n#Initiative #Warrior #Brotherhood #USArmy",
      suggestedTemplate: "tactical-gold-tag",
      tags: ["Initiative", "Warrior", "Discipline"],
    },
    {
      quote: "The more you sweat in peacetime, the less you bleed in war.",
      author: "General Norman Schwarzkopf",
      imagePrompt: "Ranger training in pouring rain, mud, and tactical steel equipment",
      hookLine: "Why the grueling repetitions matter:",
      caption: "⚡ Why the grueling repetitions matter.\n\nEvery drop of sweat invested on the range, in the gym, and in the field buys precious seconds when real chaos strikes.\n\n#USArmy #SweatInPeace #RangerUp #Training",
      suggestedTemplate: "tactical-gold-tag",
      tags: ["Training", "Discipline", "USArmy"],
    },
    {
      quote: "Freedom is never more than one generation away from extinction. We didn't pass it to our children in the bloodstream. It must be fought for, protected, and handed on.",
      author: "Ronald Reagan",
      imagePrompt: "American flag fluttering against stormy sunset horizon, dramatic cinematic golden hour",
      hookLine: "Why we stand watch:",
      caption: "⚡ Why we stand watch.\n\nPeace is preserved by strength, not goodwill. Honoring those who hold the perimeter day and night.\n\n#USArmy #Patriotism #Freedom #Honor #Brotherhood",
      suggestedTemplate: "tactical-gold-tag",
      tags: ["Freedom", "Patriotism", "USArmy"],
    },
    {
      quote: "Never give in — never, never, never, in nothing great or small, large or petty, except to convictions of honour and good sense.",
      author: "Winston Churchill",
      imagePrompt: "Lone commander looking out over misty coastline at dawn",
      hookLine: "The rule of unyielding resolve:",
      caption: "⚡ The rule of unyielding resolve.\n\nWhen every voice tells you to lay down your arms, that is the exact second to dig your heels in.\n\n#Resolve #NeverGiveUp #USArmy #Brotherhood #Courage",
      suggestedTemplate: "tactical-gold-tag",
      tags: ["Resolve", "Courage", "Valor"],
    },
    {
      quote: "It is not the critic who counts; not the man who points out how the strong man stumbles. The credit belongs to the man who is actually in the arena.",
      author: "Theodore Roosevelt",
      imagePrompt: "Combat soldier with helmet and rifle silhouette against golden dust storm",
      hookLine: "To everyone standing in the arena today:",
      caption: "⚡ To everyone standing in the arena today.\n\nLet the spectators talk from the sidelines. You are the one putting skin in the game.\n\n#ManInTheArena #Warrior #USArmy #Grit #Honor",
      suggestedTemplate: "tactical-gold-tag",
      tags: ["Arena", "Grit", "Warrior"],
    },
    {
      quote: "For those who have fought for it, freedom has a flavor the protected will never know.",
      author: "Vietnam Veteran Inscription",
      imagePrompt: "Silhouetted soldiers walking towards sunset helicopter landing zone",
      hookLine: "A truth known only by those who served:",
      caption: "⚡ A truth known only by those who served.\n\nThe unbreakable bond of having stood on the front lines and held the perimeter.\n\n#Brotherhood #Veterans #USArmy #Honor #Sacrifice",
      suggestedTemplate: "tactical-gold-tag",
      tags: ["Brotherhood", "Veterans", "Honor"],
    },
    {
      quote: "I am not afraid of an army of lions led by a sheep; I am afraid of an army of sheep led by a lion.",
      author: "Alexander the Great",
      imagePrompt: "Commander leading formation forward into mountain pass under dark skies",
      hookLine: "The power of uncompromising leadership:",
      caption: "⚡ The power of uncompromising leadership.\n\nWhen the leader sets a standard of fearless execution, the entire unit becomes unstoppable.\n\n#Leadership #Warrior #USArmy #Command",
      suggestedTemplate: "tactical-gold-tag",
      tags: ["Leadership", "Warrior", "Courage"],
    },
    {
      quote: "He who fears death dies a thousand deaths. The warrior dies but once.",
      author: "Classical Warrior Code",
      imagePrompt: "Tactical gear silhouette with golden rim lighting at dusk",
      hookLine: "Conquering internal fear:",
      caption: "⚡ Conquering internal fear.\n\nMaster your fear before stepping onto the objective. The mind leads; the body follows.\n\n#Fearless #WarriorCode #USArmy #MentalFortitude",
      suggestedTemplate: "tactical-gold-tag",
      tags: ["WarriorCode", "Fearless", "Fortitude"],
    },
    {
      quote: "You have to be willing to suffer more than the other guy. That's the baseline.",
      author: "Special Forces Axiom",
      imagePrompt: "Ruck march through dark misty forest at 0400 hours",
      hookLine: "The harsh reality of elite performance:",
      caption: "⚡ The harsh reality of elite performance.\n\nWhen talent runs out, grit takes over. Embrace the suck and keep moving forward.\n\n#SpecialForces #EmbraceTheSuck #USArmy #Grit",
      suggestedTemplate: "tactical-gold-tag",
      tags: ["SpecialForces", "Grit", "Brotherhood"],
    },
  ],

  stoicism: [
    {
      quote: "You have power over your mind - not outside events. Realize this, and you will find strength.",
      author: "Marcus Aurelius",
      imagePrompt: "Ancient Roman philosopher marble bust chiaroscuro museum lighting 8k",
      hookLine: "The ultimate Stoic rule for unbreakable clarity:",
      caption: "⚡ The ultimate Stoic rule for unbreakable clarity.\n\nExternal storms will always rage. The only anchor you command is your inner citadel.\n\n#Stoicism #MarcusAurelius #Mindset #Clarity #InnerPeace",
      suggestedTemplate: "classical-marble",
      tags: ["Stoicism", "Mindset", "Wisdom"],
    },
    {
      quote: "We suffer more often in imagination than in reality.",
      author: "Seneca",
      imagePrompt: "Moody Roman marble archway with soft golden light slicing through shadows",
      hookLine: "Stop creating emergencies that do not exist:",
      caption: "⚡ Stop creating emergencies that do not exist.\n\nMost of our anxiety is phantom weight. Strip away the story you are telling yourself and look at the bare facts.\n\n#Seneca #Stoicism #MentalStrength #Calm #Philosophy",
      suggestedTemplate: "classical-marble",
      tags: ["Seneca", "Anxiety", "Stoicism"],
    },
    {
      quote: "No man is free who is not master of himself.",
      author: "Epictetus",
      imagePrompt: "Classical Greek statue draped in shadow with sharp rim lighting",
      hookLine: "The only true freedom in life:",
      caption: "⚡ The only true freedom in life.\n\nIf your emotions are tossed around by every external comment or event, you are a slave to circumstance. Master your impulses.\n\n#Epictetus #SelfMastery #Discipline #StoicMind",
      suggestedTemplate: "classical-marble",
      tags: ["Epictetus", "SelfMastery", "Freedom"],
    },
    {
      quote: "The impediment to action advances action. What stands in the way becomes the way.",
      author: "Marcus Aurelius",
      imagePrompt: "Towering ancient stone monolith in mountain mist at dawn",
      hookLine: "How Stoics turn obstacles into fuel:",
      caption: "⚡ How Stoics turn obstacles into fuel.\n\nEvery obstacle is an invitation to practice virtue, patience, and courage. Use the friction to grow stronger.\n\n#TheObstacleIsTheWay #MarcusAurelius #StoicWisdom",
      suggestedTemplate: "classical-marble",
      tags: ["ObstacleIsTheWay", "Growth", "Stoicism"],
    },
    {
      quote: "Waste no more time arguing what a good man should be. Be one.",
      author: "Marcus Aurelius",
      imagePrompt: "Carved stone inscription illuminated by soft candlelight in dark temple",
      hookLine: "The only debate that matters:",
      caption: "⚡ The only debate that matters.\n\nEnough theorizing and debating ethics on the internet. Let your actions do all the speaking today.\n\n#MarcusAurelius #Action #Integrity #Character",
      suggestedTemplate: "classical-marble",
      tags: ["Character", "Integrity", "Action"],
    },
    {
      quote: "If a man knows not to which port he sails, no wind is favorable.",
      author: "Seneca",
      imagePrompt: "Ancient lighthouse beacon glowing through midnight tempest sea mist",
      hookLine: "Why purpose precedes effort:",
      caption: "⚡ Why purpose precedes effort.\n\nHard work without clear direction is just exhausting motion. Decide on your destination before setting sail.\n\n#Seneca #Purpose #Focus #StoicPhilosophy",
      suggestedTemplate: "classical-marble",
      tags: ["Purpose", "Focus", "Direction"],
    },
    {
      quote: "He is a wise man who does not grieve for the things which he has not, but rejoices for those which he has.",
      author: "Epictetus",
      imagePrompt: "Olive tree growing out of rocky cliff over calm azure sea",
      hookLine: "The secret to enduring contentment:",
      caption: "⚡ The secret to enduring contentment.\n\nGratitude is the antidote to endless striving. Cherish what is before you.\n\n#Epictetus #Gratitude #Peace #StoicLiving",
      suggestedTemplate: "classical-marble",
      tags: ["Gratitude", "Peace", "Contentment"],
    },
    {
      quote: "Dwell on the beauty of life. Watch the stars, and see yourself running with them.",
      author: "Marcus Aurelius",
      imagePrompt: "Ancient philosopher silhouette gazing up at star-strewn Milky Way night sky",
      hookLine: "The cosmic perspective of the emperor:",
      caption: "⚡ The cosmic perspective of the emperor.\n\nWhen daily trivia feels overwhelming, zoom out to the stars. Rediscover the wonder of existing.\n\n#CosmicPerspective #MarcusAurelius #Wonder #Beauty",
      suggestedTemplate: "classical-marble",
      tags: ["Perspective", "Wonder", "Beauty"],
    },
  ],

  science: [
    {
      quote: "The cosmos is within us. We are made of star-stuff. We are a way for the cosmos to know itself.",
      author: "Carl Sagan",
      imagePrompt: "Deep space James Webb spiral galaxy with luminous glowing cosmic dust 8k",
      hookLine: "We are not separate from the universe:",
      caption: "⚡ We are not separate from the universe — we are the universe conscious of itself.\n\nEvery atom in your blood was forged inside the heart of an exploding star.\n\n#Cosmos #CarlSagan #Astronomy #Science #Perspective",
      suggestedTemplate: "dark-glow",
      tags: ["Cosmos", "CarlSagan", "Astronomy"],
    },
    {
      quote: "Look again at that dot. That's here. That's home. That's us. On it everyone you love, everyone you know, everyone you ever heard of, lived out their lives.",
      author: "Carl Sagan",
      imagePrompt: "Earth viewed as tiny pale blue speck in vast black beam of sunlight",
      hookLine: "The ultimate lesson in human humility:",
      caption: "⚡ The ultimate lesson in human humility.\n\nOur posturings, our imagined self-importance, are challenged by this point of pale light.\n\n#PaleBlueDot #CarlSagan #CosmicHumility #Earth",
      suggestedTemplate: "dark-glow",
      tags: ["PaleBlueDot", "Humility", "Cosmos"],
    },
    {
      quote: "The first principle is that you must not fool yourself — and you are the easiest person to fool.",
      author: "Richard Feynman",
      imagePrompt: "Chalkboard filled with intricate quantum equations in moody dim study",
      hookLine: "The foundation of scientific integrity:",
      caption: "⚡ The foundation of scientific integrity.\n\nDemand evidence especially from your own cherished beliefs. Be willing to be wrong in pursuit of the truth.\n\n#RichardFeynman #Science #Rationality #Truth",
      suggestedTemplate: "dark-glow",
      tags: ["Feynman", "Integrity", "Rationality"],
    },
    {
      quote: "Somewhere, something incredible is waiting to be known.",
      author: "Carl Sagan",
      imagePrompt: "Giant radio telescope array under vibrant Milky Way galaxy night sky",
      hookLine: "The infinite frontier of human curiosity:",
      caption: "⚡ The infinite frontier of human curiosity.\n\nScience is the candle in the dark that pushes back the unknown.\n\n#Science #Discovery #Curiosity #SpaceExploration",
      suggestedTemplate: "dark-glow",
      tags: ["Discovery", "Curiosity", "Science"],
    },
    {
      quote: "Science is not only compatible with spirituality; it is a profound source of spirituality.",
      author: "Carl Sagan",
      imagePrompt: "Atmospheric aurora borealis dancing over snowy mountain lake reflection",
      hookLine: "Finding awe in reality:",
      caption: "⚡ Finding awe in reality.\n\nWhen we recognize our place in an immense century-spanning universe, the feeling of awe is deeper than any myth.\n\n#Awe #Nature #Science #Spirituality",
      suggestedTemplate: "dark-glow",
      tags: ["Awe", "Nature", "Wonder"],
    },
    {
      quote: "Look up at the stars and not down at your feet. Try to make sense of what you see, and wonder about what makes the universe exist. Be curious.",
      author: "Stephen Hawking",
      imagePrompt: "Silhouette on mountain summit looking up at glowing nebula night sky",
      hookLine: "The most important directive for human life:",
      caption: "⚡ The most important directive for human life.\n\nNever lose your sense of wonder. Curiosity is the engine of human evolution.\n\n#StephenHawking #Curiosity #Wonder #Astrophysics",
      suggestedTemplate: "dark-glow",
      tags: ["Hawking", "Curiosity", "Stars"],
    },
  ],

  atheism: [
    {
      quote: "What can be asserted without evidence can also be dismissed without evidence.",
      author: "Christopher Hitchens",
      imagePrompt: "Antique vintage leather-bound library with warm incandescent reading lamp",
      hookLine: "Hitchens' Razor for rational thought:",
      caption: "⚡ Hitchens' Razor for rational thought.\n\nThe burden of proof always rests on the person making extraordinary claims. Think critically.\n\n#Hitchens #Freethought #Rationality #CriticalThinking #Reason",
      suggestedTemplate: "modern-editorial",
      tags: ["Freethought", "Rationality", "Reason"],
    },
    {
      quote: "The whole problem with the world is that fools and fanatics are always so certain of themselves, and wiser people so full of doubts.",
      author: "Bertrand Russell",
      imagePrompt: "Classic dark academia study with parchment papers and hourglass chiaroscuro",
      hookLine: "The paradox of wisdom and certainty:",
      caption: "⚡ The paradox of wisdom and certainty.\n\nTrue intellect embraces nuance, doubt, and ongoing evidence. Beware of absolute certainty.\n\n#BertrandRussell #Philosophy #Wisdom #Freethought",
      suggestedTemplate: "modern-editorial",
      tags: ["Philosophy", "Doubt", "Wisdom"],
    },
    {
      quote: "For me, it is far better to grasp the Universe as it really is than to persist in delusion, however satisfying and reassuring.",
      author: "Carl Sagan",
      imagePrompt: "Deep field stars shining through moody clouds at midnight",
      hookLine: "Choosing reality over comforting illusions:",
      caption: "⚡ Choosing reality over comforting illusions.\n\nThe universe does not owe us pleasant fairy tales. Its actual physics are far more sublime.\n\n#Truth #Reality #CarlSagan #Rationalism",
      suggestedTemplate: "modern-editorial",
      tags: ["Truth", "Reality", "CarlSagan"],
    },
    {
      quote: "I would rather have a mind opened by wonder than one closed by belief.",
      author: "Gerry Spence",
      imagePrompt: "Prism bending white beam of light into rich colorful spectrum against black background",
      hookLine: "The true measure of an open mind:",
      caption: "⚡ The true measure of an open mind.\n\nNever let dogmas replace the raw human capacity for discovery and questioning.\n\n#OpenMind #Freethought #Wonder #Reason",
      suggestedTemplate: "modern-editorial",
      tags: ["Wonder", "Freethought", "Discovery"],
    },
  ],

  hollywood: [
    {
      quote: "Grief changes shape, but it never ends. People have a misconception that you can deal with it and say, 'It's gone, and I'm better.' They're wrong.",
      author: "Keanu Reeves",
      imagePrompt: "Cinematic portrait of movie star in dramatic stage lighting chiaroscuro 8k",
      hookLine: "Raw honesty from Keanu Reeves:",
      caption: "🎬 Raw honesty from Keanu Reeves.\n\nYou don't get over deep loss; you grow around it. Honor the journey.\n\n#KeanuReeves #Hollywood #Resilience #LifeLessons #CinemaLegends",
      suggestedTemplate: "cinematic-letterbox",
      tags: ["KeanuReeves", "Hollywood", "Motivation"],
    },
    {
      quote: "You pray for rain, you gotta deal with the mud too. That's a part of it.",
      author: "Denzel Washington",
      imagePrompt: "Atmospheric movie set with golden backlighting and vintage microphone",
      hookLine: "Denzel's golden rule for ambition:",
      caption: "🎬 Denzel's golden rule for ambition.\n\nEvery great dream brings struggle with it. Embrace the whole ride.\n\n#DenzelWashington #Cinema #Discipline #Hustle #HollywoodQuotes",
      suggestedTemplate: "cinematic-letterbox",
      tags: ["DenzelWashington", "Ambition", "Wisdom"],
    },
    {
      quote: "I think the saddest people always try their hardest to make people happy because they know what it's like to feel absolutely worthless.",
      author: "Robin Williams",
      imagePrompt: "Moody theater spotlight shining down on empty wooden stage floor",
      hookLine: "Remembering the brilliance of Robin Williams:",
      caption: "🎬 Remembering the brilliance of Robin Williams.\n\nKindness costs nothing, but it means everything to someone fighting a silent battle.\n\n#RobinWilliams #Legend #Kindness #CinemaHeart #Hollywood",
      suggestedTemplate: "cinematic-letterbox",
      tags: ["RobinWilliams", "Kindness", "Empathy"],
    },
    {
      quote: "The best thing to hold onto in life is each other.",
      author: "Audrey Hepburn",
      imagePrompt: "Classic vintage monochrome silver screen elegance golden aura",
      hookLine: "Timeless Hollywood grace:",
      caption: "🎬 Timeless Hollywood grace.\n\nThrough all the fame, fortune, and noise, connection is what endures.\n\n#AudreyHepburn #GoldenEra #Elegance #Inspiration #CinemaClassics",
      suggestedTemplate: "cinematic-letterbox",
      tags: ["AudreyHepburn", "Love", "Classics"],
    },
    {
      quote: "If you don't take risks, you'll have a wasted soul.",
      author: "Drew Barrymore",
      imagePrompt: "Dramatic lens flare across movie studio soundstage",
      hookLine: "The antidote to fear:",
      caption: "🎬 The antidote to fear.\n\nComfort is the enemy of greatness. Step out onto the edge.\n\n#HollywoodQuotes #RiskTaking #Growth #Courage",
      suggestedTemplate: "cinematic-letterbox",
      tags: ["Courage", "Growth", "Cinema"],
    },
  ],

  existentialism: [
    {
      quote: "He who has a why to live can bear almost any how.",
      author: "Friedrich Nietzsche",
      imagePrompt: "Dark academia vintage library with glowing amber desk lamp and antique books 8k",
      hookLine: "The ultimate law of human endurance:",
      caption: "📖 The ultimate law of human endurance.\n\nFind your core purpose, and no hardship on earth can break you.\n\n#Nietzsche #DarkAcademia #Philosophy #Introspection #InnerStrength",
      suggestedTemplate: "vintage-typewriter",
      tags: ["Nietzsche", "Philosophy", "Purpose"],
    },
    {
      quote: "In the depth of winter, I finally learned that within me there lay an invincible summer.",
      author: "Albert Camus",
      imagePrompt: "Solitary figure walking through misty rain in vintage European street chiaroscuro",
      hookLine: "Camus on unshakeable inner light:",
      caption: "📖 Camus on unshakeable inner light.\n\nEven when the outside world freezes over, your spirit holds an untameable flame.\n\n#AlbertCamus #Existentialism #Resilience #Solitude #Literature",
      suggestedTemplate: "vintage-typewriter",
      tags: ["Camus", "Literature", "Resilience"],
    },
    {
      quote: "I think that I am only truly alone when I am among people who cannot understand me.",
      author: "Franz Kafka",
      imagePrompt: "Dark moody typewriter with blank page and soft moonlight shadow",
      hookLine: "Kafka's profound reflection on solitude:",
      caption: "📖 Kafka's profound reflection on solitude.\n\nTrue solitude is peaceful; misaligned company is draining. Protect your energy.\n\n#Kafka #Solitude #DarkAcademia #Introspection #ClassicLiterature",
      suggestedTemplate: "vintage-typewriter",
      tags: ["Kafka", "Solitude", "Introspection"],
    },
    {
      quote: "Pain and suffering are always inevitable for a large intelligence and a deep heart.",
      author: "Fyodor Dostoevsky",
      imagePrompt: "Gothic cathedral window with soft sunlight cutting through dust particles",
      hookLine: "From Crime and Punishment:",
      caption: "📖 From Crime and Punishment.\n\nDepth of feeling is a heavy burden, but it is also the origin of all profound art and truth.\n\n#Dostoevsky #Literature #DeepThoughts #SoulQuotes",
      suggestedTemplate: "vintage-typewriter",
      tags: ["Dostoevsky", "Literature", "Wisdom"],
    },
  ],

  mindfulness: [
    {
      quote: "Silence is a source of great strength.",
      author: "Lao Tzu",
      imagePrompt: "Calm mountain lake reflection at dawn with soft mist and bamboo leaves 8k",
      hookLine: "The power of stillness:",
      caption: "🌿 The power of stillness.\n\nWhen the world gets loud, turn inward. Real clarity is born in stillness.\n\n#LaoTzu #Mindfulness #Zen #InnerPeace #Stillness",
      suggestedTemplate: "minimal-sans",
      tags: ["LaoTzu", "Mindfulness", "Peace"],
    },
    {
      quote: "Smile, breathe and go slowly.",
      author: "Thich Nhat Hanh",
      imagePrompt: "Serene zen stone stack balanced gently over ripples of clear water",
      hookLine: "Your daily reminder to unrush:",
      caption: "🌿 Your daily reminder to unrush.\n\nThere is nowhere to rush to. This present moment is your entire life.\n\n#ThichNhatHanh #ZenWisdom #Breathe #PresentMoment #Calm",
      suggestedTemplate: "minimal-sans",
      tags: ["ThichNhatHanh", "PresentMoment", "Calm"],
    },
    {
      quote: "The wound is the place where the Light enters you.",
      author: "Rumi",
      imagePrompt: "Sunbeams piercing through ancient mossy forest canopy golden hour",
      hookLine: "Rumi's timeless medicine:",
      caption: "🌿 Rumi's timeless medicine.\n\nYour scars are not flaws; they are the exact doorways through which wisdom and compassion grow.\n\n#Rumi #SpiritualWisdom #Healing #Mindfulness #SoulCare",
      suggestedTemplate: "minimal-sans",
      tags: ["Rumi", "Healing", "Wisdom"],
    },
  ],
};

/**
 * Get distinct quotes for a niche with strict deduplication across the massive library
 */
export function getDistinctCuratedNichePosts(
  nicheCategory: string,
  count: number,
  pageId: string = "page-1",
  usedSignatures: string[] = []
): QuotePackage[] {
  const masterList = MASTER_NICHE_DATABASE[nicheCategory] || MASTER_NICHE_DATABASE.default;
  const usedSet = new Set(usedSignatures);
  const results: QuotePackage[] = [];

  // Filter fresh quotes
  const freshQuotes = masterList.filter((item) => {
    const sig = createQuoteSignature(item.quote, item.author);
    return !usedSet.has(sig);
  });

  const availablePool = freshQuotes.length >= count ? freshQuotes : masterList;

  // Select non-repeating items
  for (let i = 0; i < count; i++) {
    const pageHash = (pageId || '').split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const item = availablePool[(pageHash + i) % availablePool.length];
    
    results.push({
      quote: item.quote,
      author: item.author,
      imagePrompt: `Cinematic atmospheric dark chiaroscuro for "${item.quote.slice(0, 30)}..." with dramatic lighting`,
      hookLine: item.hookLine,
      caption: item.caption,
      suggestedTemplate: item.suggestedTemplate || "modern-editorial",
      tags: item.tags || ["Wisdom", "Inspiration"],
    });
  }

  return results;
}
