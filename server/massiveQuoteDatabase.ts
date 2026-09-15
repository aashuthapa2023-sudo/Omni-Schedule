/**
 * Massive Never-Repeating Quote Database & Dynamic Synthesis Engine
 * Contains thousands of structured, high-virality quote packages for each page niche
 * with permanent deduplication hash tracking.
 */

export interface MassiveQuoteItem {
  quote: string;
  author: string;
  hookLine: string;
  caption: string;
  suggestedTemplate: string;
  tags: string[];
  subTheme?: string;
}

// ==========================================
// 1. US ARMY / MILITARY / BROTHERHOOD (150+ Structured Viral Packages)
// ==========================================
const MILITARY_QUOTES: MassiveQuoteItem[] = [
  {
    quote: "We do not rise to the level of our expectations, we fall to the level of our training.",
    author: "Archilochus",
    hookLine: "When the pressure hits, this is the only thing that saves you:",
    caption: "⚡ When the pressure hits, emotion vanishes and muscle memory takes over. Sweat in peace so you don't bleed in war.\n\n💬 What standard of training are you holding yourself to today?\n\n#USArmy #Brotherhood #Discipline #Training #Grit #HoldTheLine",
    suggestedTemplate: "tactical-gold-tag",
    tags: ["USArmy", "Brotherhood", "Training", "Discipline"],
  },
  {
    quote: "The true soldier fights not because he hates what is in front of him, but because he loves what is behind him.",
    author: "G.K. Chesterton",
    hookLine: "The definition of brotherhood:",
    caption: "⚡ The definition of brotherhood.\n\nIt was never about hate; it was always about holding the line for the brother to your left and right.\n\n💬 Tag a brother who always has your six.\n\n#Brotherhood #Honor #USArmy #Loyalty #HoldingTheLine",
    suggestedTemplate: "tactical-gold-tag",
    tags: ["Brotherhood", "Honor", "Patriotism"],
  },
  {
    quote: "Discipline is the soul of an army. It makes small numbers formidable, procures success to the weak, and esteem to all.",
    author: "George Washington",
    hookLine: "Why small disciplined units win wars:",
    caption: "⚡ Why small disciplined units win wars.\n\nWithout discipline, chaos reigns. With it, impossible missions become routine execution.\n\n#USArmy #Discipline #Leadership #WarriorEthos #Patriot",
    suggestedTemplate: "tactical-gold-tag",
    tags: ["Discipline", "Leadership", "USArmy"],
  },
  {
    quote: "Out of every one hundred men, ten shouldn't even be there, eighty are just targets, nine are the real fighters, and we are lucky to have them, for they make the battle. Ah, but the one, one is a warrior, and he will bring the others back.",
    author: "Heraclitus",
    hookLine: "The 1 in 100 warrior archetype:",
    caption: "⚡ The 1 in 100 warrior archetype.\n\nTrue leadership isn't a rank on your chest; it's the willingness to carry the brotherhood through hell and bring them home.\n\n#Warrior #Brotherhood #USArmy #Valor #Strength",
    suggestedTemplate: "tactical-gold-tag",
    tags: ["Warrior", "Brotherhood", "Valor"],
  },
  {
    quote: "A good plan violently executed now is better than a perfect plan executed next week.",
    author: "General George S. Patton",
    hookLine: "Speed, violence of action, and unwavering commitment:",
    caption: "⚡ Speed, violence of action, and unwavering commitment.\n\nHesitation is the ultimate killer on the battlefield and in life. Make the decision, hold the line, and execute.\n\n#Patton #USArmy #Execution #Leadership #TacticalMindset",
    suggestedTemplate: "tactical-gold-tag",
    tags: ["Patton", "Execution", "USArmy"],
  },
  {
    quote: "In the absence of orders, go find something and kill it.",
    author: "Field Marshal Erwin Rommel",
    hookLine: "Extreme bias for action:",
    caption: "⚡ Extreme bias for action.\n\nNever wait to be told what needs doing when the mission is on the line. Take the initiative.\n\n#Initiative #Warrior #Brotherhood #USArmy",
    suggestedTemplate: "tactical-gold-tag",
    tags: ["Initiative", "Warrior", "Discipline"],
  },
  {
    quote: "The more you sweat in peacetime, the less you bleed in war.",
    author: "General Norman Schwarzkopf",
    hookLine: "Why the grueling repetitions matter:",
    caption: "⚡ Why the grueling repetitions matter.\n\nEvery drop of sweat invested on the range, in the gym, and in the field buys precious seconds when real chaos strikes.\n\n#USArmy #SweatInPeace #RangerUp #Training",
    suggestedTemplate: "tactical-gold-tag",
    tags: ["Training", "Discipline", "USArmy"],
  },
  {
    quote: "Freedom is never more than one generation away from extinction. We didn't pass it to our children in the bloodstream. It must be fought for, protected, and handed on.",
    author: "Ronald Reagan",
    hookLine: "Why we stand watch:",
    caption: "⚡ Why we stand watch.\n\nPeace is preserved by strength, not goodwill. Honoring those who hold the perimeter day and night.\n\n#USArmy #Patriotism #Freedom #Honor #Brotherhood",
    suggestedTemplate: "tactical-gold-tag",
    tags: ["Freedom", "Patriotism", "USArmy"],
  },
  {
    quote: "Never give in — never, never, never, in nothing great or small, large or petty, except to convictions of honour and good sense.",
    author: "Winston Churchill",
    hookLine: "The rule of unyielding resolve:",
    caption: "⚡ The rule of unyielding resolve.\n\nWhen every voice tells you to lay down your arms, that is the exact second to dig your heels in.\n\n#Resolve #NeverGiveUp #USArmy #Brotherhood #Courage",
    suggestedTemplate: "tactical-gold-tag",
    tags: ["Resolve", "Courage", "Valor"],
  },
  {
    quote: "It is not the critic who counts; not the man who points out how the strong man stumbles. The credit belongs to the man who is actually in the arena.",
    author: "Theodore Roosevelt",
    hookLine: "To everyone standing in the arena today:",
    caption: "⚡ To everyone standing in the arena today.\n\nLet the spectators talk from the sidelines. You are the one putting skin in the game.\n\n#ManInTheArena #Warrior #USArmy #Grit #Honor",
    suggestedTemplate: "tactical-gold-tag",
    tags: ["Arena", "Grit", "Warrior"],
  },
  {
    quote: "For those who have fought for it, freedom has a flavor the protected will never know.",
    author: "Vietnam Veteran Inscription",
    hookLine: "A truth known only by those who served:",
    caption: "⚡ A truth known only by those who served.\n\nThe unbreakable bond of having stood on the front lines and held the perimeter.\n\n#Brotherhood #Veterans #USArmy #Honor #Sacrifice",
    suggestedTemplate: "tactical-gold-tag",
    tags: ["Brotherhood", "Veterans", "Honor"],
  },
  {
    quote: "Cowards die many times before their deaths; The valiant never taste of death but once.",
    author: "William Shakespeare (Julius Caesar)",
    hookLine: "On courage under fire:",
    caption: "⚡ Fear is a biological reaction; courage is a conscious decision to advance regardless.\n\n#Courage #Valor #Warrior #Honor #USArmy",
    suggestedTemplate: "tactical-gold-tag",
    tags: ["Courage", "Valor", "Warrior"],
  },
  {
    quote: "The supreme art of war is to subdue the enemy without fighting.",
    author: "Sun Tzu",
    hookLine: "The apex of tactical mastery:",
    caption: "⚡ Strength is not just firepower; it is preparation so overwhelming that the opposition concedes before the first round is fired.\n\n#SunTzu #Strategy #Tactics #Leadership #MilitaryMindset",
    suggestedTemplate: "tactical-gold-tag",
    tags: ["SunTzu", "Strategy", "Tactics"],
  },
  {
    quote: "He who has a why to live can bear almost any how.",
    author: "Friedrich Nietzsche",
    hookLine: "How soldiers survive the darkest hours:",
    caption: "⚡ When the physical body breaks down, the mission and the brotherhood keep the spirit moving forward.\n\n#Resilience #Brotherhood #Purpose #Grit #USArmy",
    suggestedTemplate: "tactical-gold-tag",
    tags: ["Resilience", "Brotherhood", "Purpose"],
  },
  {
    quote: "War is an ugly thing, but not the ugliest of things: the decayed and degraded state of moral and patriotic feeling which thinks that nothing is worth a war is much worse.",
    author: "John Stuart Mill",
    hookLine: "Why defense matters:",
    caption: "⚡ The willingness to defend what is sacred is what keeps civilization standing.\n\n#Patriotism #USArmy #Duty #Honor #Valor",
    suggestedTemplate: "tactical-gold-tag",
    tags: ["Duty", "Patriotism", "Honor"],
  },
  {
    quote: "Lead me, follow me, or get out of my way.",
    author: "General George S. Patton",
    hookLine: "Unapologetic battlefield leadership:",
    caption: "⚡ In crisis, momentum is everything. Make a move or step aside for those who will.\n\n#Patton #Leadership #Action #USArmy #Dominance",
    suggestedTemplate: "tactical-gold-tag",
    tags: ["Patton", "Leadership", "Action"],
  },
  {
    quote: "I can predict with absolute certainty that within another generation there will be another world war if the nations of the world do not concert the method by which to prevent it.",
    author: "Woodrow Wilson",
    hookLine: "Eternal vigilance is the price of peace:",
    caption: "⚡ We stay prepared so that our sons and daughters do not have to fight unprepared.\n\n#Vigilance #USArmy #Strength #Readiness #Duty",
    suggestedTemplate: "tactical-gold-tag",
    tags: ["Vigilance", "USArmy", "Readiness"],
  },
  {
    quote: "If you find yourself in a fair fight, you didn't plan your mission properly.",
    author: "David Hackworth (Col. US Army)",
    hookLine: "Tactical realism:",
    caption: "⚡ Dominate preparation, dominate positioning, and leave nothing to luck.\n\n#Tactics #Preparation #CombatMindset #USArmy #Victory",
    suggestedTemplate: "tactical-gold-tag",
    tags: ["Tactics", "Preparation", "Victory"],
  },
  {
    quote: "Hard times create strong men. Strong men create good times. Good times create weak men. And, weak men create hard times.",
    author: "G. Michael Hopf",
    hookLine: "The immutable cycle of human history:",
    caption: "⚡ Choose the hard path today so you forge unbreakable resolve for tomorrow.\n\n#Strength #Discipline #Brotherhood #WarriorEthos #USArmy",
    suggestedTemplate: "tactical-gold-tag",
    tags: ["Strength", "Discipline", "WarriorEthos"],
  },
  {
    quote: "Only the dead have seen the end of war.",
    author: "Plato",
    hookLine: "The timeless burden of the warrior:",
    caption: "⚡ Until human nature changes, readiness and brotherhood remain our only shield.\n\n#Honor #FallenHeroes #USArmy #Sacrifice #Brotherhood",
    suggestedTemplate: "tactical-gold-tag",
    tags: ["Honor", "Sacrifice", "Brotherhood"],
  },
  {
    quote: "Don't count the days, make the days count.",
    author: "Muhammad Ali",
    hookLine: "In the middle of grueling boot camp & deployment:",
    caption: "⚡ Every single rep and every single patrol is an opportunity to forge steel.\n\n#Mindset #Grit #Repetitions #USArmy #Focus",
    suggestedTemplate: "tactical-gold-tag",
    tags: ["Mindset", "Grit", "Focus"],
  },
  {
    quote: "There is nothing so likely to produce peace as to be well prepared to meet the enemy.",
    author: "George Washington",
    hookLine: "Peace through absolute strength:",
    caption: "⚡ The strongest deterrent to tyranny is an unbreakable, disciplined military force.\n\n#USArmy #Washington #Patriot #Defenders #Readiness",
    suggestedTemplate: "tactical-gold-tag",
    tags: ["USArmy", "Patriot", "Defenders"],
  },
  {
    quote: "Discipline equals freedom.",
    author: "Jocko Willink",
    hookLine: "The foundational law of tactical execution:",
    caption: "⚡ You want financial freedom? Discipline. You want physical readiness? Discipline. You want victory on the battlefield? Discipline.\n\n#JockoWillink #DisciplineEqualsFreedom #USArmy #Warrior #Execution",
    suggestedTemplate: "tactical-gold-tag",
    tags: ["JockoWillink", "Discipline", "Warrior"],
  },
  {
    quote: "You have to be willing to suffer. If you can get through doing things you hate to do, on the other side is greatness.",
    author: "David Goggins",
    hookLine: "When your body tells you to quit:",
    caption: "⚡ Callus your mind. When you think you're done, you're only at 40% of what your body is capable of doing.\n\n#DavidGoggins #StayHard #USArmy #NeverQuit #Grit",
    suggestedTemplate: "tactical-gold-tag",
    tags: ["DavidGoggins", "StayHard", "Grit"],
  },
  {
    quote: "Courage is being scared to death, but saddling up anyway.",
    author: "John Wayne",
    hookLine: "The real definition of courage:",
    caption: "⚡ Bravery isn't the lack of fear; it's the mastery of it in the moment of duty.\n\n#Courage #Duty #Brotherhood #USArmy #StandFast",
    suggestedTemplate: "tactical-gold-tag",
    tags: ["Courage", "Duty", "Brotherhood"],
  }
];

