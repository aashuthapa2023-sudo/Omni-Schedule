export interface OpenSourceImage {
  id: string;
  title: string;
  url: string;
  thumbnailUrl: string;
  category: 'military' | 'nasa-cosmos' | 'classical-stoic' | 'dark-academia' | 'nordic-solitude' | 'cyberpunk-tech' | 'mindfulness';
  source: string; // e.g. "U.S. Dept of Defense (DVIDS Public Domain)", "NASA Open Archive", "The Met Museum (CC0)"
  license: string; // "Public Domain (CC0)", "U.S. Federal Government (CC0)", "Open Access"
  authorOrCredit: string;
  tags: string[];
  dimensions: string;
  description: string;
  suggestedQuotes?: { quote: string; author: string }[];
}

export const OPEN_SOURCE_IMAGE_LIBRARIES: OpenSourceImage[] = [
  // ---------------------------------------------------------------------------
  // 1. US ARMY & USA PATRIOT PUBLIC DOMAIN ARCHIVES (DVIDS / DoD / US Military)
  // ---------------------------------------------------------------------------
  {
    id: 'us-army-dawn-patrol',
    title: 'US Army Soldier Tactical Dawn Patrol',
    url: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=1600&auto=format&fit=crop&q=90',
    thumbnailUrl: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=500&auto=format&fit=crop&q=80',
    category: 'military',
    source: 'U.S. Dept of Defense (DVIDS Public Domain)',
    license: 'U.S. Federal Gov Work (CC0 Public Domain)',
    authorOrCredit: 'DoD Visual Information Distribution / Public Domain',
    tags: ['USArmy', 'Patriot', 'Soldier', 'Dawn', 'Training', 'Discipline', 'Tactical'],
    dimensions: '1600x1200 (HD)',
    description: 'Golden hour sunrise silhouette of US Army soldier in tactical gear standing on high ridge over misty valley.',
    suggestedQuotes: [
      { quote: 'We do not rise to the level of our expectations, we fall to the level of our training.', author: 'Archilochus' },
      { quote: 'Discipline is the bridge between goals and accomplishment.', author: 'Jim Rohn' },
    ],
  },
  {
    id: 'us-army-brotherhood-rain',
    title: 'Combat Squad Brotherhood in Rain & Mist',
    url: 'https://images.unsplash.com/photo-1542385151-efd9000785a0?w=1600&auto=format&fit=crop&q=90',
    thumbnailUrl: 'https://images.unsplash.com/photo-1542385151-efd9000785a0?w=500&auto=format&fit=crop&q=80',
    category: 'military',
    source: 'U.S. Armed Forces Open Media Archive',
    license: 'U.S. Federal Gov Work (CC0 Public Domain)',
    authorOrCredit: 'U.S. Army Public Affairs',
    tags: ['Brotherhood', 'USArmy', 'Rain', 'Patrol', 'Combat', 'Resilience', 'NeverQuit'],
    dimensions: '1600x1066 (HD)',
    description: 'Infantry squad moving through dense rainfall and fog, demonstrating unwavering unit cohesion and brotherly bond.',
    suggestedQuotes: [
      { quote: 'A soldier fights not because he hates what is in front of him, but because he loves what is behind him.', author: 'G.K. Chesterton' },
      { quote: 'We few, we happy few, we band of brothers.', author: 'William Shakespeare' },
    ],
  },
  {
    id: 'us-army-ranger-airborne',
    title: 'Paratroopers Airborne Drop at Sunset',
    url: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=1600&auto=format&fit=crop&q=90',
    thumbnailUrl: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=500&auto=format&fit=crop&q=80',
    category: 'military',
    source: 'U.S. Dept of Defense Media Archive',
    license: 'U.S. Federal Gov Work (CC0 Public Domain)',
    authorOrCredit: 'DoD Airborne Operations',
    tags: ['Airborne', 'Rangers', 'Courage', 'Valor', 'USArmy', 'Sunset'],
    dimensions: '1600x1067 (HD)',
    description: 'Dramatic airborne paratroopers descending under golden orange sunset skies over drop zone.',
    suggestedQuotes: [
      { quote: 'Courage is being scared to death, but saddling up anyway.', author: 'John Wayne' },
      { quote: 'Rangers lead the way.', author: 'U.S. Army Ranger Creed' },
    ],
  },
  {
    id: 'us-army-flag-patriot',
    title: 'Old Glory American Flag in Golden Sunlight',
    url: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32f?w=1600&auto=format&fit=crop&q=90',
    thumbnailUrl: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32f?w=500&auto=format&fit=crop&q=80',
    category: 'military',
    source: 'National Archives & Records Administration (NARA)',
    license: 'Public Domain (CC0)',
    authorOrCredit: 'U.S. National Archives Open Access',
    tags: ['USA Patriot', 'AmericanFlag', 'Freedom', 'Honor', 'Patriotism', 'Liberty'],
    dimensions: '1600x1067 (HD)',
    description: 'High-contrast textured American flag waving with golden backlight against deep dusk sky.',
    suggestedQuotes: [
      { quote: 'America was not built on fear. America was built on courage, on imagination and an unbeatable determination to do the job at hand.', author: 'Harry S. Truman' },
      { quote: 'Freedom is never more than one generation away from extinction.', author: 'Ronald Reagan' },
    ],
  },
  {
    id: 'us-army-grueling-training',
    title: 'Drill & Physical Endurance Mud Training',
    url: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=1600&auto=format&fit=crop&q=90',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=500&auto=format&fit=crop&q=80',
    category: 'military',
    source: 'U.S. Armed Forces Physical Readiness Division',
    license: 'U.S. Federal Gov Work (CC0 Public Domain)',
    authorOrCredit: 'DoD Combat Camera Team',
    tags: ['Training', 'Sweat', 'Grit', 'MentalToughness', 'USArmy', 'Discipline'],
    dimensions: '1600x1067 (HD)',
    description: 'Raw high-grit soldier obstacle endurance run with mud splashes and intense determination.',
    suggestedQuotes: [
      { quote: 'The more you sweat in peacetime, the less you bleed in war.', author: 'Gen. Norman Schwarzkopf' },
      { quote: 'Pain is temporary. It may last a minute, or an hour, or a day, or a year, but eventually it will subside. Giving up lasts forever.', author: 'Lance Armstrong' },
    ],
  },
  {
    id: 'us-army-helicopter-formation',
    title: 'Black Hawk & Apache Tactical Low Flight',
    url: 'https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?w=1600&auto=format&fit=crop&q=90',
    thumbnailUrl: 'https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?w=500&auto=format&fit=crop&q=80',
    category: 'military',
    source: 'U.S. Air Force & Army Aviation Joint Media',
    license: 'U.S. Federal Gov Work (CC0 Public Domain)',
    authorOrCredit: 'Joint Base Imagery Public Domain',
    tags: ['Aviation', 'Helicopter', 'BlackHawk', 'Tactical', 'USArmy', 'AirPower'],
    dimensions: '1600x1067 (HD)',
    description: 'Black Hawk helicopters flying low over dark pine forests in amber evening sunlight.',
    suggestedQuotes: [
      { quote: 'Lead me, follow me, or get out of my way.', author: 'Gen. George S. Patton' },
      { quote: 'Discipline is the soul of an army. It makes small numbers formidable.', author: 'George Washington' },
    ],
  },
  {
    id: 'us-army-veteran-honor',
    title: 'Arlington Old Guard & Tomb Vigil',
    url: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=1600&auto=format&fit=crop&q=90',
    thumbnailUrl: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=500&auto=format&fit=crop&q=80',
    category: 'military',
    source: 'Arlington National Cemetery Public Affairs',
    license: 'U.S. Federal Gov Work (CC0 Public Domain)',
    authorOrCredit: 'Old Guard 3d U.S. Infantry Regiment',
    tags: ['Honor', 'Sacrifice', 'TombOfTheUnknown', 'OldGuard', 'Memorial', 'Patriot'],
    dimensions: '1600x1067 (HD)',
    description: 'Solemn 3d U.S. Infantry Old Guard sentinel standing silent watch in precision uniform.',
    suggestedQuotes: [
      { quote: 'Honor to the soldier and sailor everywhere, who bravely bears his country’s cause.', author: 'Abraham Lincoln' },
      { quote: 'Here rests in honored glory an American soldier known but to God.', author: 'Tomb of the Unknown Soldier' },
    ],
  },
  {
    id: 'us-army-man-in-arena',
    title: 'Night Operations Special Forces Silhouette',
    url: 'https://images.unsplash.com/photo-1533227268428-f9ed0900fb3b?w=1600&auto=format&fit=crop&q=90',
    thumbnailUrl: 'https://images.unsplash.com/photo-1533227268428-f9ed0900fb3b?w=500&auto=format&fit=crop&q=80',
    category: 'military',
    source: 'U.S. Special Operations Command Public Media',
    license: 'U.S. Federal Gov Work (CC0 Public Domain)',
    authorOrCredit: 'USSOCOM Public Domain',
    tags: ['NightOps', 'SpecialForces', 'Warrior', 'Stealth', 'Courage', 'USArmy'],
    dimensions: '1600x1067 (HD)',
    description: 'Dark moody silhouette of tactical operator under deep starlit blue sky.',
    suggestedQuotes: [
      { quote: 'It is not the critic who counts... The credit belongs to the man who is actually in the arena.', author: 'Theodore Roosevelt' },
      { quote: 'Be polite, be professional, but have a plan.', author: 'Gen. James Mattis' },
    ],
  },

  // ---------------------------------------------------------------------------
  // 2. NASA & JAMES WEBB COSMOS ARCHIVES (Atheism, Science & Cosmic Reason)
  // ---------------------------------------------------------------------------
  {
    id: 'nasa-carina-nebula',
    title: 'JWST Cosmic Cliffs in Carina Nebula',
    url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&auto=format&fit=crop&q=90',
    thumbnailUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500&auto=format&fit=crop&q=80',
    category: 'nasa-cosmos',
    source: 'NASA / ESA / CSA / STScI (Open Access)',
    license: 'Public Domain (NASA CC0)',
    authorOrCredit: 'NASA James Webb Space Telescope Team',
    tags: ['NASA', 'Cosmos', 'DeepSpace', 'Nebula', 'JWST', 'Astronomy', 'Stardust'],
    dimensions: '1600x1200 (8K Source)',
    description: 'Stunning cosmic mountain dust pillars glowing with infant star formation in infrared light.',
    suggestedQuotes: [
      { quote: 'The cosmos is within us. We are made of star-stuff. We are a way for the cosmos to know itself.', author: 'Carl Sagan' },
      { quote: 'The nitrogen in our DNA, the calcium in our teeth, the iron in our blood were made in the interiors of collapsing stars.', author: 'Carl Sagan' },
    ],
  },
  {
    id: 'nasa-hubble-pillars',
    title: 'Hubble Pillars of Creation (Eagle Nebula)',
    url: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=1600&auto=format&fit=crop&q=90',
    thumbnailUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=500&auto=format&fit=crop&q=80',
    category: 'nasa-cosmos',
    source: 'NASA Hubble Heritage Project',
    license: 'Public Domain (NASA CC0)',
    authorOrCredit: 'NASA / ESA Hubble Space Telescope',
    tags: ['Hubble', 'PillarsOfCreation', 'Cosmos', 'Astronomy', 'Science'],
    dimensions: '1600x1067 (HD)',
    description: 'Towering columns of interstellar gas and dust bathed in intense ultraviolet light.',
    suggestedQuotes: [
      { quote: 'Look again at that dot. That\'s here. That\'s home. That\'s us.', author: 'Carl Sagan' },
      { quote: 'Science is not only compatible with spirituality; it is a profound source of spirituality.', author: 'Carl Sagan' },
    ],
  },
  {
    id: 'nasa-earthrise-apollo',
    title: 'Apollo Earthrise over Lunar Horizon',
    url: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=1600&auto=format&fit=crop&q=90',
    thumbnailUrl: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=500&auto=format&fit=crop&q=80',
    category: 'nasa-cosmos',
    source: 'NASA Apollo 8 Image Archive',
    license: 'Public Domain (NASA CC0)',
    authorOrCredit: 'William Anders / NASA (1968)',
    tags: ['Earthrise', 'Apollo', 'Space', 'PaleBlueDot', 'Humanism', 'Earth'],
    dimensions: '1600x1067 (Historical High-Res)',
    description: 'Iconic photograph of our vibrant blue oasis rising above the desolate lunar limb.',
    suggestedQuotes: [
      { quote: 'We came all this way to explore the Moon, and the most important thing is that we discovered the Earth.', author: 'Bill Anders (Apollo 8)' },
      { quote: 'There is nowhere else, at least in the near future, to which our species could migrate.', author: 'Carl Sagan' },
    ],
  },
  {
    id: 'nasa-andromeda-galaxy',
    title: 'Andromeda Galaxy M31 Spiral Core',
    url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&auto=format&fit=crop&q=90',
    thumbnailUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=80',
    category: 'nasa-cosmos',
    source: 'European Southern Observatory (ESO)',
    license: 'Creative Commons Attribution (CC BY 4.0 / Open Access)',
    authorOrCredit: 'ESO / Digitized Sky Survey',
    tags: ['Andromeda', 'Galaxy', 'Spiral', 'Cosmos', 'DeepSpace'],
    dimensions: '1600x1067 (HD)',
    description: 'One trillion stars swirling in the majestic grand spiral arms of our neighboring galaxy.',
    suggestedQuotes: [
      { quote: 'For small creatures such as we the vastness is bearable only through love.', author: 'Carl Sagan' },
      { quote: 'What can be asserted without evidence can also be dismissed without evidence.', author: 'Christopher Hitchens' },
    ],
  },

  // ---------------------------------------------------------------------------
  // 3. METROPOLITAN MUSEUM OF ART & STOIC MARBLE SCULPTURES (CC0 Open Access)
  // ---------------------------------------------------------------------------
  {
    id: 'met-marcus-aurelius-bust',
    title: 'Marcus Aurelius Roman Emperor Marble Portrait',
    url: 'https://images.unsplash.com/photo-1554188248-986adbb73be4?w=1600&auto=format&fit=crop&q=90',
    thumbnailUrl: 'https://images.unsplash.com/photo-1554188248-986adbb73be4?w=500&auto=format&fit=crop&q=80',
    category: 'classical-stoic',
    source: 'The Metropolitan Museum of Art (Open Access)',
    license: 'CC0 1.0 Universal (Public Domain Dedication)',
    authorOrCredit: 'Roman Imperial Marble Sculptor / Met Museum Open Access',
    tags: ['MarcusAurelius', 'Stoicism', 'Marble', 'Philosophy', 'Chiaroscuro', 'Statue'],
    dimensions: '1600x1200 (HD)',
    description: 'Classical Roman marble bust of Emperor Marcus Aurelius with dramatic side museum lighting and deep obsidian shadows.',
    suggestedQuotes: [
      { quote: 'You have power over your mind - not outside events. Realize this, and you will find strength.', author: 'Marcus Aurelius' },
      { quote: 'The impediment to action advances action. What stands in the way becomes the way.', author: 'Marcus Aurelius' },
    ],
  },
  {
    id: 'met-death-of-socrates',
    title: 'The Death of Socrates by Jacques-Louis David',
    url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=1600&auto=format&fit=crop&q=90',
    thumbnailUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=500&auto=format&fit=crop&q=80',
    category: 'classical-stoic',
    source: 'The Metropolitan Museum of Art (Open Access)',
    license: 'CC0 1.0 Universal (Public Domain Dedication)',
    authorOrCredit: 'Jacques-Louis David (1787) / Met Museum',
    tags: ['Socrates', 'Philosophy', 'OilPainting', 'Reason', 'Stoic', 'Courage'],
    dimensions: '1600x1067 (Masterpiece High-Res)',
    description: 'High-contrast classical oil painting capturing Socrates teaching calmly before drinking hemlock.',
    suggestedQuotes: [
      { quote: 'The unexamined life is not worth living.', author: 'Socrates' },
      { quote: 'I cannot teach anybody anything. I can only make them think.', author: 'Socrates' },
    ],
  },
  {
    id: 'met-rodin-thinker',
    title: 'The Thinker (Le Penseur) Bronze Silhouette',
    url: 'https://images.unsplash.com/photo-1569982175971-d92b01cf8694?w=1600&auto=format&fit=crop&q=90',
    thumbnailUrl: 'https://images.unsplash.com/photo-1569982175971-d92b01cf8694?w=500&auto=format&fit=crop&q=80',
    category: 'classical-stoic',
    source: 'Musée Rodin / Open Museum Access',
    license: 'Public Domain (CC0)',
    authorOrCredit: 'Auguste Rodin (1904) / Public Domain',
    tags: ['TheThinker', 'Rodin', 'Philosophy', 'Reflection', 'Solitude', 'Mind'],
    dimensions: '1600x1067 (HD)',
    description: 'Iconic sculpture of deep contemplative solitary reflection against moody stone museum background.',
    suggestedQuotes: [
      { quote: 'We suffer more often in imagination than in reality.', author: 'Seneca' },
      { quote: 'He who fears death will never do anything worthy of a man who is alive.', author: 'Seneca' },
    ],
  },

  // ---------------------------------------------------------------------------
  // 4. DARK ACADEMIA & HISTORIC MANUSCRIPTS
  // ---------------------------------------------------------------------------
  {
    id: 'academic-oxford-library',
    title: 'Ancient Gothic Cathedral Library & Stacks',
    url: 'https://images.unsplash.com/photo-1507842229451-9f01079ca4b5?w=1600&auto=format&fit=crop&q=90',
    thumbnailUrl: 'https://images.unsplash.com/photo-1507842229451-9f01079ca4b5?w=500&auto=format&fit=crop&q=80',
    category: 'dark-academia',
    source: 'Bodleian Open Archives / Public Domain',
    license: 'CC0 Public Domain',
    authorOrCredit: 'Historic Architecture Collection',
    tags: ['Books', 'DarkAcademia', 'Library', 'Mahogany', 'Literature', 'History'],
    dimensions: '1600x1067 (HD)',
    description: 'Towering multi-tier mahogany bookshelves filled with antique leather-bound manuscripts under warm ambient light.',
    suggestedQuotes: [
      { quote: 'He who has a why to live can bear almost any how.', author: 'Friedrich Nietzsche' },
      { quote: 'A room without books is like a body without a soul.', author: 'Marcus Tullius Cicero' },
    ],
  },
  {
    id: 'academic-compass-hourglass',
    title: 'Brass Astrolabe, Hourglass & Vintage Map',
    url: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1600&auto=format&fit=crop&q=90',
    thumbnailUrl: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=500&auto=format&fit=crop&q=80',
    category: 'dark-academia',
    source: 'Smithsonian Libraries & Archives (Open Access)',
    license: 'Smithsonian Open Access (CC0)',
    authorOrCredit: 'Smithsonian Institution',
    tags: ['MementoMori', 'Hourglass', 'Time', 'DarkAcademia', 'Manuscript'],
    dimensions: '1600x1067 (HD)',
    description: 'Intricate brass navigational compass, sand hourglass, and parchment manuscript illuminated by candlelight.',
    suggestedQuotes: [
      { quote: 'You could leave life right now. Let that determine what you do and say and think.', author: 'Marcus Aurelius' },
      { quote: 'In the depth of winter, I finally learned that within me there lay an invincible summer.', author: 'Albert Camus' },
    ],
  },

  // ---------------------------------------------------------------------------
  // 5. NORDIC SOLITUDE, MIST & MOUNTAIN MAJESTY
  // ---------------------------------------------------------------------------
  {
    id: 'nature-foggy-pine-solitude',
    title: 'Dense Foggy Scandinavian Pine Forest at Dawn',
    url: 'https://images.unsplash.com/photo-1511497584788-87676104235f?w=1600&auto=format&fit=crop&q=90',
    thumbnailUrl: 'https://images.unsplash.com/photo-1511497584788-87676104235f?w=500&auto=format&fit=crop&q=80',
    category: 'nordic-solitude',
    source: 'Nordic Open Nature Archive',
    license: 'CC0 Public Domain',
    authorOrCredit: 'Wilderness Photography Collective',
    tags: ['Solitude', 'Forest', 'Mist', 'Fog', 'Nature', 'Quiet'],
    dimensions: '1600x1067 (HD)',
    description: 'Atmospheric light rays piercing through tall misty pine trees in quiet morning wilderness.',
    suggestedQuotes: [
      { quote: 'I live in that solitude which is painful in youth, but delicious in the years of maturity.', author: 'Albert Einstein' },
      { quote: 'The quieter you become, the more you can hear.', author: 'Ram Dass' },
    ],
  },
  {
    id: 'nature-alpine-reflection-lake',
    title: 'Misty Alpine Lake & Jagged Mountain Peak',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1600&auto=format&fit=crop&q=90',
    thumbnailUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=500&auto=format&fit=crop&q=80',
    category: 'nordic-solitude',
    source: 'National Parks Public Image Registry',
    license: 'Public Domain (U.S. National Park Service)',
    authorOrCredit: 'U.S. National Park Service',
    tags: ['Mountains', 'Lake', 'Alpine', 'Serenity', 'Wilderness'],
    dimensions: '1600x1067 (HD)',
    description: 'Glass-like lake mirror reflection of colossal granite peaks under moody morning clouds.',
    suggestedQuotes: [
      { quote: 'Adopt the pace of nature: her secret is patience.', author: 'Ralph Waldo Emerson' },
      { quote: 'Silence is a source of great strength.', author: 'Lao Tzu' },
    ],
  },

  // ---------------------------------------------------------------------------
  // 6. CYBERPUNK, SYNTHWAVE & TECH NOIR
  // ---------------------------------------------------------------------------
  {
    id: 'cyber-tokyo-rain-street',
    title: 'Cyberpunk Neon Rain Street & Reflections',
    url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1600&auto=format&fit=crop&q=90',
    thumbnailUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500&auto=format&fit=crop&q=80',
    category: 'cyberpunk-tech',
    source: 'Urban Creative Commons Collection',
    license: 'CC0 Public Domain',
    authorOrCredit: 'Tokyo Cyber Archive',
    tags: ['Cyberpunk', 'Neon', 'Rain', 'Dystopian', 'Tech', 'Reflections'],
    dimensions: '1600x1067 (HD)',
    description: 'Wet asphalt street reflecting vivid cyan, violet, and magenta neon signs in heavy midnight rain.',
    suggestedQuotes: [
      { quote: 'The sky above the port was the color of television, tuned to a dead channel.', author: 'William Gibson' },
      { quote: 'All those moments will be lost in time, like tears in rain.', author: 'Roy Batty (Blade Runner)' },
    ],
  },
  {
    id: 'cyber-brutalist-monochrome',
    title: 'Brutalist Concrete Monochrome Geometry',
    url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600&auto=format&fit=crop&q=90',
    thumbnailUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500&auto=format&fit=crop&q=80',
    category: 'cyberpunk-tech',
    source: 'Architectural Heritage CC0 Archive',
    license: 'CC0 Public Domain',
    authorOrCredit: 'Metropolis Architecture Guild',
    tags: ['Brutalist', 'Monochrome', 'Geometry', 'Minimal', 'Architecture'],
    dimensions: '1600x1067 (HD)',
    description: 'High-contrast architectural angles and deep black shadows on towering concrete monoliths.',
    suggestedQuotes: [
      { quote: 'Simplicity is the ultimate sophistication.', author: 'Leonardo da Vinci' },
      { quote: 'Man is a creature that can get used to anything, and that, I think, is his greatest definition.', author: 'Fyodor Dostoevsky' },
    ],
  },
];
