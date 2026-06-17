<!DOCTYPE html>
<html lang="de">
<head>
    <?php
        ini_set('display_errors', '1');
        ini_set('display_startup_errors', '1');
        error_reporting(E_ALL);
    ?>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EasterEgg</title>
    <style>
        :root {
            --fs-xs: clamp(0.60rem, 0.9vw, 1.05rem);
            --fs-sm: clamp(0.70rem, 1.0vw, 1.15rem);
            --fs-md: clamp(0.80rem, 1.15vw, 1.30rem);
            --fs-lg: clamp(1.00rem, 1.5vw, 1.70rem);
            --fs-xl: clamp(1.30rem, 2.0vw, 2.40rem);
            --fs-hero: clamp(3.00rem, 6vw, 7.00rem);

            --gap: clamp(8px, 1.2vw, 20px);
            --pad: clamp(8px, 1.4vw, 24px);
            --radius: clamp(8px, 1.0vw, 16px);
            --bar-h: clamp(14px, 1.4vh, 26px);
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        html {
            width: 100%;
            height: 100%;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
            color: #e0e0e0;
            min-height: 95vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: var(--pad);
            overflow-x: hidden;
            font-size: var(--fs-sm);
        }

        h1 {
            font-size: var(--fs-xl);
            text-align: center;
            color: #f39c12;
            text-shadow: 0 0 12px rgba(243, 156, 18, 0.6);
            margin-bottom: 0.4em;
        }

        h1 span {
            font-size: 1.15em;
        }

        #subtitle {
            font-size: var(--fs-xs);
            color: #aaa;
            text-align: center;
            margin-bottom: var(--gap);
        }

        /* ── Main layout ── */
        #game {
            width: 100%;
            max-width: min(95vw, 1600px);
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: var(--gap);
        }

        /* ── Stats panel ── */
        #stats {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(243, 156, 18, 0.3);
            border-radius: var(--radius);
            padding: var(--gap) calc(var(--gap) * 1.2);
            grid-column: 1 / -1;
            display: flex;
            flex-wrap: wrap;
            gap: var(--gap);
            justify-content: space-between;
            align-items: center;
        }

        .stat-box {
            text-align: center;
            flex: 1;
            min-width: clamp(80px, 10vw, 160px);
        }

        .stat-box .val {
            font-size: var(--fs-lg);
            font-weight: bold;
            color: #f39c12;
        }

        .stat-box .lbl {
            font-size: var(--fs-xs);
            color: #aaa;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }

        /* ── Biber area ── */
        #biber-panel {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(243, 156, 18, 0.3);
            border-radius: var(--radius);
            padding: var(--pad);
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: var(--gap);
        }

        #biber-info {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: var(--gap);
            width: 100%;
        }

        #beaver-display {
            font-size: var(--fs-hero);
            line-height: 1;
            filter: drop-shadow(0 0 10px rgba(243, 156, 18, 0.5));
            cursor: default;
            transition: transform 0.1s;
            user-select: none;
        }

        #beaver-display.wiggle {
            animation: wiggle 0.4s ease;
        }

        @keyframes wiggle {
            0%, 100% {
                transform: rotate(0deg) scale(1);
            }
            25% {
                transform: rotate(-8deg) scale(1.1);
            }
            75% {
                transform: rotate(8deg) scale(1.1);
            }
        }

        #beaver-title {
            font-size: var(--fs-md);
            font-weight: bold;
            color: #f39c12;
            text-align: center;
            min-height: 1.2em;
        }

        #juice-bar-container {
            width: 100%;
            background: rgba(0, 0, 0, 0.3);
            border-radius: 999px;
            height: var(--bar-h);
            overflow: hidden;
            border: 1px solid rgba(243, 156, 18, 0.2);
            position: relative;
        }

        #juice-bar {
            height: 100%;
            background: linear-gradient(90deg, #e67e22, #f39c12, #f1c40f);
            border-radius: 999px;
            transition: width 0.5s linear;
            width: 0;
        }

        #juice-bar-label {
            position: absolute;
            inset: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: var(--fs-xs);
            color: rgba(255, 255, 255, 0.9);
            font-weight: bold;
            pointer-events: none;
        }

        #prestige-btn {
            width: 100%;
            padding: 0.5em 0.8em;
            border-radius: var(--radius);
            border: none;
            background: linear-gradient(135deg, #8e44ad, #6c3483);
            color: white;
            font-size: var(--fs-sm);
            cursor: pointer;
            opacity: 0.4;
            pointer-events: none;
            transition: opacity 0.3s, transform 0.1s;
        }

        #prestige-btn.active {
            opacity: 1;
            pointer-events: auto;
        }

        #prestige-btn.active:hover {
            transform: scale(1.02);
        }

        #prestige-count {
            font-size: var(--fs-xs);
            color: #a29bfe;
            text-align: center;
        }

        #log {
            font-size: var(--fs-xs);
            color: #95afc0;
            text-align: center;
            min-height: 1.4em;
            font-style: italic;
        }

        /* ── Upgrades panel ── */
        #upgrades-panel {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(243, 156, 18, 0.3);
            border-radius: var(--radius);
            padding: var(--gap);
            display: flex;
            flex-direction: column;
            gap: calc(var(--gap) * 0.6);
            overflow-y: auto;
            max-height: clamp(250px, 45vh, 600px);
        }

        #upgrades-panel h2 {
            font-size: var(--fs-md);
            color: #f39c12;
            text-align: center;
            margin-bottom: 2px;
            flex-shrink: 0;
        }

        .upgrade-btn {
            background: rgba(255, 255, 255, 0.07);
            border: 1px solid rgba(255, 255, 255, 0.15);
            border-radius: calc(var(--radius) * 0.7);
            padding: 0.5em 0.7em;
            color: #e0e0e0;
            cursor: pointer;
            text-align: left;
            transition: background 0.2s, border-color 0.2s, transform 0.1s;
            width: 100%;
            position: relative;
        }

        .upgrade-btn:not(:disabled):hover {
            background: rgba(243, 156, 18, 0.15);
            border-color: rgba(243, 156, 18, 0.5);
            transform: scale(1.01);
        }

        .upgrade-btn:disabled {
            opacity: 0.45;
            cursor: not-allowed;
        }

        .upgrade-btn .upg-name {
            font-size: var(--fs-sm);
            font-weight: bold;
            display: flex;
            align-items: center;
            gap: 4px;
        }

        .upgrade-btn .upg-desc {
            font-size: var(--fs-xs);
            color: #aaa;
            margin-top: 2px;
        }

        .upgrade-btn .upg-cost {
            font-size: var(--fs-xs);
            color: #f39c12;
            margin-top: 3px;
        }

        .upgrade-btn .upg-count {
            position: absolute;
            top: 0.4em;
            right: 0.6em;
            font-size: var(--fs-xs);
            background: rgba(243, 156, 18, 0.2);
            color: #f39c12;
            border-radius: 999px;
            padding: 1px 0.5em;
        }

        .upgrade-btn.maxed {
            border-color: rgba(46, 204, 113, 0.4);
            background: rgba(46, 204, 113, 0.05);
        }

        .upgrade-btn.maxed .upg-cost {
            color: #2ecc71;
        }

        /* ── Milestones ── */
        #milestones {
            grid-column: 1 / -1;
            background: rgba(255, 255, 255, 0.04);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: var(--radius);
            padding: calc(var(--gap) * 0.8) var(--gap);
        }

        #milestones h2 {
            font-size: var(--fs-sm);
            color: #aaa;
            margin-bottom: calc(var(--gap) * 0.5);
        }

        #milestone-list {
            display: flex;
            flex-wrap: wrap;
            gap: calc(var(--gap) * 0.5);
        }

        .milestone {
            font-size: var(--fs-xs);
            padding: 0.2em 0.7em;
            border-radius: 999px;
            background: rgba(255, 255, 255, 0.06);
            color: #777;
            border: 1px solid rgba(255, 255, 255, 0.08);
            transition: all 0.4s;
        }

        .milestone.unlocked {
            background: rgba(243, 156, 18, 0.15);
            color: #f39c12;
            border-color: rgba(243, 156, 18, 0.4);
        }

        /* ── Floating juice drops ── */
        .juice-drop {
            position: fixed;
            font-size: clamp(1.2rem, 2vw, 2.5rem);
            pointer-events: none;
            animation: dropFloat 2.5s ease-out forwards;
            z-index: 999;
        }

        @keyframes dropFloat {
            0% {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
            100% {
                opacity: 0;
                transform: translateY(-80px) scale(0.5);
            }
        }

        /* ── Scrollbar ── */
        #upgrades-panel::-webkit-scrollbar {
            width: 4px;
        }

        #upgrades-panel::-webkit-scrollbar-track {
            background: transparent;
        }

        #upgrades-panel::-webkit-scrollbar-thumb {
            background: rgba(243, 156, 18, 0.3);
            border-radius: 4px;
        }

        /* ══════════════════════════════════════
           RESPONSIVE BREAKPOINTS
        ══════════════════════════════════════ */

        /* Smartphone: alles in einer Spalte */
        @media (max-width: 480px) {
            #game {
                grid-template-columns: 1fr;
            }

            #biber-panel {
                flex-direction: row;
                flex-wrap: wrap;
                justify-content: center;
            }

            #beaver-display {
                flex-shrink: 0;
            }

            #biber-info {
                flex: 1;
                min-width: 160px;
                align-items: flex-start;
            }

            #milestones {
                grid-column: 1;
            }
        }

        /* Sehr kleines Smartphone */
        @media (max-width: 360px) {
            #stats {
                flex-direction: column;
            }

            .stat-box {
                min-width: unset;
                width: 100%;
            }
        }
    </style>