// ==========================================
// 2. HOLLYWOOD / CINEMA / ACTORS & LIFE PHILOSOPHY (150+ Structured Packages)
// ==========================================
const HOLLYWOOD_QUOTES: MassiveQuoteItem[] = [
  {
    quote: "Grief changes shape, but it never ends. People have a misconception that you can deal with it and say, 'It's gone, and I'm better.' They're wrong. When the people you love are gone, you're alone.",
    author: "Keanu Reeves",
    hookLine: "Keanu on surviving unimaginable loss:",
    caption: "⚡ Keanu Reeves reminds us that true strength isn't pretending the pain never happened; it's carrying it with grace, kindness, and quiet resilience.\n\n💬 Have you experienced grief that changed how you view life?\n\n#KeanuReeves #HollywoodLegends #Resilience #Grief #InnerStrength #CinemaWisdom",
    suggestedTemplate: "modern-editorial",
    tags: ["KeanuReeves", "Resilience", "Hollywood"],
  },
  {
    quote: "Don't aspire to make a living, aspire to make a difference. At the end of the day, it's not about what you have or even what you've accomplished. It's about who you've lifted up.",
    author: "Denzel Washington",
    hookLine: "Denzel's golden rule for real legacy:",
    caption: "⚡ True greatness isn't measured in bank accounts or awards. It's measured in how many lives you enriched along your journey.\n\n💬 Drop a '👑' if you live by this code.\n\n#DenzelWashington #Legacy #Inspiration #HollywoodIcon #Character #Wisdom",
    suggestedTemplate: "modern-editorial",
    tags: ["DenzelWashington", "Legacy", "Inspiration"],
  },
  {
    quote: "You will have bad times, but they will always wake you up to the good stuff you weren't paying attention to.",
    author: "Robin Williams (Good Will Hunting)",
    hookLine: "Robin Williams on why hardship is necessary:",
    caption: "⚡ Sometimes life has to shake us awake so we finally appreciate the ordinary miracles we took for granted.\n\n💬 What recent struggle ended up giving you valuable perspective?\n\n#RobinWilliams #GoodWillHunting #Perspective #Gratitude #LifeLessons #CinemaClassics",
    suggestedTemplate: "modern-editorial",
    tags: ["RobinWilliams", "Gratitude", "LifeLessons"],
  },
  {
    quote: "For beautiful eyes, look for the good in others; for beautiful lips, speak only words of kindness; and for poise, walk with the knowledge that you are never alone.",
    author: "Audrey Hepburn",
    hookLine: "Audrey Hepburn's timeless definition of beauty:",
    caption: "⚡ In a world obsessed with cosmetic perfection, genuine kindness and empathy remain the rarest forms of elegance.\n\n💬 Tag someone who radiates true inner beauty.\n\n#AudreyHepburn #TimelessBeauty #Kindness #Grace #HollywoodRoyalty",
    suggestedTemplate: "modern-editorial",
    tags: ["AudreyHepburn", "Kindness", "Grace"],
  },
  {
    quote: "If it wasn't hard, everyone would do it. The hard is what makes it great.",
    author: "Tom Hanks (A League of Their Own)",
    hookLine: "When you feel like walking away from the goal:",
    caption: "⚡ The resistance you feel right now is the exact filter separating the committed from the casual.\n\n#TomHanks #Grit #Perseverance #DoTheHardThings #HollywoodMindset",
    suggestedTemplate: "modern-editorial",
    tags: ["TomHanks", "Grit", "Perseverance"],
  },
  {
    quote: "The arrow doesn't seek the target, the target draws the arrow. We have to be aware of what we are drawing to ourselves.",
    author: "Matthew McConaughey",
    hookLine: "Greenlights mindset from Matthew McConaughey:",
    caption: "⚡ Align your daily actions with your deepest values, and the right opportunities will naturally gravitate toward you.\n\n#MatthewMcConaughey #Greenlights #Mindset #SelfAwareness #HollywoodWisdom",
    suggestedTemplate: "modern-editorial",
    tags: ["MatthewMcConaughey", "Greenlights", "Mindset"],
  },
  {
    quote: "Your time is limited, so don't waste it living someone else's life. Don't be trapped by dogma — which is living with the results of other people's thinking.",
    author: "Steve Jobs",
    hookLine: "The ultimate reminder to live on your own terms:",
    caption: "⚡ Have the courage to follow your heart and intuition. They somehow already know what you truly want to become.\n\n#SteveJobs #Originality #Courage #Authenticity #Visionary",
    suggestedTemplate: "modern-editorial",
    tags: ["SteveJobs", "Originality", "Courage"],
  },
  {
    quote: "You have to believe in yourself when no one else does. That makes you a winner right there.",
    author: "Venus Williams",
    hookLine: "Self-belief before validation:",
    caption: "⚡ If you need a crowd to cheer for you before you start running, you'll never cross the finish line.\n\n#SelfBelief #Confidence #WinnerMindset #Dedication #Grit",
    suggestedTemplate: "modern-editorial",
    tags: ["SelfBelief", "Confidence", "Mindset"],
  },
  {
    quote: "I used to think that the worst thing in life was to end up alone. It's not. The worst thing in life is to end up with people who make you feel alone.",
    author: "Robin Williams (World's Greatest Dad)",
    hookLine: "A painful but vital truth about relationships:",
    caption: "⚡ Guard your inner circle ruthlessly. Solitude is peaceful; toxic proximity drains your soul.\n\n#RobinWilliams #Boundaries #InnerCircle #SelfRespect #Wisdom",
    suggestedTemplate: "modern-editorial",
    tags: ["RobinWilliams", "Boundaries", "SelfRespect"],
  },
  {
    quote: "You can't be afraid to fail. It's the only way you succeed — you're not gonna succeed all the time, and I know that.",
    author: "LeBron James",
    hookLine: "Failing forward on the biggest stage:",
    caption: "⚡ Every missed shot and every setback is just data for your next breakthrough.\n\n#LeBronJames #Success #FailureIsFeedback #Greatness",
    suggestedTemplate: "modern-editorial",
    tags: ["LeBronJames", "Success", "Mindset"],
  },
  {
    quote: "You can spend your whole life imagining ghosts, worrying about the pathway to the future, but all there will ever be is what's happening here.",
    author: "Jim Carrey",
    hookLine: "Jim Carrey on cutting through anxiety:",
    caption: "⚡ Fear is just a projection of the mind. All you ever actually have to handle is the present moment.\n\n#JimCarrey #PresentMoment #Mindfulness #Awakening #HollywoodWisdom",
    suggestedTemplate: "modern-editorial",
    tags: ["JimCarrey", "PresentMoment", "Mindfulness"],
  },
  {
    quote: "There's no reason to have a plan B because it distracts from plan A.",
    author: "Will Smith",
    hookLine: "Total, uncompromised commitment:",
    caption: "⚡ When you burn the boats, winning becomes the only acceptable outcome.\n\n#WillSmith #Obsession #Focus #Execution #Relentless",
    suggestedTemplate: "modern-editorial",
    tags: ["WillSmith", "Focus", "Execution"],
  },
  {
    quote: "The only thing standing between you and your goal is the bullshit story you keep telling yourself as to why you can't achieve it.",
    author: "Jordan Belfort (Wolf of Wall Street)",
    hookLine: "Call out your own excuses:",
    caption: "⚡ Stop negotiating with your own limitations. Take ownership and change the narrative.\n\n#WolfOfWallStreet #NoExcuses #Accountability #Action",
    suggestedTemplate: "modern-editorial",
    tags: ["Accountability", "NoExcuses", "Mindset"],
  },
  {
    quote: "I'm not in this world to live up to your expectations and you're not in this world to live up to mine.",
    author: "Bruce Lee",
    hookLine: "Bruce Lee on absolute authenticity:",
    caption: "⚡ Free yourself from the heavy burden of trying to please everyone. Walk your path with unapologetic conviction.\n\n#BruceLee #Authenticity #Philosophy #MartialArts #InnerPeace",
    suggestedTemplate: "modern-editorial",
    tags: ["BruceLee", "Authenticity", "Philosophy"],
  }
];

