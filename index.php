<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EasterEgg</title>
    <link rel="stylesheet" href="style/style.css">
    <script type="module" src="Main.js" defer></script>
</head>
<body>

<!-- Game Root: wraps all game UI so it can be blurred while a menu is open -->
<div id="game-root">

    <div id="score-board">🧃 <span id="score">0</span></div>

    <button id="fullscreen-btn" data-i18n-title="button.fullscreen" title="Vollbild" aria-label="Vollbild">⛶</button>

    <canvas id="c" aria-label="Spielbereich"></canvas>

    <!-- Upgrade Shop Button -->
    <button id="upgrade-shop-btn" aria-label="Saftladen">Saftladen</button>

    <!-- Pause Menu Button -->
    <button id="menu-btn" data-i18n-title="button.menu" title="Menü" aria-label="Menü">☰</button>
</div>

<!-- Upgrade Shop Overlay -->
<div id="upgrade-shop-overlay">
    <div class="shop-header">
        <h2>Biber Upgrades</h2>
        <div class="shop-points-container">🧃 Saft: <span id="shop-points-val">0</span></div>
        <button class="shop-close-btn" title="Schließen" aria-label="Schließen">&times;</button>
    </div>
    <div id="upgrade-shop-graph">
        <div id="upgrade-shop-content">
            <svg id="upgrade-shop-svg" viewBox="0 0 100 100" preserveAspectRatio="none"></svg>
            <div id="upgrade-shop-nodes"></div>
        </div>
    </div>
</div>

<!-- Pause Menu Overlay -->
<div id="pause-menu-overlay">
    <div id="pause-menu-content">
        <div class="shop-header">
            <h2 data-i18n="menu.title">Menü</h2>
            <button class="pause-menu-close-btn" title="Schließen" aria-label="Schließen">&times;</button>
        </div>

        <div class="pause-menu-section">
            <label for="sound-volume-slider">
                <span data-i18n="menu.sound">Sound-Lautstärke</span>
                <span id="sound-volume-val">50%</span>
            </label>
            <input type="range" id="sound-volume-slider" min="0" max="100" value="50">
        </div>

        <div class="pause-menu-section">
            <label for="music-volume-slider">
                <span data-i18n="menu.music">Musik-Lautstärke</span>
                <span id="music-volume-val">50%</span>
            </label>
            <input type="range" id="music-volume-slider" min="0" max="100" value="50">
        </div>

        <div class="pause-menu-section">
            <label for="language-buttons"><span data-i18n="menu.language">Sprache</span></label>
            <div class="language-buttons" id="language-buttons">
                <button class="lang-btn" data-lang="de">Deutsch</button>
                <button class="lang-btn" data-lang="en">English</button>
            </div>
        </div>

        <div class="pause-menu-section">
            <button id="reset-progress-btn" data-i18n="menu.reset">Fortschritt zurücksetzen</button>
        </div>

        <div class="pause-menu-section save-section">
            <button id="export-progress-btn" data-i18n="menu.export">Fortschritt exportieren</button>
            <button id="import-progress-btn" data-i18n="menu.import">Fortschritt importieren</button>
            <input type="file" id="import-progress-input" accept=".txt" style="display:none">
        </div>

        <div class="pause-menu-section credits-section">
            <h3 data-i18n="menu.credits.title">Credits</h3>
            <p data-i18n="menu.credits.programming">Platzhalter Name – Programmierung</p>
            <p data-i18n="menu.credits.graphics">Platzhalter Name – Grafik</p>
            <p data-i18n="menu.credits.sound">Platzhalter Name – Sound & Musik</p>
        </div>
    </div>
</div>

</body>
</html>