</head>
<body>

<h1><span>🦫</span> StuRa Saft-Fabrik</h1>
<p id="subtitle">Du hast das Geheimnis des StuRas entdeckt. Alles läuft hier auf Saft.</p>

<div id="game">
    <!-- STATS -->
    <div id="stats">
        <div class="stat-box">
            <div class="val" id="stat-juice">0</div>
            <div class="lbl">🧃 Liter Saft</div>
        </div>
        <div class="stat-box">
            <div class="val" id="stat-sps">0.0</div>
            <div class="lbl">Saft / Sek</div>
        </div>
        <div class="stat-box">
            <div class="val" id="stat-total">0</div>
            <div class="lbl">Gesamt gepresst</div>
        </div>
    </div>

    <!-- BIBER -->
    <div id="biber-panel">
        <div id="beaver-display">🦫</div>
        <div id="biber-info">
            <div id="beaver-title">Praktikant</div>
            <div id="juice-bar-container">
                <div id="juice-bar"></div>
                <div id="juice-bar-label">Saft-Tank</div>
            </div>
            <button id="prestige-btn" onclick="prestige()">✨ Prestige – Alles zurücksetzen für ×1.5 Bonus</button>
            <div id="prestige-count">Prestiges: 0</div>
            <div id="log">Der Biber beginnt zu pressen...</div>
        </div>
    </div>

    <!-- UPGRADES -->
    <div id="upgrades-panel">
        <h2>🔧 Upgrades kaufen</h2>
        <!-- filled by JS -->
    </div>

    <!-- MILESTONES -->
    <div id="milestones">
        <h2>🏆 Meilensteine</h2>
        <div id="milestone-list"></div>
    </div>