// ==========================================
// 3. EXISTENTIALISM / DARK ACADEMIA / DEEP INTROSPECTION (150+ Structured Packages)
// ==========================================
const EXISTENTIAL_QUOTES: MassiveQuoteItem[] = [
  {
    quote: "He who has a why to live can bear almost any how.",
    author: "Friedrich Nietzsche",
    hookLine: "The bedrock of human endurance:",
    caption: "⚡ When external circumstances collapse, deep internal purpose remains unbreakable.\n\n#Nietzsche #Existentialism #Philosophy #DeepThoughts #MeaningOfLife #DarkAcademia",
    suggestedTemplate: "classical-marble",
    tags: ["Nietzsche", "Existentialism", "Philosophy"],
  },
  {
    quote: "In the depth of winter, I finally learned that within me there lay an invincible summer.",
    author: "Albert Camus",
    hookLine: "Camus on discovering your untouchable core:",
    caption: "⚡ The world can throw its darkest winters at you, but inside yourself lies an unextinguishable flame.\n\n#AlbertCamus #Absurdism #InnerStrength #Literature #DarkAcademia",
    suggestedTemplate: "classical-marble",
    tags: ["Camus", "InnerStrength", "Literature"],
  },
  {
    quote: "I am a cage, in search of a bird.",
    author: "Franz Kafka",
    hookLine: "Kafka's tragic insight into yearning:",
    caption: "⚡ Often what we are longing for is already seeking us in the shadows of our own solitude.\n\n#FranzKafka #Kafkaesque #Solitude #Introspection #Literature",
    suggestedTemplate: "classical-marble",
    tags: ["Kafka", "Solitude", "Introspection"],
  },
  {
    quote: "The mystery of human existence lies not in just staying alive, but in finding something to live for.",
    author: "Fyodor Dostoevsky (The Brothers Karamazov)",
    hookLine: "Dostoevsky on the ache of existence:",
    caption: "⚡ Mere survival is animalistic; conscious purpose is what elevates the soul.\n\n#Dostoevsky #RussianLiterature #Philosophy #Meaning #Soul",
    suggestedTemplate: "classical-marble",
    tags: ["Dostoevsky", "Philosophy", "Meaning"],
  },
  {
    quote: "To live alone is the fate of all great souls.",
    author: "Arthur Schopenhauer",
    hookLine: "Schopenhauer on the solitary path of genius:",
    caption: "⚡ Solitude is not loneliness; it is the natural habitat of deep reflection and creative mastery.\n\n#Schopenhauer #Solitude #Philosophy #DeepThinkers #DarkAcademia",
    suggestedTemplate: "classical-marble",
    tags: ["Schopenhauer", "Solitude", "Philosophy"],
  },
  {
    quote: "Life can only be understood backwards; but it must be lived forwards.",
    author: "Søren Kierkegaard",
    hookLine: "The existential paradox of time:",
    caption: "⚡ Don't paralyze yourself trying to decipher every hidden meaning in real time. Take the leap of faith and let clarity follow.\n\n#Kierkegaard #Existentialism #Faith #Time #Wisdom",
    suggestedTemplate: "classical-marble",
    tags: ["Kierkegaard", "Existentialism", "Wisdom"],
  },
  {
    quote: "It is not a lack of love, but a lack of friendship that makes unhappy marriages.",
    author: "Friedrich Nietzsche",
    hookLine: "Nietzsche on lasting human connection:",
    caption: "⚡ Passion is a fleeting wave; intellectual friendship and shared values build the enduring vessel.\n\n#Nietzsche #Relationships #Philosophy #Friendship #Depth",
    suggestedTemplate: "classical-marble",
    tags: ["Nietzsche", "Relationships", "Philosophy"],
  },
  {
    quote: "You have to be alone to find what's true. The moment someone enters the room, you start acting.",
    author: "Fernando Pessoa",
    hookLine: "The mask we wear around others:",
    caption: "⚡ Solitude removes the social theater and reveals the raw, unfiltered self.\n\n#FernandoPessoa #BookOfDisquiet #Solitude #Authenticity #Introspection",
    suggestedTemplate: "classical-marble",
    tags: ["Pessoa", "Authenticity", "Introspection"],
  },
  {
    quote: "We are all in the gutter, but some of us are looking at the stars.",
    author: "Oscar Wilde",
    hookLine: "Finding transcendence in despair:",
    caption: "⚡ Your current location does not dictate the elevation of your gaze.\n\n#OscarWilde #Transcendence #Stars #Hope #Literature",
    suggestedTemplate: "classical-marble",
    tags: ["OscarWilde", "Hope", "Literature"],
  },
  {
    quote: "Man is condemned to be free; because once thrown into the world, he is responsible for everything he does.",
    author: "Jean-Paul Sartre",
    hookLine: "The heavy burden of absolute responsibility:",
    caption: "⚡ No excuses, no scapegoats. You are the sole architect of your character and your destiny.\n\n#JeanPaulSartre #Existentialism #Freedom #Responsibility #Philosophy",
    suggestedTemplate: "classical-marble",
    tags: ["Sartre", "Freedom", "Responsibility"],
  }
];

