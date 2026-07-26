import {Time} from './Engine/Time.js';
import {ScoreManager} from './ScoreManager.js';
import {UpgradeShop} from './UpgradeShop.js';
import {Beaver} from './Beaver.js';
import {JuiceboxSpawner} from './JuiceboxSpawner.js';
import {SaveManager} from './SaveManager.js';
import {Localization, Locale} from './Localization.js';

/**
 * PauseMenu – modal menu that pauses the game and blurs the background while
 * open (sound/music sliders, reset-progress, credits). Escape/Space handling
 * lives in Main.ts, which ensures this and the UpgradeShop are never open together.
 */
export class PauseMenu {
    public static isOpen: boolean = false;

    private readonly gameRoot: HTMLElement | null;
    private readonly overlay: HTMLElement | null;
    private readonly content: HTMLElement | null;

    constructor(toggleButtonId: string, overlayId: string, contentId: string) {
        this.gameRoot = document.getElementById('game-root');
        this.overlay = document.getElementById(overlayId);
        this.content = document.getElementById(contentId);

        const toggleBtn = document.getElementById(toggleButtonId);
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => this.toggle());
        }

        if (this.overlay) {
            const closeBtn = this.overlay.querySelector('.pause-menu-close-btn');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => this.close());
            }

            // Click outside the menu content (on the backdrop itself) closes it
            this.overlay.addEventListener('click', (e: MouseEvent) => {
                if (e.target === this.overlay) this.close();
            });
        }

        this.setupSliders();
        this.setupResetButton();
        this.setupSaveButtons();
        this.setupLanguageButtons();
    }

    private setupLanguageButtons(): void {
        const buttons = document.querySelectorAll<HTMLButtonElement>('.lang-btn');
        if (buttons.length === 0) return;

        const updateActiveState = () => {
            buttons.forEach(btn => {
                const lang = btn.getAttribute('data-lang');
                btn.classList.toggle('active', lang === Localization.locale);
            });
        };

        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                const lang = btn.getAttribute('data-lang') as Locale | null;
                if (lang) Localization.setLocale(lang);
            });
        });

        Localization.onChange.push(updateActiveState);
        updateActiveState();
    }

    private setupSliders(): void {
        this.bindSlider('sound-volume-slider', 'sound-volume-val');
        this.bindSlider('music-volume-slider', 'music-volume-val');
    }

    private bindSlider(sliderId: string, labelId: string): void {
        const slider = document.getElementById(sliderId) as HTMLInputElement | null;
        const label = document.getElementById(labelId);
        if (!slider || !label) return;

        const updateLabel = () => label.textContent = `${slider.value}%`;
        slider.addEventListener('input', updateLabel);
        updateLabel();
    }

    private setupResetButton(): void {
        const resetBtn = document.getElementById('reset-progress-btn');
        if (!resetBtn) return;

        resetBtn.addEventListener('click', () => {
            if (!confirm(Localization.t('menu.resetConfirm'))) return;
            this.resetToInitialState();
        });
    }

    /** Restores the entire game to its freshly-loaded initial state. */
    private resetToInitialState(): void {
        UpgradeShop.resetProgress();
        ScoreManager.Instance.resetScore();
        Beaver.resetState();
        JuiceboxSpawner.resetState();
        UpgradeShop.close();
        this.close();
        SaveManager.save();
    }

    private setupSaveButtons(): void {
        const exportBtn = document.getElementById('export-progress-btn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => SaveManager.exportToFile());
        }

        const importBtn = document.getElementById('import-progress-btn');
        const importInput = document.getElementById('import-progress-input') as HTMLInputElement | null;
        if (importBtn && importInput) {
            importBtn.addEventListener('click', () => importInput.click());

            importInput.addEventListener('change', () => {
                const file = importInput.files && importInput.files[0];
                importInput.value = '';
                if (!file) return;

                SaveManager.importFromFile(file)
                    .then(() => {
                        UpgradeShop.close();
                        this.close();
                        alert(Localization.t('menu.importSuccess'));
                    })
                    .catch((e) => {
                        console.warn('Import fehlgeschlagen:', e);
                        alert(Localization.t('menu.importError'));
                    });
            });
        }
    }

    public toggle(): void {
        if (PauseMenu.isOpen) this.close();
        else this.open();
    }

    public open(): void {
        PauseMenu.isOpen = true;
        Time.timeScale = 0;
        if (this.overlay) this.overlay.style.display = 'flex';
        if (this.gameRoot) this.gameRoot.classList.add('blurred');
    }

    public close(): void {
        PauseMenu.isOpen = false;
        Time.timeScale = 1;
        if (this.overlay) this.overlay.style.display = 'none';
        if (this.gameRoot) this.gameRoot.classList.remove('blurred');
    }
}
