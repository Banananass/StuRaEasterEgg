export const INITIAL_UPGRADES = [
    {
        id: 'sweetStart',
        name: { de: 'Süßer Anfang', en: 'Sweet Beginning' },
        flavourText: {
            de: 'Der Biber lernt endlich, dass Saft gut schmeckt.',
            en: 'The beaver finally learns that juice tastes good.'
        },
        effectText: { de: 'Saftwert +1.', en: 'Juice value +1.' },
        level: 0,
        levelCap: 1,
        prices: [5],
        x: 50.0,
        y: 50.0
    },
    {
        id: 'eagerPaws',
        name: { de: 'Eifrige Pfoten', en: 'Eager Paws' },
        flavourText: {
            de: 'Der Biber hört auf zu zögern und trinkt schneller.',
            en: 'The beaver stops hesitating and drinks faster.'
        },
        effectText: { de: '+10% Sammelgeschwindigkeit pro Stufe.', en: '+10% collection speed per level.' },
        level: 0,
        levelCap: 6,
        prices: [5, 8, 11, 17, 25, 38],
        dependencies: [
            {
                upgradeId: 'sweetStart',
                minLevel: 1,
                teaseLevel: 1
            },
        ],
        x: 40.1,
        y: 50.0
    },
    {
        id: 'longerLegs',
        name: { de: 'Längere Beine', en: 'Longer Legs' },
        flavourText: {
            de: 'Verwandelt den watschelnden Fellklumpen in einen echten Vierbeiner.',
            en: 'Turns the waddling ball of fur into a proper four-legged runner.'
        },
        effectText: { de: '+10% Bewegungsgeschwindigkeit pro Stufe.', en: '+10% movement speed per level.' },
        level: 0,
        levelCap: 6,
        prices: [8, 12, 18, 27, 40, 61],
        dependencies: [
            {
                upgradeId: 'eagerPaws',
                minLevel: 2,
                teaseLevel: 1
            },
        ],
        x: 69.71,
        y: 52.07
    },
    {
        id: 'wideStance',
        name: { de: 'Breiter Stand', en: 'Wide Stance' },
        flavourText: {
            de: 'Der Biber stellt die Füße breiter auf, sodass ihm der Saft praktisch in den Mund fällt.',
            en: 'The beaver plants its feet wider, so juice practically falls into its mouth.'
        },
        effectText: { de: '+10% Sammelradius pro Stufe.', en: '+10% collection radius per level.' },
        level: 0,
        levelCap: 6,
        prices: [10, 15, 22, 34, 51, 76],
        dependencies: [
            {
                upgradeId: 'eagerPaws',
                minLevel: 3,
                teaseLevel: 2
            },
        ],
        x: 30.29,
        y: 47.93
    },
    {
        id: 'moreJuiceTaps',
        name: { de: 'Mehr Saftquellen', en: 'More Juice Taps' },
        flavourText: {
            de: 'Der Wald entscheidet, dass eine Saftquelle nicht dramatisch genug war.',
            en: 'The forest decides that a single juice source just wasn\'t dramatic enough.'
        },
        effectText: { de: '+1 Saft pro Stufe.', en: '+1 juice per level.' },
        level: 0,
        levelCap: 4,
        prices: [15, 33, 73, 160],
        dependencies: [
            {
                upgradeId: 'longerLegs',
                minLevel: 1,
                teaseLevel: 1
            },
            {
                upgradeId: 'wideStance',
                minLevel: 1,
                teaseLevel: 1
            },
        ],
        x: 30.88,
        y: 72.72
    },
    {
        id: 'steadySapFlow',
        name: { de: 'Stetiger Saftfluss', en: 'Steady Sap Flow' },
        flavourText: {
            de: 'Kappt die unberechenbar langen Wartezeiten beim Nachspawnen, sodass Saft zuverlässiger erscheint, statt gelegentlich ewig zu brauchen.',
            en: 'Cuts down the unpredictably long respawn waits, so juice appears more reliably instead of occasionally taking forever.'
        },
        effectText: { de: '-20% maximale Spawndauer pro Stufe.', en: '-20% maximum spawn duration per level.' },
        level: 0,
        levelCap: 5,
        prices: [12, 19, 31, 49, 79],
        dependencies: [
            {
                upgradeId: 'moreJuiceTaps',
                minLevel: 1,
                teaseLevel: 1
            },
        ],
        x: 87.53,
        y: 62.6
    },
    {
        id: 'comboUnlock',
        name: { de: 'Kombo-System', en: 'Combo System' },
        flavourText: {
            de: 'Schaltet ein neues System frei, das aufeinanderfolgende Sammlungen belohnt.',
            en: 'Unlocks a new system that rewards consecutive collections.'
        },
        effectText: {
            de: 'Aufeinanderfolgende Sammlungen innerhalb eines Zeitfensters bauen einen Multiplikator auf.',
            en: 'Consecutive collections within a time window build up a multiplier.'
        },
        level: 0,
        levelCap: 1,
        prices: [18],
        dependencies: [
            {
                upgradeId: 'moreJuiceTaps',
                minLevel: 2,
                teaseLevel: 1
            },
        ],
        x: 51,
        y: 78
    },
    {
        id: 'fermentationBoost',
        name: { de: 'Gärungsschub', en: 'Fermentation Boost' },
        flavourText: { de: 'Der Saft wird etwas würziger.', en: 'The juice gets a bit spicier.' },
        effectText: { de: 'Jede Saftpackung ist mehr wert.', en: 'Every juice packet is worth more.' },
        level: 0,
        levelCap: 5,
        prices: [20, 34, 58, 98, 167],
        dependencies: [
            {
                upgradeId: 'comboUnlock',
                minLevel: 1,
                teaseLevel: 1
            },
        ],
        x: 71.02,
        y: 83.57
    },
    {
        id: 'comboGrowth',
        name: { de: 'Kombo-Wachstum', en: 'Combo Growth' },
        flavourText: {
            de: 'Du wirst immer besser darin, Sammlungen nahtlos aneinanderzureihen.',
            en: 'You keep getting better at chaining collections together seamlessly.'
        },
        effectText: { de: 'Der Kombo-Multiplikator wächst pro Stufe schneller.', en: 'The combo multiplier grows faster per level.' },
        level: 0,
        levelCap: 5,
        prices: [25, 42, 72, 123, 209],
        dependencies: [
            {
                upgradeId: 'fermentationBoost',
                minLevel: 2,
                teaseLevel: 1
            },
        ],
        x: 76.28,
        y: 91.94
    },
    {
        id: 'forgivingTimer',
        name: { de: 'Nachsichtiger Timer', en: 'Forgiving Timer' },
        flavourText: {
            de: 'Der Biber lernt, sich nicht mehr so leicht aus der Ruhe bringen zu lassen.',
            en: 'The beaver learns not to get flustered so easily.'
        },
        effectText: {
            de: 'Mehr Zeit zwischen Sammlungen, bevor die Kombo zurückgesetzt wird.',
            en: 'More time between collections before the combo resets.'
        },
        level: 0,
        levelCap: 5,
        prices: [20, 32, 51, 82, 131],
        dependencies: [
            {
                upgradeId: 'comboGrowth',
                minLevel: 2,
                teaseLevel: 1
            },
        ],
        x: 81.55,
        y: 100.31
    },
    {
        id: 'maxComboCap',
        name: { de: 'Maximale Kombo-Grenze', en: 'Maximum Combo Cap' },
        flavourText: {
            de: 'Der Biber traut sich, seine Grenzen weiter auszureizen.',
            en: 'The beaver dares to push its limits further.'
        },
        effectText: { de: 'Erhöht die maximale Kombo-Obergrenze.', en: 'Increases the maximum combo cap.' },
        level: 0,
        levelCap: 5,
        prices: [30, 51, 87, 147, 251],
        dependencies: [
            {
                upgradeId: 'comboGrowth',
                minLevel: 3,
                teaseLevel: 2
            },
        ],
        x: 60.53,
        y: 108.45
    },
    {
        id: 'goldenPacketChance',
        name: { de: 'Goldene-Saftbox-Chance', en: 'Golden Juice Box Chance' },
        flavourText: {
            de: 'Eine seltene, schimmernde Saftbox versteckt sich zwischen dem gewöhnlichen Saft, die es zu jagen lohnt.',
            en: 'A rare, shimmering juice box hides among the ordinary juice, worth hunting for.'
        },
        effectText: { de: 'Erhöht die Chance auf eine goldene Saftbox pro Stufe.', en: 'Increases the chance of a golden juice box per level.' },
        level: 0,
        levelCap: 5,
        prices: [35, 63, 113, 204, 367],
        dependencies: [
            {
                upgradeId: 'comboGrowth',
                minLevel: 1,
                teaseLevel: 1
            },
        ],
        x: 98.02,
        y: 84.97
    },
    {
        id: 'sprintSap',
        name: { de: 'Sprint-Saft', en: 'Sprint Sap' },
        flavourText: {
            de: 'Eine würzige Saftvariante, die die Beine des Bibers für ein paar Sekunden auf Hochtouren bringt.',
            en: 'A spicy juice variant that kicks the beaver\'s legs into overdrive for a few seconds.'
        },
        effectText: {
            de: 'Schaltet Sprint-Saft frei: kurzer Geschwindigkeitsschub beim Einsammeln.',
            en: 'Unlocks Sprint Sap: a brief speed boost when collected.'
        },
        level: 0,
        levelCap: 1,
        prices: [50],
        dependencies: [
            {
                upgradeId: 'moreJuiceTaps',
                minLevel: 1,
                teaseLevel: 1
            },
        ],
        x: 32.05,
        y: 85.28
    },
    {
        id: 'sprintPotency',
        name: { de: 'Sprint-Stärke', en: 'Sprint Potency' },
        flavourText: {
            de: 'Konzentriert den Sprint-Saft weiter, sodass der temporäre Geschwindigkeitsschub härter zuschlägt.',
            en: 'Concentrates the Sprint Sap further, so the temporary speed boost hits harder.'
        },
        effectText: { de: 'Erhöht die Stärke des Sprint-Geschwindigkeitsschubs pro Stufe.', en: 'Increases the strength of the Sprint speed boost per level.' },
        level: 0,
        levelCap: 4,
        prices: [40, 68, 116, 197],
        dependencies: [
            {
                upgradeId: 'sprintSap',
                minLevel: 1,
                teaseLevel: 1
            },
        ],
        x: 34.52,
        y: 97.03
    },
    {
        id: 'sprintDuration',
        name: { de: 'Sprint-Dauer', en: 'Sprint Duration' },
        flavourText: {
            de: 'Die Schärfe hält länger im System des Bibers an und verlängert das Geschwindigkeitsschub-Fenster.',
            en: 'The spiciness lingers longer in the beaver\'s system, extending the speed boost window.'
        },
        effectText: { de: 'Verlängert die Dauer des Sprint-Geschwindigkeitsschubs pro Stufe.', en: 'Extends the duration of the Sprint speed boost per level.' },
        level: 0,
        levelCap: 4,
        prices: [40, 68, 116, 197],
        dependencies: [
            {
                upgradeId: 'sprintSap',
                minLevel: 1,
                teaseLevel: 1
            },
        ],
        x: 15.35,
        y: 85.32
    },
    {
        id: 'sprintFrequency',
        name: { de: 'Sprint-Häufigkeit', en: 'Sprint Frequency' },
        flavourText: {
            de: 'Die Otter haben gelernt, wo der beste Sprint-Saft wächst.',
            en: 'The otters have learned where the best Sprint Sap grows.'
        },
        effectText: { de: 'Sprint-Saft taucht häufiger unter den regulären Spawns auf.', en: 'Sprint Sap appears more often among regular spawns.' },
        level: 0,
        levelCap: 4,
        prices: [45, 81, 146, 262],
        dependencies: [
            {
                upgradeId: 'sprintPotency',
                minLevel: 2,
                teaseLevel: 1
            },
            {
                upgradeId: 'sprintDuration',
                minLevel: 2,
                teaseLevel: 1
            },
        ],
        x: 31.46,
        y: 106.43
    },
    {
        id: 'nectarBrew',
        name: { de: 'Nektar-Sud', en: 'Nectar Brew' },
        flavourText: {
            de: 'Ein dickflüssiger, sirupartiger Saft, der die Reichweite des Bibers für kurze Zeit großzügig erweitert.',
            en: 'A thick, syrupy juice that generously extends the beaver\'s reach for a short time.'
        },
        effectText: {
            de: 'Schaltet Nektar-Sud frei: temporäre Reichweitenerweiterung.',
            en: 'Unlocks Nectar Brew: a temporary reach boost.'
        },
        level: 0,
        levelCap: 1,
        prices: [50],
        dependencies: [
            {
                upgradeId: 'moreJuiceTaps',
                minLevel: 1,
                teaseLevel: 1
            },
        ],
        x: 11.07,
        y: 57.24
    },
    {
        id: 'nectarPotency',
        name: { de: 'Nektar-Stärke', en: 'Nectar Potency' },
        flavourText: {
            de: 'Verdickt den Sud weiter und dehnt den temporären Reichweitenschub noch weiter aus.',
            en: 'Thickens the brew further, stretching the temporary reach boost even more.'
        },
        effectText: { de: 'Erhöht die Stärke des Reichweitenschubs pro Stufe.', en: 'Increases the strength of the reach boost per level.' },
        level: 0,
        levelCap: 4,
        prices: [40, 68, 116, 197],
        dependencies: [
            {
                upgradeId: 'nectarBrew',
                minLevel: 1,
                teaseLevel: 1
            },
        ],
        x: 3.29,
        y: 66.38
    },
    {
        id: 'nectarDuration',
        name: { de: 'Nektar-Dauer', en: 'Nectar Duration' },
        flavourText: {
            de: 'Hält den sirupartigen Effekt länger aktiv, bevor er nachlässt.',
            en: 'Keeps the syrupy effect active longer before it fades.'
        },
        effectText: { de: 'Verlängert die Dauer des Reichweitenschubs pro Stufe.', en: 'Extends the duration of the reach boost per level.' },
        level: 0,
        levelCap: 4,
        prices: [40, 68, 116, 197],
        dependencies: [
            {
                upgradeId: 'nectarBrew',
                minLevel: 1,
                teaseLevel: 1
            },
        ],
        x: 0.86,
        y: 44.02
    },
    {
        id: 'nectarFrequency',
        name: { de: 'Nektar-Häufigkeit', en: 'Nectar Frequency' },
        flavourText: {
            de: 'Die Otter kennen jetzt auch die besten Stellen für Nektar-Sud.',
            en: 'The otters now also know the best spots for Nectar Brew.'
        },
        effectText: { de: 'Nektar-Sud taucht häufiger unter den regulären Spawns auf.', en: 'Nectar Brew appears more often among regular spawns.' },
        level: 0,
        levelCap: 4,
        prices: [45, 81, 146, 262],
        dependencies: [
            {
                upgradeId: 'nectarPotency',
                minLevel: 2,
                teaseLevel: 1
            },
            {
                upgradeId: 'nectarDuration',
                minLevel: 2,
                teaseLevel: 1
            },
        ],
        x: -6.07,
        y: 69.66
    },
    {
        id: 'stormWarning',
        name: { de: 'Sturmwarnung', en: 'Storm Warning' },
        flavourText: {
            de: 'Ein fernes Grollen bedeutet, dass irgendwo auf der Karte eine sturmgebraute Saftbox gelandet ist. Schnell sein, sie wartet nicht.',
            en: 'A distant rumble means a storm-brewed juice box has landed somewhere on the map. Be quick, it won\'t wait.'
        },
        effectText: {
            de: 'Schaltet Sturmpackungen frei: seltene, wertvolle Saftboxen.',
            en: 'Unlocks storm packets: rare, high-value juice boxes.'
        },
        level: 0,
        levelCap: 1,
        prices: [60],
        dependencies: [
            {
                upgradeId: 'moreJuiceTaps',
                minLevel: 2,
                teaseLevel: 1
            },
        ],
        x: 20.53,
        y: 23.54
    },
    {
        id: 'stormFrequency',
        name: { de: 'Sturm-Häufigkeit', en: 'Storm Frequency' },
        flavourText: {
            de: 'Die Wolken über dem Wald werden unruhiger.',
            en: 'The clouds over the forest grow more restless.'
        },
        effectText: { de: 'Sturmpackungen erscheinen häufiger.', en: 'Storm packets appear more often.' },
        level: 0,
        levelCap: 5,
        prices: [50, 85, 144, 246, 418],
        dependencies: [
            {
                upgradeId: 'stormWarning',
                minLevel: 1,
                teaseLevel: 1
            },
        ],
        x: 8.55,
        y: 22.91
    },
    {
        id: 'stormLifespan',
        name: { de: 'Sturm-Lebensdauer', en: 'Storm Lifespan' },
        flavourText: {
            de: 'Der Sturm zieht sich etwas länger über dem Wald zusammen.',
            en: 'The storm lingers a little longer over the forest.'
        },
        effectText: {
            de: 'Verlängert, wie lange eine Sturmpackung bestehen bleibt, bevor sie sich auflöst.',
            en: 'Extends how long a storm packet lasts before it dissolves.'
        },
        level: 0,
        levelCap: 5,
        prices: [55, 94, 159, 270, 459],
        dependencies: [
            {
                upgradeId: 'stormWarning',
                minLevel: 1,
                teaseLevel: 1
            },
        ],
        x: 24.8,
        y: 7.38
    },
    {
        id: 'stormValue',
        name: { de: 'Sturm-Wert', en: 'Storm Value' },
        flavourText: {
            de: 'Jede Sturmpackung enthält deutlich konzentrierteren Saft als eine gewöhnliche.',
            en: 'Every storm packet contains noticeably more concentrated juice than a regular one.'
        },
        effectText: { de: 'Erhöht den Saftwert von Sturmpackungen deutlich.', en: 'Significantly increases the juice value of storm packets.' },
        level: 0,
        levelCap: 5,
        prices: [60, 108, 194, 350, 630],
        dependencies: [
            {
                upgradeId: 'stormFrequency',
                minLevel: 2,
                teaseLevel: 1
            },
            {
                upgradeId: 'stormLifespan',
                minLevel: 2,
                teaseLevel: 1
            },
        ],
        x: 0.27,
        y: 17.51
    },
    {
        id: 'stormDomestication',
        name: { de: 'Sturm-Zähmung', en: 'Storm Domestication' },
        flavourText: {
            de: 'Nach jahrelangem Otter-Training lernt die Kolonie endlich, einen Sturm einzuholen, bevor er verblasst.',
            en: 'After years of otter training, the colony finally learns to catch a storm before it fades.'
        },
        effectText: {
            de: 'Die Otter-Kolonie fängt Sturmpackungen automatisch ein, bevor sie verblassen.',
            en: 'The otter colony automatically catches storm packets before they fade.'
        },
        level: 0,
        levelCap: 1,
        prices: [5000],
        dependencies: [
            {
                upgradeId: 'stormValue',
                minLevel: 5,
                teaseLevel: 4
            },
            {
                upgradeId: 'otterColony',
                minLevel: 3,
                teaseLevel: 2
            },
        ],
        x: 102.02,
        y: -9.71
    },
    {
        id: 'trainedOtterAssistant',
        name: { de: 'Ausgebildeter Otter-Assistent', en: 'Trained Otter Assistant' },
        flavourText: {
            de: 'Der Otter vom Freund deines Cousins. Technisch qualifiziert, meistens am Schlafen.',
            en: 'The otter from your cousin\'s friend. Technically qualified, mostly asleep.'
        },
        effectText: {
            de: 'Schaltet einen Otter-Assistenten frei, der automatisch Saft sammelt.',
            en: 'Unlocks an otter assistant that automatically collects juice.'
        },
        level: 0,
        levelCap: 1,
        prices: [200],
        dependencies: [
            {
                upgradeId: 'longerLegs',
                minLevel: 5,
                teaseLevel: 4
            },
            {
                upgradeId: 'wideStance',
                minLevel: 5,
                teaseLevel: 4
            },
        ],
        x: 66.65,
        y: 25.39
    },
    {
        id: 'otterFocus',
        name: { de: 'Otter-Fokus', en: 'Otter Focus' },
        flavourText: {
            de: 'Bringt dem Otter langsam bei, sich um seinen Job zu kümmern.',
            en: 'Slowly teaches the otter to actually focus on its job.'
        },
        effectText: { de: 'Erhöht die Sammelgeschwindigkeit des Otters pro Stufe.', en: 'Increases the otter\'s collection speed per level.' },
        level: 0,
        levelCap: 6,
        prices: [80, 128, 205, 328, 524, 839],
        dependencies: [
            {
                upgradeId: 'trainedOtterAssistant',
                minLevel: 1,
                teaseLevel: 1
            },
        ],
        x: 39.83,
        y: 11.7
    },
    {
        id: 'otterReach',
        name: { de: 'Otter-Reichweite', en: 'Otter Reach' },
        flavourText: {
            de: 'Der Otter steht nicht mehr direkt auf dem Saft, bevor er ihn bemerkt.',
            en: 'The otter no longer needs to stand directly on the juice before noticing it.'
        },
        effectText: { de: 'Erhöht den Sammelradius des Otters pro Stufe.', en: 'Increases the otter\'s collection radius per level.' },
        level: 0,
        levelCap: 6,
        prices: [90, 144, 230, 369, 590, 944],
        dependencies: [
            {
                upgradeId: 'trainedOtterAssistant',
                minLevel: 1,
                teaseLevel: 1
            },
        ],
        x: 76.01,
        y: 20.12
    },
    {
        id: 'secondOtter',
        name: { de: 'Zweiter Otter', en: 'Second Otter' },
        flavourText: {
            de: 'Der erste Otter hat sich organisiert und Verstärkung gefordert.',
            en: 'The first otter got organized and requested backup.'
        },
        effectText: { de: 'Schaltet einen zweiten Otter-Assistenten frei.', en: 'Unlocks a second otter assistant.' },
        level: 0,
        levelCap: 1,
        prices: [500],
        dependencies: [
            {
                upgradeId: 'otterFocus',
                minLevel: 3,
                teaseLevel: 2
            },
            {
                upgradeId: 'otterReach',
                minLevel: 3,
                teaseLevel: 2
            },
        ],
        x: 82.53,
        y: 12.7
    },
    {
        id: 'juiceRefinery',
        name: { de: 'Saftraffinerie', en: 'Juice Refinery' },
        flavourText: {
            de: 'Eine kleine Brennerei veredelt passiv alles, was die Otter nach Hause bringen.',
            en: 'A small distillery passively refines everything the otters bring home.'
        },
        effectText: {
            de: 'Erhöht passiv den Wert des von Ottern gesammelten Safts pro Stufe.',
            en: 'Passively increases the value of juice collected by otters per level.'
        },
        level: 0,
        levelCap: 6,
        prices: [150, 255, 433, 737, 1253, 2130],
        dependencies: [
            {
                upgradeId: 'secondOtter',
                minLevel: 1,
                teaseLevel: 1
            },
        ],
        x: 89.02,
        y: 5.23
    },
    {
        id: 'otterColony',
        name: { de: 'Otter-Kolonie', en: 'Otter Colony' },
        flavourText: {
            de: 'Eine ganze Otter-Belegschaft, organisiert und florierend.',
            en: 'A whole otter workforce, organized and thriving.'
        },
        effectText: {
            de: 'Erhöht die Anzahl und Effizienz der Otter-Assistenten pro Stufe.',
            en: 'Increases the number and efficiency of otter assistants per level.'
        },
        level: 0,
        levelCap: 3,
        prices: [1000, 2200, 4840],
        dependencies: [
            {
                upgradeId: 'juiceRefinery',
                minLevel: 3,
                teaseLevel: 2
            },
        ],
        x: 95.54,
        y: -2.24
    }
];
//# sourceMappingURL=UpgradeData.js.map