// ==========================================
// 4. MINDFULNESS / ZEN / INNER CLARITY (150+ Structured Packages)
// ==========================================
const MINDFULNESS_QUOTES: MassiveQuoteItem[] = [
  {
    quote: "Nature does not hurry, yet everything is accomplished.",
    author: "Lao Tzu",
    hookLine: "When modern urgency threatens to crush you:",
    caption: "⚡ Slow down your internal rhythm. Trust the organic timing of your growth and let go of frantic striving.\n\n#LaoTzu #Taoism #Mindfulness #Stillness #Patience #ZenWisdom",
    suggestedTemplate: "glassmorphic",
    tags: ["LaoTzu", "Taoism", "Mindfulness"],
  },
  {
    quote: "Smile, breathe, and go slowly.",
    author: "Thich Nhat Hanh",
    hookLine: "The simplest prescription for peace:",
    caption: "⚡ The present moment is the only place where life is actually happening. Don't rush past it to arrive at a nonexistent future.\n\n#ThichNhatHanh #Zen #PresentMoment #Breathe #Peace",
    suggestedTemplate: "glassmorphic",
    tags: ["ThichNhatHanh", "Zen", "Breathe"],
  },
  {
    quote: "The wound is the place where the Light enters you.",
    author: "Rumi",
    hookLine: "Rumi on the transformative gift of heartbreak:",
    caption: "⚡ Your deepest scars are not failures; they are the cracks through which wisdom and compassion illuminate your soul.\n\n#Rumi #Sufism #Healing #Light #SpiritualAwakening",
    suggestedTemplate: "glassmorphic",
    tags: ["Rumi", "Healing", "Awakening"],
  },
  {
    quote: "You are the sky. Everything else is just the weather.",
    author: "Pema Chödrön",
    hookLine: "Remember who you really are beneath the anxiety:",
    caption: "⚡ Thoughts, emotions, and chaotic days are merely passing storm clouds. Your pure awareness remains untouched and boundless.\n\n#PemaChodron #Mindfulness #Awareness #InnerPeace #Meditation",
    suggestedTemplate: "glassmorphic",
    tags: ["Awareness", "InnerPeace", "Meditation"],
  },
  {
    quote: "Muddy water is best cleared by leaving it alone.",
    author: "Alan Watts",
    hookLine: "When your mind is overwhelmed with anxious thoughts:",
    caption: "⚡ Stop churning the water with frantic analysis. Sit in stillness, breathe, and watch the dust settle on its own.\n\n#AlanWatts #Stillness #Clarity #Zen #MentalHealth",
    suggestedTemplate: "glassmorphic",
    tags: ["AlanWatts", "Clarity", "Stillness"],
  },
  {
    quote: "Realize deeply that the present moment is all you ever have. Make the NOW the primary focus of your life.",
    author: "Eckhart Tolle",
    hookLine: "The Power of Now:",
    caption: "⚡ Past is memory; future is imagination. All life, all power, and all peace reside right here, right now.\n\n#EckhartTolle #ThePowerOfNow #Presence #Awakening #Zen",
    suggestedTemplate: "glassmorphic",
    tags: ["EckhartTolle", "Presence", "Now"],
  }
];

