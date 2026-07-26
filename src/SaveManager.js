import { ScoreManager } from './ScoreManager.js';
import { UpgradeShop } from './UpgradeShop.js';
import { Beaver } from './Beaver.js';
import { JuiceboxSpawner } from './JuiceboxSpawner.js';
const STORAGE_KEY = 'stura-easter-egg-save';
const SAVE_VERSION = 1;
/**
 * SaveManager – handles local persistence (localStorage) and manual
 * export/import of progress as a base64-encoded .txt file.
 */
export class SaveManager {
    static serialize() {
        return {
            version: SAVE_VERSION,
            score: ScoreManager.Instance.score,
            upgrades: UpgradeShop.getAllLevels(),
        };
    }
    /**
     * Applies loaded save data. When `cleanStart` is true (used for manual
     * imports), everything is first reset to its initial state (beaver
     * centered, upgrades/score zeroed) before the loaded values are applied,
     * so an import always yields a consistent fresh state rather than
     * merging with whatever was on screen before.
     */
    static apply(data, cleanStart = false) {
        if (!data || typeof data !== 'object')
            return;
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
    static save() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.serialize()));
        }
        catch (e) {
            console.warn('Speichern des Fortschritts fehlgeschlagen:', e);
        }
    }
    /** Loads progress from localStorage, if present, and applies it. */
    static load() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw)
                return;
            const data = JSON.parse(raw);
            this.apply(data);
        }
        catch (e) {
            console.warn('Laden des Fortschritts fehlgeschlagen:', e);
        }
    }
    /** Base64-encodes a UTF-8 string (handles German umlauts etc. safely). */
    static encodeBase64(str) {
        return btoa(unescape(encodeURIComponent(str)));
    }
    /** Decodes a base64 string back into a UTF-8 string. */
    static decodeBase64(str) {
        return decodeURIComponent(escape(atob(str)));
    }
    /** Exports the current progress as a downloadable base64-encoded .txt file. */
    static exportToFile() {
        const json = JSON.stringify(this.serialize());
        const base64 = this.encodeBase64(json);
        const blob = new Blob([base64], { type: 'text/plain' });
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
    static importFromFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                try {
                    const base64 = String(reader.result).trim();
                    const json = this.decodeBase64(base64);
                    const data = JSON.parse(json);
                    this.apply(data, true);
                    this.save();
                    resolve();
                }
                catch (e) {
                    reject(e);
                }
            };
            reader.onerror = () => reject(reader.error);
            reader.readAsText(file);
        });
    }
}
//# sourceMappingURL=SaveManager.js.map