</div>

<script>
    // ═══════════════════════════════════════════════════════════
    //  SCREEN ADJUSTMENT
    // ═══════════════════════════════════════════════════════════
    function sendDimensions() {
        const height = document.documentElement.scrollHeight || document.body.scrollHeight;
        window.parent.postMessage({type: 'setHeight', height: height}, '*');
    }

    window.addEventListener("DOMContentLoaded", sendDimensions);
    window.addEventListener("resize", sendDimensions);

    const originalRenderUpgrades = renderUpgrades;
    renderUpgrades = function () {
        originalRenderUpgrades();
        sendDimensions();
    };

    const originalRenderMilestones = renderMilestones;
    renderMilestones = function () {
        originalRenderMilestones();
        sendDimensions();
    };
    // ═══════════════════════════════════════════════════════════
    //  GAME DATA
    // ═══════════════════════════════════════════════════════════

    const UPGRADES = [
        {
            id: 'zahn',
            icon: '🦷',
            name: 'Frisch geschärfte Nagezähne',
            desc: 'Der Biber presst effizienter. +0.1 Saft/s',
            baseCost: 10,
            costMult: 1.5,
            spsBonus: 0.1,
            max: 20,
            count: 0,
        },
        {
            id: 'erstsemester',
            icon: '🎒',
            name: 'Erstsemester-Hilfskraft',
            desc: 'Voller Elan, null Ahnung. +0.3 Saft/s',
            baseCost: 50,
            costMult: 1.6,
            spsBonus: 0.3,
            max: 15,
            count: 0,
        },
        {
            id: 'ausschuss',
            icon: '📋',
            name: 'Presse-Ausschuss des StuRas',
            desc: 'Tagt dreimal die Woche, presst doppelt. +1 Saft/s',
            baseCost: 200,
            costMult: 1.7,
            spsBonus: 1.0,
            max: 10,
            count: 0,
        },
        {
            id: 'kaffee',
            icon: '☕',
            name: 'Koffein-Upgrade',
            desc: 'Wer braucht schon Schlaf? +3 Saft/s',
            baseCost: 750,
            costMult: 1.8,
            spsBonus: 3.0,
            max: 8,
            count: 0,
        },
        {
            id: 'damm',
            icon: '🪵',
            name: 'Automatischer Biberdamm-Reaktor',
            desc: 'Hydraulische Presskraft. +8 Saft/s',
            baseCost: 2500,
            costMult: 1.9,
            spsBonus: 8.0,
            max: 6,
            count: 0,
        },
        {
            id: 'vollversammlung',
            icon: '🏛️',
            name: 'Vollversammlung (alle erschienen!)',
            desc: 'Das ist ein historischer Moment. +25 Saft/s',
            baseCost: 8000,
            costMult: 2.0,
            spsBonus: 25.0,
            max: 5,
            count: 0,
        },
        {
            id: 'biber-klon',
            icon: '🦫🦫',
            name: 'Biber-Klonanlage',
            desc: 'Wenn einer nicht reicht. +80 Saft/s',
            baseCost: 25000,
            costMult: 2.1,
            spsBonus: 80.0,
            max: 4,
            count: 0,
        },
        {
            id: 'quantenbiber',
            icon: '⚛️',
            name: 'Quanten-Biber-Beschleuniger',
            desc: 'Presst in mehreren Dimensionen gleichzeitig. +500 Saft/s',
            baseCost: 150000,
            costMult: 2.5,
            spsBonus: 500.0,
            max: 3,
            count: 0,
        },
    ];

    const TITLES = [
        {threshold: 0, title: 'Praktikant', emoji: '🦫'},
        {threshold: 50, title: 'Junior-Saft-Wart', emoji: '🦫'},
        {threshold: 500, title: 'StuRa-Mitglied', emoji: '🦫🎒'},
        {threshold: 2000, title: 'Ausschuss-Vorsitz', emoji: '🦫📋'},
        {threshold: 10000, title: 'Ober-Biber', emoji: '🦫👑'},
        {threshold: 50000, title: 'Saft-Minister', emoji: '🦫🧃'},
        {threshold: 250000, title: 'Biberweiser', emoji: '🦫🧙'},
        {threshold: 1000000, title: 'Ehren-StuRa-Präsident', emoji: '🦫🏛️'},
    ];

    const MILESTONES = [
        {id: 'm1', threshold: 10, label: '10 L gepresst'},
        {id: 'm2', threshold: 100, label: '100 L Saft'},
        {id: 'm3', threshold: 1000, label: '1.000 L'},
        {id: 'm4', threshold: 10000, label: '10.000 L'},
        {id: 'm5', threshold: 100000, label: '100.000 L'},
        {id: 'm6', threshold: 1000000, label: '1 Mio. Liter 🎉'},
        {id: 'm7', threshold: 10000000, label: '10 Mio. Liter 🚀'},
        {id: 'sps1', threshold: null, label: '1 Saft/s erreicht', spsReq: 1},
        {id: 'sps2', threshold: null, label: '10 Saft/s', spsReq: 10},
        {id: 'sps3', threshold: null, label: '100 Saft/s', spsReq: 100},
        {id: 'sps4', threshold: null, label: '1.000 Saft/s', spsReq: 1000},
        {id: 'pres1', threshold: null, label: '1. Prestige', prestigeReq: 1},
        {id: 'pres3', threshold: null, label: '3× Prestige', prestigeReq: 3},
    ];

    const LOGS = [
        'Der Biber kaut zufrieden.',
        'Im StuRa-Büro riecht es nach Orangensaft.',
        'Ein Erstsemester fragt, ob das normal ist.',
        'Der Ausschuss tagt. Es wird gepresst.',
        'Saft-Level: kritisch hoch.',
        '"Haben wir noch Becher?" — Nein.',
        'Der Biber hat gerade den Akkreditierungsbericht zerfressen.',
        'Sitzungsprotokoll: Punkt 3 — mehr Saft.',
        'Irgendwo schwimmt ein Erstsemester im Saft.',
        'Der Biber wurde zum Ehrenmitglied ernannt.',
        '"Das ist kein Bug, das ist ein Feature." — StuRa-Vorsitz',
        'Saftproduktion läuft auf Hochtouren. 🦫',
    ];

    // ═══════════════════════════════════════════════════════════
    //  STATE
    // ═══════════════════════════════════════════════════════════

    let state = {
        juice: 0,
        totalJuice: 0,
        prestigeCount: 0,
        prestigeBonus: 1.0,
        unlockedMilestones: [],
        upgrades: UPGRADES.map(u => ({id: u.id, count: 0})),
    };

    function loadState() {
        try {
            const raw = localStorage.getItem('stura_juice_idle');
            if (raw) {
                const saved = JSON.parse(raw);
                state = {...state, ...saved};
                // merge upgrade counts back
                state.upgrades.forEach(su => {
                    const upg = UPGRADES.find(u => u.id === su.id);
                    if (upg) upg.count = su.count;
                });
            }
        } catch (e) {
        }
    }

    function saveState() {
        state.upgrades = UPGRADES.map(u => ({id: u.id, count: u.count}));
        localStorage.setItem('stura_juice_idle', JSON.stringify(state));
    }

    // ═══════════════════════════════════════════════════════════
    //  COMPUTE
    // ═══════════════════════════════════════════════════════════

    function getSPS() {
        const BASE_SPS = 0.05; // Der Biber presst immer – auch ohne Upgrades
        let sps = BASE_SPS + UPGRADES.reduce((sum, u) => sum + u.spsBonus * u.count, 0);
        return sps * state.prestigeBonus;
    }

    function getUpgradeCost(upg) {
        return Math.floor(upg.baseCost * Math.pow(upg.costMult, upg.count));
    }

    function getCurrentTitle() {
        let t = TITLES[0];
        for (const tier of TITLES) {
            if (state.totalJuice >= tier.threshold) t = tier;
        }
        return t;
    }

    // ═══════════════════════════════════════════════════════════
    //  PRESTIGE
    // ═══════════════════════════════════════════════════════════

    function prestige() {
        if (state.totalJuice < 10000) return;
        state.prestigeCount++;
        state.prestigeBonus = 1.0 + state.prestigeCount * 0.5;
        state.juice = 0;
        state.totalJuice = 0;
        UPGRADES.forEach(u => u.count = 0);
        logMsg(`✨ Prestige #${state.prestigeCount}! Bonus ×${state.prestigeBonus.toFixed(1)}`);
        saveState();
        renderUpgrades();
        renderMilestones();
    }

    // ═══════════════════════════════════════════════════════════
    //  BUY UPGRADE
    // ═══════════════════════════════════════════════════════════

    function buyUpgrade(id) {
        const upg = UPGRADES.find(u => u.id === id);
        if (!upg || upg.count >= upg.max) return;
        const cost = getUpgradeCost(upg);
        if (state.juice < cost) return;
        state.juice -= cost;
        upg.count++;
        logMsg(`${upg.icon} ${upg.name} gekauft! (${upg.count}/${upg.max})`);
        triggerWiggle();
        saveState();
    }

    // ═══════════════════════════════════════════════════════════
    //  RENDER
    // ═══════════════════════════════════════════════════════════

    function fmt(n) {
        if (n >= 1e9) return (n / 1e9).toFixed(2) + ' Mrd.';
        if (n >= 1e6) return (n / 1e6).toFixed(2) + ' Mio.';
        if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K';
        return Math.floor(n).toString();
    }

    function renderStats() {
        const sps = getSPS();
        document.getElementById('stat-juice').textContent = fmt(state.juice);
        document.getElementById('stat-sps').textContent = sps.toFixed(1);
        document.getElementById('stat-total').textContent = fmt(state.totalJuice);

        // juice bar (max display = 10000 units of "next milestone")
        const nextMil = MILESTONES.filter(m => m.threshold && !state.unlockedMilestones.includes(m.id))
            .sort((a, b) => a.threshold - b.threshold)[0];
        const target = nextMil ? nextMil.threshold : 10000000;
        const pct = Math.min(100, (state.totalJuice / target) * 100);
        document.getElementById('juice-bar').style.width = pct + '%';
        document.getElementById('juice-bar-label').textContent = nextMil
            ? `Ziel: ${fmt(target)} L (${pct.toFixed(0)}%)`
            : 'MAXIMALER SAFT';

        // title
        const tier = getCurrentTitle();
        document.getElementById('beaver-display').textContent = tier.emoji;
        document.getElementById('beaver-title').textContent = tier.title;

        // prestige button
        const prestBtn = document.getElementById('prestige-btn');
        const canPrestige = state.totalJuice >= 10000;
        prestBtn.classList.toggle('active', canPrestige);
        document.getElementById('prestige-count').textContent =
            `Prestiges: ${state.prestigeCount}  |  Bonus: ×${state.prestigeBonus.toFixed(1)}`;
    }

    function renderUpgrades() {
        const panel = document.getElementById('upgrades-panel');
        // clear only upgrade buttons
        panel.querySelectorAll('.upgrade-btn').forEach(el => el.remove());

        UPGRADES.forEach(upg => {
            const btn = document.createElement('button');
            btn.className = 'upgrade-btn' + (upg.count >= upg.max ? ' maxed' : '');
            btn.onclick = () => {
                buyUpgrade(upg.id);
                renderUpgrades();
            };
            const cost = getUpgradeCost(upg);
            const canBuy = state.juice >= cost && upg.count < upg.max;
            btn.disabled = !canBuy;

            const totalSps = upg.spsBonus * state.prestigeBonus;
            btn.innerHTML = `
            <div class="upg-name">${upg.icon} ${upg.name}</div>
            <div class="upg-desc">${upg.desc} (+${totalSps.toFixed(2)} Saft/s)</div>
            <div class="upg-cost">${upg.count >= upg.max ? '✅ MAXED OUT' : '🧃 ' + fmt(cost) + ' Liter'}</div>
            <span class="upg-count">${upg.count}/${upg.max}</span>
        `;
            panel.appendChild(btn);
        });
    }

    function renderMilestones() {
        const list = document.getElementById('milestone-list');
        list.innerHTML = '';
        const sps = getSPS();
        MILESTONES.forEach(m => {
            let unlocked = state.unlockedMilestones.includes(m.id);

            // check if newly unlocked
            if (!unlocked) {
                if (m.threshold && state.totalJuice >= m.threshold) {
                    state.unlockedMilestones.push(m.id);
                    unlocked = true;
                    logMsg(`🏆 Meilenstein erreicht: ${m.label}!`);
                }
                if (m.spsReq && sps >= m.spsReq) {
                    state.unlockedMilestones.push(m.id);
                    unlocked = true;
                    logMsg(`🏆 Meilenstein: ${m.label}!`);
                }
                if (m.prestigeReq && state.prestigeCount >= m.prestigeReq) {
                    state.unlockedMilestones.push(m.id);
                    unlocked = true;
                    logMsg(`🏆 Prestige-Meilenstein: ${m.label}!`);
                }
            }

            const el = document.createElement('div');
            el.className = 'milestone' + (unlocked ? ' unlocked' : '');
            el.textContent = (unlocked ? '✅ ' : '🔒 ') + m.label;
            list.appendChild(el);
        });
    }

    // ═══════════════════════════════════════════════════════════
    //  LOG & ANIMATIONS
    // ═══════════════════════════════════════════════════════════

    let lastLog = '';

    function logMsg(msg) {
        lastLog = msg;
        document.getElementById('log').textContent = msg;
    }

    let wiggleTimeout;

    function triggerWiggle() {
        const disp = document.getElementById('beaver-display');
        disp.classList.remove('wiggle');
        void disp.offsetWidth;
        disp.classList.add('wiggle');
        clearTimeout(wiggleTimeout);
        wiggleTimeout = setTimeout(() => disp.classList.remove('wiggle'), 500);
    }

    function spawnJuiceDrop() {
        const drop = document.createElement('div');
        drop.className = 'juice-drop';
        drop.textContent = Math.random() > 0.5 ? '🧃' : '🍊';
        drop.style.left = (20 + Math.random() * 60) + 'vw';
        drop.style.top = (30 + Math.random() * 30) + 'vh';
        document.body.appendChild(drop);
        setTimeout(() => drop.remove(), 2600);
    }

    // ═══════════════════════════════════════════════════════════
    //  GAME LOOP
    // ═══════════════════════════════════════════════════════════

    let lastTick = Date.now();
    let logTimer = 0;
    let dropTimer = 0;
    let saveTimer = 0;
    let upgradeRenderTimer = 0;

    function tick() {
        const now = Date.now();
        const dt = (now - lastTick) / 1000;
        lastTick = now;

        const sps = getSPS();
        const gained = sps * dt;
        state.juice += gained;
        state.totalJuice += gained;

        renderStats();

        // Upgrade panel: re-render every 0.5s to update affordability
        upgradeRenderTimer += dt;
        if (upgradeRenderTimer > 0.5) {
            upgradeRenderTimer = 0;
            renderUpgrades();
            renderMilestones();
        }

        // Random log messages
        logTimer += dt;
        if (logTimer > 12 + Math.random() * 8) {
            logTimer = 0;
            logMsg(LOGS[Math.floor(Math.random() * LOGS.length)]);
        }

        // Juice drop particle
        dropTimer += dt;
        const dropInterval = sps > 10 ? 1.5 : sps > 1 ? 3 : 6;
        if (dropTimer > dropInterval) {
            dropTimer = 0;
            spawnJuiceDrop();
            if (sps > 5) triggerWiggle();
        }

        // Auto-save every 10s
        saveTimer += dt;
        if (saveTimer > 10) {
            saveTimer = 0;
            saveState();
        }

        requestAnimationFrame(tick);
    }

    // ═══════════════════════════════════════════════════════════
    //  INIT
    // ═══════════════════════════════════════════════════════════

    loadState();
    renderUpgrades();
    renderMilestones();
    logMsg('🦫 Der Biber presst... 0,05 Liter/s – kaufe Upgrades für mehr!');
    requestAnimationFrame(tick);
</script>
</body>
</html>