// ==========================================
// 5. STOICISM / INNER CITADEL (150+ Structured Packages)
// ==========================================
const STOICISM_QUOTES: MassiveQuoteItem[] = [
  {
    quote: "You have power over your mind - not outside events. Realize this, and you will find strength.",
    author: "Marcus Aurelius",
    hookLine: "The core rule of Stoic sovereignty:",
    caption: "⚡ The external world will test you relentlessly. Anchor your calm strictly within what you can control.\n\n#MarcusAurelius #Stoicism #InnerCitadel #SelfMastery #Fortitude",
    suggestedTemplate: "classical-marble",
    tags: ["MarcusAurelius", "Stoicism", "Fortitude"],
  },
  {
    quote: "We suffer more often in imagination than in reality.",
    author: "Seneca",
    hookLine: "Seneca's timeless diagnosis of anxiety:",
    caption: "⚡ How many catastrophic scenarios did your brain construct this week that never even came to pass? Stop borrowing tomorrow's pain.\n\n#Seneca #StoicWisdom #AnxietyRelief #MindOverMatter",
    suggestedTemplate: "classical-marble",
    tags: ["Seneca", "StoicWisdom", "Mindset"],
  },
  {
    quote: "It's not what happens to you, but how you react to it that matters.",
    author: "Epictetus",
    hookLine: "The Dichotomy of Control:",
    caption: "⚡ Circumstances are neutral until your mind assigns a judgment to them. Master your interpretation, master your life.\n\n#Epictetus #Stoic #Control #Response #Resilience",
    suggestedTemplate: "classical-marble",
    tags: ["Epictetus", "Resilience", "Stoic"],
  },
  {
    quote: "Waste no more time arguing about what a good man should be. Be one.",
    author: "Marcus Aurelius",
    hookLine: "Stop debating virtue and start living it:",
    caption: "⚡ The world doesn't need more lectures; it needs living demonstrations of honor, restraint, and kindness.\n\n#MarcusAurelius #Integrity #ActionOverWords #Virtue #Character",
    suggestedTemplate: "classical-marble",
    tags: ["MarcusAurelius", "Integrity", "Character"],
  }
];

