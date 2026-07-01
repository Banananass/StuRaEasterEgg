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

<div id="score-board">🧃 <span id="score">0</span></div>

<canvas id="c"></canvas>

<!-- Upgrade Shop Button -->
<button id="upgrade-shop-btn">Saftladen</button>

<!-- Upgrade Shop Overlay -->
<div id="upgrade-shop-overlay">
    <div class="shop-header">
        <h2>Biber Upgrades</h2>
        <div class="shop-points-container">🧃 Saft: <span id="shop-points-val">0</span></div>
        <button class="shop-close-btn">&times;</button>
    </div>
    <div id="upgrade-shop-graph">
        <div id="upgrade-shop-content">
            <svg id="upgrade-shop-svg" viewBox="0 0 100 100" preserveAspectRatio="none"></svg>
            <div id="upgrade-shop-nodes"></div>
        </div>
    </div>
</div>

</body>
</html>
