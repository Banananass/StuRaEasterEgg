# StuRaEasterEgg

Dieses Projekt ist ein in **TypeScript** geschriebenes Spiel, das direkt im Webbrowser läuft. Es verwendet ein an Unity angelehntes Component-System.

Die `.ts`-Quelldateien befinden sich im Ordner `src/` und werden für die Laufzeit im Browser lokal in Standard-JavaScript transpiliert. Die fertig kompilierten JavaScript-Dateien sind im Repository versioniert und werden via GitHub Actions per SFTP auf den Webserver deployt.

---

## Architektur & Engine-Design

Das Spiel läuft auf einer kleinen, proprietären Game-Engine, die Ähnlichkeiten mit der Unity-Architektur aufweist:

- **Engine (`Engine.ts`):** Verwaltet den zentralen Loop, berechnet die Framerate-unabhängige Zeitdifferenz, koordiniert den `FixedUpdate`-Schritt und rendert alle aktiven GameObjects anhand ihrer Prioritätenebene.
- **GameObject (`GameObject.ts`):** Die abstrakte Basisklasse für alle beweglichen und anzeigbaren Entitäten. Jedes Objekt besitzt eine Position, Rotation, Skalierung und eine Ebene. Zudem stellt es eine Reihe von Lebenszyklus-Methoden bereit:
  - `awake()`: Wird direkt bei der Erstellung aufgerufen.
  - `start()`: Wird einmalig vor dem ersten Frame ausgeführt.
  - `update(dt)`: Wird bei jedem Render-Frame mit der vergangen Zeit `dt` (in ms) aufgerufen.
  - `fixedUpdate()`: Taktet in einem festen Intervall (50 Hz), für Physik/Gameplay.
  - `draw(ctx)`: Rendert das Objekt auf dem Canvas.
  - `destroy()`: Bereinigt und entfernt das Objekt aus der Engine.
- **InputManager (`InputManager.ts`):** Kapselt die Verfolgung des Mauszeigers und rechnet die Event-Koordinaten automatisch in das virtuelle Pixelgitter um.

---

## Projektstruktur

```text
StuRaEasterEgg/
├── config.ts              # Globale Spieleinstellungen (Auflösung, Tickrate, FPS-Limit)
├── index.php              # PHP/HTML-Einstiegspunkt; bindet das Stylesheet und gameLoop.js ein
├── package.json           # Node.js-Konfiguration für Skripte und TypeScript-Abhängigkeiten
├── tsconfig.json          # TypeScript-Compiler-Konfiguration
│
├── style/
│   └── style.css          # Styling für Canvas (Responsivität) und das Scoreboard-Display
│
└── src/
    ├── Beaver.ts          # Spieler-Klasse (Steuerung, Bewegung und Canvas-Rendering)
    ├── Juicebox.ts        # Sammelbares Item mit Proximity-Erkennung & Timer-Logik
    ├── ParticleSystem.ts  # Visuelle Partikeleffekte beim Einsammeln
    ├── ScoreManager.ts    # Verwalter für den aktuellen Punktestand und DOM-Aktualisierungen
    │
    └── Engine/
        ├── Engine.ts      # Core Game Loop & Renderer (requestAnimationFrame)
        ├── GameObject.ts  # Abstrakte Spielobjekt-Klasse mit Transform- & Lifecycle-Eigenschaften
        ├── InputManager.ts# Globale Eingabeerfassung (Maus-zu-Canvas-Mapping)
        └── gameLoop.ts    # Bootstrap-Einstiegspunkt; initialisiert Engine und Start-Objekte
```

> **Hinweis:** Bearbeite bitte ausschließlich die `.ts`-Dateien im `src/`-Ordner (und `config.ts`). Die `.js`- und `.js.map`-Dateien werden durch den Build-Prozess automatisch generiert und überschrieben.

---

## Lokale Entwicklung

Zur lokalen Bearbeitung benötigst du **Node.js** (inklusive `npm`) auf deinem System.

### 1. Abhängigkeiten installieren
Führe diesen Befehl einmalig im Projektverzeichnis aus, um TypeScript und zugehörige Tools lokal einzurichten:
```bash
npm install
```

### 2. TypeScript-Dateien überwachen (Watch-Modus)
Nutze während der Entwicklung diesen Befehl. Er beobachtet deine `.ts`-Dateien und transpiliert sie bei jeder Speicherung automatisch neu in `.js`:
```bash
npm run watch
```

### 3. Einmalig bauen (Build)
Um alle TypeScript-Dateien einmalig manuell vor einem Deploy oder Commit komplett zu kompilieren:
```bash
npm run build
```

---

## Automatisches Deployment (SFTP)

Bei jedem Push auf den `main`-Branch wird das Spiel über eine GitHub Action automatisch auf den Server deployt. Da der Webserver direkt die kompilierten `.js`-Dateien ausführt, **müssen diese mit im Git-Repository eingecheckt und gepusht werden!**

Stelle sicher, dass im GitHub-Repository folgende Secrets hinterlegt sind:

- `SFTP_HOST` – Die Server-Adresse
- `SFTP_PORT` – Verbindungs-Port (Standard ist `22`)
- `SFTP_USERNAME` – SFTP-Benutzername
- `SFTP_REMOTE_DIR` – Zielverzeichnis auf dem Server
- `SFTP_PASSWORD` – Erforderlich, falls kein SSH-Key genutzt wird
- `SFTP_PRIVATE_KEY` – Optionale Alternative zur Passwort-Authentifizierung

> [!WARNING]
> Das Deployment-Skript nutzt `mirror -R --delete`. Das bedeutet, dass alle Dateien im `SFTP_REMOTE_DIR` auf dem Server gelöscht werden, die **nicht** in diesem Git-Repository vorhanden sind. Erstelle saubere Backups, bevor du ein erstes Deployment fährst.