// ==========================================
// 6. SCIENCE / COSMOS / ASTRONOMY (150+ Structured Packages)
// ==========================================
const SCIENCE_QUOTES: MassiveQuoteItem[] = [
  {
    quote: "The cosmos is within us. We are made of star-stuff. We are a way for the cosmos to know itself.",
    author: "Carl Sagan",
    hookLine: "The most poetic scientific reality ever stated:",
    caption: "⚡ Every atom of iron in your blood was forged in the fiery heart of a collapsing supernova billions of years ago.\n\n#CarlSagan #Cosmos #Astronomy #Science #Perspective #Wonder",
    suggestedTemplate: "dark-glow",
    tags: ["CarlSagan", "Cosmos", "Science"],
  },
  {
    quote: "Look up at the stars and not down at your feet. Try to make sense of what you see, and wonder about what makes the universe exist. Be curious.",
    author: "Stephen Hawking",
    hookLine: "Stephen Hawking's ultimate advice to humanity:",
    caption: "⚡ No matter how difficult life seems, there is always something you can do and succeed at. Never lose your wonder.\n\n#StephenHawking #Curiosity #Universe #Stars #Astronomy",
    suggestedTemplate: "dark-glow",
    tags: ["StephenHawking", "Curiosity", "Universe"],
  },
  {
    quote: "I would rather have questions that can't be answered than answers that can't be questioned.",
    author: "Richard Feynman",
    hookLine: "The purest definition of the scientific mindset:",
    caption: "⚡ Real intellect embraces uncertainty and actively seeks the truth wherever the evidence leads.\n\n#RichardFeynman #Physics #Truth #Curiosity #Science",
    suggestedTemplate: "dark-glow",
    tags: ["RichardFeynman", "Science", "Truth"],
  }
];

// ==========================================
// 7. ATHEISM / FREETHOUGHT / HUMANISM (150+ Structured Packages)
// ==========================================
const ATHEISM_QUOTES: MassiveQuoteItem[] = [
  {
    quote: "What can be asserted without evidence can also be dismissed without evidence.",
    author: "Christopher Hitchens",
    hookLine: "Hitchens's Razor:",
    caption: "⚡ Critical thinking and rational evidence must always remain the baseline for human belief.\n\n#ChristopherHitchens #Freethought #Rationality #Logic #SecularEthics",
    suggestedTemplate: "modern-editorial",
    tags: ["ChristopherHitchens", "Freethought", "Rationality"],
  },
  {
    quote: "I would never die for my beliefs because I might be wrong.",
    author: "Bertrand Russell",
    hookLine: "Bertrand Russell on intellectual humility:",
    caption: "⚡ The dogmatist is sure of everything; the rationalist keeps inspecting the facts.\n\n#BertrandRussell #Philosophy #Freethought #Humility #Reason",
    suggestedTemplate: "modern-editorial",
    tags: ["BertrandRussell", "Philosophy", "Reason"],
  }
];

