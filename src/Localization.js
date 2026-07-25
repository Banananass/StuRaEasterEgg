const STORAGE_KEY = 'stura-easter-egg-locale';
/**
 * Flat key → translated-string dictionaries for both supported languages.
 * Keys use dot-notation purely as a naming convention (no nesting at runtime).
 * Use {{placeholder}} syntax for simple variable interpolation via `t()`.
 */
const TRANSLATIONS = {
    de: {
        'button.fullscreen': 'Vollbild',
        'button.debugAddJuice': 'Debug: +1000 Saft',
        'button.menu': 'Menü',
        'button.shop': 'Saftladen',
        'menu.title': 'Menü',
        'menu.sound': 'Sound-Lautstärke',
        'menu.music': 'Musik-Lautstärke',
        'menu.language': 'Sprache',
        'menu.reset': 'Fortschritt zurücksetzen',
        'menu.resetConfirm': 'Gesamten Fortschritt (Saft + Upgrades) wirklich zurücksetzen?',
        'menu.export': 'Fortschritt exportieren',
        'menu.import': 'Fortschritt importieren',
        'menu.importSuccess': 'Fortschritt erfolgreich importiert!',
        'menu.importError': 'Fortschritt konnte nicht importiert werden. Ist die Datei gültig?',
        'menu.credits.title': 'Credits',
        'menu.credits.programming': 'Platzhalter Name – Programmierung',
        'menu.credits.graphics': 'Platzhalter Name – Grafik',
        'menu.credits.sound': 'Platzhalter Name – Sound & Musik',
        'shop.title': 'Biber Upgrades',
        'shop.juice': 'Saft:',
        'shop.level': 'Stufe',
        'shop.max': 'MAXIMALE STUFE',
        'shop.buy': 'Kaufen',
        'shop.locked': '???',
        'shop.requires': 'Erfordert {{req}} zum Freischalten.',
        'shop.and': 'und',
        'shop.requirementLevel': '{{name}} auf Stufe {{level}}',
    },
    en: {
        'button.fullscreen': 'Fullscreen',
        'button.fullscreenExit': 'Exit Fullscreen',
        'button.debugAddJuice': 'Debug: +1000 Juice',
        'button.menu': 'Menu',
        'button.shop': 'Juice Shop',
        'menu.title': 'Menu',
        'menu.sound': 'Sound Volume',
        'menu.music': 'Music Volume',
        'menu.language': 'Language',
        'menu.reset': 'Reset Progress',
        'menu.resetConfirm': 'Really reset all progress (juice + upgrades)?',
        'menu.export': 'Export Progress',
        'menu.import': 'Import Progress',
        'menu.importSuccess': 'Progress imported successfully!',
        'menu.importError': 'Progress could not be imported. Is the file valid?',
        'menu.credits.title': 'Credits',
        'menu.credits.programming': 'Placeholder Name – Programming',
        'menu.credits.graphics': 'Placeholder Name – Graphics',
        'menu.credits.sound': 'Placeholder Name – Sound & Music',
        'shop.title': 'Beaver Upgrades',
        'shop.juice': 'Juice:',
        'shop.level': 'Level',
        'shop.max': 'MAX LEVEL',
        'shop.buy': 'Buy',
        'shop.locked': '???',
        'shop.requires': 'Requires {{req}} to unlock.',
        'shop.and': 'and',
        'shop.requirementLevel': '{{name}} at level {{level}}',
    },
};
/**
 * Localization – tiny static i18n helper for the game's two supported
 * languages (German/English). Not built to scale to more languages, just
 * to cleanly separate translatable strings from the rest of the code.
 */
export class Localization {
    static _locale = 'de';
    /** Fired whenever the active locale changes (used to re-render dynamic UI). */
    static onChange = [];
    static get locale() {
        return this._locale;
    }
    /** Restores the saved locale (if any) and applies it to the static DOM. */
    static init() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved === 'de' || saved === 'en') {
                this._locale = saved;
            }
        }
        catch (e) {
            // localStorage unavailable - fall back to default locale
        }
        this.applyStaticTranslations();
    }
    static setLocale(locale) {
        if (this._locale === locale)
            return;
        this._locale = locale;
        try {
            localStorage.setItem(STORAGE_KEY, locale);
        }
        catch (e) {
            // ignore persistence errors
        }
        this.applyStaticTranslations();
        this.onChange.forEach(cb => cb());
    }
    /** Translates `key` for the current locale, substituting any {{var}} placeholders. */
    static t(key, vars) {
        let text = TRANSLATIONS[this._locale][key] ?? key;
        if (vars) {
            for (const [k, v] of Object.entries(vars)) {
                text = text.split(`{{${k}}}`).join(String(v));
            }
        }
        return text;
    }
    /**
     * Applies translations to every static DOM element tagged with
     * `data-i18n` (textContent) or `data-i18n-title` (title attribute).
     */
    static applyStaticTranslations() {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (key)
                el.textContent = this.t(key);
        });
        document.querySelectorAll('[data-i18n-title]').forEach(el => {
            const key = el.getAttribute('data-i18n-title');
            if (key)
                el.title = this.t(key);
        });
    }
}
//# sourceMappingURL=Localization.js.map