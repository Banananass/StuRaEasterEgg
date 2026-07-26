import {ScoreManager} from './ScoreManager.js';
import {UpgradeShop} from './UpgradeShop.js';
import {Beaver} from './Beaver.js';
import {JuiceboxSpawner} from './JuiceboxSpawner.js';

const STORAGE_KEY = 'stura-easter-egg-save';
const SAVE_VERSION = 1;

interface SaveData {
    version: number;
    score: number;
    upgrades: Record<string, number>;
}

/**
 * SaveManager – handles local persistence (localStorage) and manual
 * export/import of progress as a base64-encoded .txt file.
 */
export class SaveManager {

    private static serialize(): SaveData {
        return {
            version: SAVE_VERSION,
            score: ScoreManager.Instance.score,
            upgrades: UpgradeShop.getAllLevels(),
        };
    }

    /** Applies loaded save data. `cleanStart` resets everything first (used for imports, so they don't merge with the current state). */
    private static apply(data: SaveData, cleanStart: boolean = false): void {
        if (!data || typeof data !== 'object') return;

        if (cleanStart) {
            UpgradeShop.resetProgress();
            ScoreManager.Instance.resetScore();
            Beaver.resetState();
        }

        ScoreManager.Instance.setScore(data.score || 0);
        UpgradeShop.applyLevels(data.upgrades || {});

        // Re-evaluate juicebox spawns against the (possibly changed) upgrade
        // levels; any newly needed juiceboxes start on cooldown, not instantly.
        JuiceboxSpawner.resetState();
    }

    /** Persists the current progress to localStorage. */
    public static save(): void {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.serialize()));
        } catch (e) {
            console.warn('Speichern des Fortschritts fehlgeschlagen:', e);
        }
    }

    /** Loads progress from localStorage, if present, and applies it. */
    public static load(): void {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return;
            const data: SaveData = JSON.parse(raw);
            this.apply(data);
        } catch (e) {
            console.warn('Laden des Fortschritts fehlgeschlagen:', e);
        }
    }

    /** Base64-encodes a UTF-8 string (handles German umlauts etc. safely). */
    private static encodeBase64(str: string): string {
        return btoa(unescape(encodeURIComponent(str)));
    }

    /** Decodes a base64 string back into a UTF-8 string. */
    private static decodeBase64(str: string): string {
        return decodeURIComponent(escape(atob(str)));
    }

    /** Exports the current progress as a downloadable base64-encoded .txt file. */
    public static exportToFile(): void {
        const json = JSON.stringify(this.serialize());
        const base64 = this.encodeBase64(json);

        const blob = new Blob([base64], {type: 'text/plain'});
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `biber-saftladen-save-${Date.now()}.txt`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    }

    /** Imports progress from a base64-encoded .txt file previously produced by exportToFile(). */
    public static importFromFile(file: File): Promise<void> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                try {
                    const base64 = String(reader.result).trim();
                    const json = this.decodeBase64(base64);
                    const data: SaveData = JSON.parse(json);
                    this.apply(data, true);
                    this.save();
                    resolve();
                } catch (e) {
                    reject(e);
                }
            };
            reader.onerror = () => reject(reader.error);
            reader.readAsText(file);
        });
    }
}