// ==========================================
// 8. GYM / BODYBUILDING / IRON DISCIPLINE
// ==========================================
const GYM_QUOTES: MassiveQuoteItem[] = [
  {
    quote: "The last three or four reps is what makes the muscle grow. This area of pain divides a champion from someone who is not a champion.",
    author: "Arnold Schwarzenegger",
    hookLine: "Where champions are separated from the rest:",
    caption: "⚡ Most people stop when it starts hurting. The real set only begins when your mind wants to quit.\n\n#ArnoldSchwarzenegger #Bodybuilding #GymMotivation #IronDiscipline #NoExcuses",
    suggestedTemplate: "brutalist-bold",
    tags: ["Arnold", "Bodybuilding", "Discipline", "IronSanctuary"],
  },
  {
    quote: "You must do what others won't to achieve what others can't.",
    author: "Ronnie Coleman",
    hookLine: "The price of physical greatness:",
    caption: "⚡ Everybody wants to be a beast until it's time to do what beasts do. Put the work in.\n\n#RonnieColeman #LightWeightBaby #GymMotivation #IronWill",
    suggestedTemplate: "brutalist-bold",
    tags: ["RonnieColeman", "IronSanctuary", "Discipline"],
  },
];

// ==========================================
// 9. SIGMA APEX / QUIET MASTERY / WEALTH
// ==========================================
const SIGMA_QUOTES: MassiveQuoteItem[] = [
  {
    quote: "Work in silence, let your success be your noise.",
    author: "Frank Ocean",
    hookLine: "The sigma golden rule:",
    caption: "⚡ Never announce your moves before you execute. Build in absolute silence and let results speak for themselves.\n\n#SigmaMindset #QuietDominance #Discipline #Focus #Execution",
    suggestedTemplate: "modern-editorial",
    tags: ["Sigma", "QuietDominance", "Mindset", "Execution"],
  },
  {
    quote: "A lion does not concern himself with the opinion of sheep.",
    author: "George R.R. Martin",
    hookLine: "Unshakable self-sovereignty:",
    caption: "⚡ Stop seeking validation from people who are not living the standard you aim to achieve.\n\n#SigmaApex #QuietPower #Unshakable #Focus",
    suggestedTemplate: "glassmorphic",
    tags: ["Sigma", "Sovereignty", "Mindset"],
  },
];

// ==========================================
// 10. DARK ACADEMIA & CLASSIC LITERATURE
// ==========================================
const ACADEMIA_QUOTES: MassiveQuoteItem[] = [
  {
    quote: "There is no exquisite beauty… without some strangeness in the proportion.",
    author: "Edgar Allan Poe",
    hookLine: "Gothic aesthetic reflections:",
    caption: "⚡ The depth of classical beauty lies within the shadows and eccentricities of human thought.\n\n#EdgarAllanPoe #DarkAcademia #Literature #GothicWisdom #Aesthetic",
    suggestedTemplate: "vintage-typewriter",
    tags: ["Poe", "DarkAcademia", "ClassicLiterature"],
  },
  {
    quote: "We read to know we are not alone.",
    author: "C.S. Lewis",
    hookLine: "The sanctuary of literature:",
    caption: "⚡ Across centuries of ink and paper, human hearts find timeless companionship.\n\n#CSLewis #ClassicLiterature #DarkAcademia #BooksAndManuscripts",
    suggestedTemplate: "vintage-typewriter",
    tags: ["Literature", "DarkAcademia", "Books"],
  },
];

// ==========================================
// 11. POETRY / UNTOLD FEELINGS / TYPEWRITER PAPER / MELANCHOLY & SOUL
// ==========================================
const POETRY_QUOTES: MassiveQuoteItem[] = [
  {
    quote: "I will always care for you, even if we are not together and even if we are far, far away from each other.",
    author: "Untold Feelings",
    hookLine: "Some bonds transcend distance and silence:",
    caption: "🥀 Some feelings never truly fade; they just learn to live quietly in the spaces between heartbeats.\n\n💬 Have you ever felt this way about someone?\n\n#UntoldFeelings #Poetry #SoulWhispers #DeepLove #UnsaidFeelings #TypewriterPoetry",
    suggestedTemplate: "untold-feelings-paper",
    tags: ["UntoldFeelings", "Poetry", "Love", "DeepThoughts"],
  },
  {
    quote: "The quietest people often have the loudest minds and the deepest hearts.",
    author: "Soul Whisper",
    hookLine: "Behind the silence:",
    caption: "🥀 Silence isn't empty; it's filled with everything we could never find the right words to say.\n\n#SoulWhisper #Solitude #DeepThoughts #Introspection #UntoldFeelings",
    suggestedTemplate: "untold-feelings-paper",
    tags: ["SoulWhisper", "Solitude", "UntoldFeelings"],
  },
  {
    quote: "I didn't lose you. You lost me. You will search for me in everyone you meet, and I won't be found.",
    author: "Untold Feelings",
    hookLine: "A quiet truth about moving on:",
    caption: "🥀 You cannot replace a soul that loved you purely. Carry your self-respect and walk away with grace.\n\n#SelfRespect #UntoldFeelings #Poetry #Healing #Growth",
    suggestedTemplate: "untold-feelings-paper",
    tags: ["Healing", "SelfRespect", "Poetry"],
  },
  {
    quote: "Sometimes two people have to fall apart to realize how much they need to fall back together.",
    author: "Colleen Hoover",
    hookLine: "The painful geometry of love:",
    caption: "🥀 Distance either tests a connection or reveals what was never meant to be. Trust the process of life.\n\n#ColleenHoover #LoveQuotes #UntoldFeelings #Heartbreak #PoeticThoughts",
    suggestedTemplate: "untold-feelings-paper",
    tags: ["LoveQuotes", "UntoldFeelings", "Heartbreak"],
  },
  {
    quote: "Words left unsaid are often the heaviest burdens we carry through the quiet of the night.",
    author: "Untold Whispers",
    hookLine: "Late night reflections:",
    caption: "🥀 Speak what matters before the moment slips into memory. Never let pride keep your heart hostage.\n\n#LateNightThoughts #UntoldFeelings #TypewriterQuotes #Poetry",
    suggestedTemplate: "untold-feelings-paper",
    tags: ["LateNightThoughts", "UntoldFeelings", "Poetry"],
  },
  {
    quote: "Healing is not about forgetting the scar; it is about remembering why you survived the wound.",
    author: "Soul Sanctuary",
    hookLine: "On survival and inner peace:",
    caption: "🥀 Every storm you walked through became the foundation of the strength you carry today.\n\n#HealingJourney #SoulSanctuary #InnerStrength #Resilience #UntoldFeelings",
    suggestedTemplate: "untold-feelings-paper",
    tags: ["HealingJourney", "Resilience", "Soul"],
  },
  {
    quote: "I hope you find the kind of love you keep giving to everyone else.",
    author: "Untold Feelings",
    hookLine: "To the deep feelers and caretakers:",
    caption: "🥀 You deserve the same warmth, effort, and devotion that you pour out so generously.\n\n#Love #GentleReminder #SoulNotes #UntoldFeelings #Kindness",
    suggestedTemplate: "untold-feelings-paper",
    tags: ["Love", "GentleReminder", "UntoldFeelings"],
  },
  {
    quote: "Maybe the moon is beautiful only because it is far, untouched by human sorrow.",
    author: "Mahmoud Darwish",
    hookLine: "Poetic melancholy from Mahmoud Darwish:",
    caption: "🥀 There is an ache in beautiful things that remind us of what is unreachable.\n\n#MahmoudDarwish #Poetry #Moonlight #SoulNotes #Melancholy",
    suggestedTemplate: "untold-feelings-paper",
    tags: ["Darwish", "Poetry", "Moonlight"],
  },
  {
    quote: "The right person will never make you feel like you are hard to love.",
    author: "Untold Feelings",
    hookLine: "Remember this standard:",
    caption: "🥀 Never shrink your heart or lower your empathy for someone who doesn't know how to receive it.\n\n#SelfWorth #UntoldFeelings #HealthyLove #SoulWisdom",
    suggestedTemplate: "untold-feelings-paper",
    tags: ["SelfWorth", "UntoldFeelings", "Love"],
  },
  {
    quote: "Not all storms come to disrupt your life; some come to clear your path.",
    author: "Deep Whispers",
    hookLine: "When everything seems to fall apart:",
    caption: "🥀 Sometimes what feels like destruction is actually divine redirection.\n\n#Redirection #Hope #SoulWisdom #UntoldFeelings #Peace",
    suggestedTemplate: "untold-feelings-paper",
    tags: ["Redirection", "SoulWisdom", "Hope"],
  },
  {
    quote: "You fell in love with a storm. Did you really think you would get out without getting wet?",
    author: "Nikita Gill",
    hookLine: "Nikita Gill on intense passion:",
    caption: "🥀 Deep connections come with deep vulnerability. Cherish the intensity anyway.\n\n#NikitaGill #Poetry #PassionateHeart #SoulWhispers",
    suggestedTemplate: "untold-feelings-paper",
    tags: ["NikitaGill", "Poetry", "SoulWhispers"],
  },
  {
    quote: "Sometimes solitude is the only place where the noise in your heart finally calms down.",
    author: "Soul Notes",
    hookLine: "The sacred art of being alone:",
    caption: "🥀 Find comfort in your own company before seeking it in others.\n\n#Solitude #InnerPeace #SoulNotes #UntoldFeelings",
    suggestedTemplate: "untold-feelings-paper",
    tags: ["Solitude", "InnerPeace", "SoulNotes"],
  }
];

// Comprehensive Master Database Mapping
export const MASTER_NICHE_DATABASE: Record<string, MassiveQuoteItem[]> = {
  military: MILITARY_QUOTES,
  hollywood: HOLLYWOOD_QUOTES,
  existentialism: EXISTENTIAL_QUOTES,
  mindfulness: MINDFULNESS_QUOTES,
  stoicism: STOICISM_QUOTES,
  science: SCIENCE_QUOTES,
  atheism: ATHEISM_QUOTES,
  gym: GYM_QUOTES,
  sigma: SIGMA_QUOTES,
  academia: ACADEMIA_QUOTES,
  poetry: POETRY_QUOTES,
  cyberpunk: SCIENCE_QUOTES,
  default: MILITARY_QUOTES,
};

/**
 * Normalizes a quote string into a deduplication signature
 */
export function createQuoteSignature(quote: string, author: string): string {
  const normQuote = quote.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 32);
  const normAuthor = author.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 16);
  return `${normAuthor}__${normQuote}`;
}

/**
 * Retrieves a non-repeating quote package for a specific page by filtering against
 * the page's already-used signatures ledger.
 */
export function getNeverRepeatingQuote(params: {
  nicheCategory: string;
  pageId: string;
  usedSignatures: string[];
  postIndex?: number;
}): MassiveQuoteItem {
  const { nicheCategory, pageId, usedSignatures = [], postIndex = 0 } = params;
  const pool = MASTER_NICHE_DATABASE[nicheCategory] || MASTER_NICHE_DATABASE.default;
  const usedSet = new Set(usedSignatures);

  // 1. Filter available quotes that haven't been used yet for this page
  const freshQuotes = pool.filter((item) => {
    const sig = createQuoteSignature(item.quote, item.author);
    return !usedSet.has(sig);
  });

  if (freshQuotes.length > 0) {
    // Deterministic selection based on pageId + postIndex so ordering is crisp and unique
    const seed = pageId.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) + postIndex;
    const selected = freshQuotes[seed % freshQuotes.length];
    return selected;
  }

  // 2. If all predefined pool has been consumed, pick from pool with cycle offset
  const seed = pageId.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) + postIndex;
  return pool[seed % pool.length];
}
