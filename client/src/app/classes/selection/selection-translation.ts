import { ShortcutKey } from '@app/classes/shortcut/shortcut-key';
import { SelectionConfig } from '@app/classes/tool-config/selection-config';

export class SelectionTranslation {
    private readonly LEFT_ARROW: ShortcutKey = new ShortcutKey('arrowleft');
    private readonly RIGHT_ARROW: ShortcutKey = new ShortcutKey('arrowright');
    private readonly DOWN_ARROW: ShortcutKey = new ShortcutKey('arrowdown');
    private readonly UP_ARROW: ShortcutKey = new ShortcutKey('arrowup');
    private readonly DEFAULT_MOVE_ID: number = -1;
    private readonly FIRST_MOVE_TIMEOUT: number = 500;
    private readonly NEXT_MOVES_TIMEOUT: number = 100;

    private moveId: number;
    private config: SelectionConfig;

    constructor(config: SelectionConfig) {
        this.config = config;
        this.moveId = this.DEFAULT_MOVE_ID;
    }

    stopDrawing() {
        this.RIGHT_ARROW.isDown = false;
        this.LEFT_ARROW.isDown = false;
        this.UP_ARROW.isDown = false;
        this.DOWN_ARROW.isDown = false;
        window.clearInterval(this.moveId);
        this.moveId = this.DEFAULT_MOVE_ID;
    }

    onKeyDown(event: KeyboardEvent, leftMouseDown: boolean): void {
        if (this.config.selectionCtx !== null) {
            const PIXELS = 3;
            if (
                !leftMouseDown &&
                (this.RIGHT_ARROW.equals(event, true) ||
                    this.LEFT_ARROW.equals(event, true) ||
                    this.UP_ARROW.equals(event, true) ||
                    this.DOWN_ARROW.equals(event, true))
            ) {
                event.preventDefault();
                if (event.repeat) return;
                this.setArrowKeyDown(event);
                this.updateSelection({ x: PIXELS * this.HorizontalTranslationModifier(), y: PIXELS * this.VerticalTranslationModifier() } as Vec2);

                if (this.moveId === this.DEFAULT_MOVE_ID) {
                    setTimeout(() => {
                        if (this.moveId === this.DEFAULT_MOVE_ID && this.config.selectionCtx !== null)
                            this.moveId = window.setInterval(() => {
                                this.clearArrowKeys();
                                this.updateSelection({
                                    x: PIXELS * this.HorizontalTranslationModifier(),
                                    y: PIXELS * this.VerticalTranslationModifier(),
                                } as Vec2);
                            }, this.NEXT_MOVES_TIMEOUT);
                    }, this.FIRST_MOVE_TIMEOUT);
                }
            }
        }
    }

    onKeyUp(event: KeyboardEvent): void {
        if (this.config.selectionCtx !== null) {
            this.setArrowKeyUp(event);
            this.clearArrowKeys();
        }
    }

    private setArrowKeyDown(event: KeyboardEvent): void {
        if (this.RIGHT_ARROW.equals(event, true)) this.RIGHT_ARROW.isDown = true;
        if (this.LEFT_ARROW.equals(event, true)) this.LEFT_ARROW.isDown = true;
        if (this.UP_ARROW.equals(event, true)) this.UP_ARROW.isDown = true;
        if (this.DOWN_ARROW.equals(event, true)) this.DOWN_ARROW.isDown = true;
    }

    private setArrowKeyUp(event: KeyboardEvent): void {
        if (this.RIGHT_ARROW.equals(event, true)) this.RIGHT_ARROW.isDown = false;
        if (this.LEFT_ARROW.equals(event, true)) this.LEFT_ARROW.isDown = false;
        if (this.UP_ARROW.equals(event, true)) this.UP_ARROW.isDown = false;
        if (this.DOWN_ARROW.equals(event, true)) this.DOWN_ARROW.isDown = false;
    }

    private clearArrowKeys(): void {
        if (!this.RIGHT_ARROW.isDown && !this.LEFT_ARROW.isDown && !this.UP_ARROW.isDown && !this.DOWN_ARROW.isDown) {
            window.clearInterval(this.moveId);
            this.moveId = this.DEFAULT_MOVE_ID;
        }
    }

    private HorizontalTranslationModifier(): number {
        return +this.RIGHT_ARROW.isDown - +this.LEFT_ARROW.isDown;
    }

    private VerticalTranslationModifier(): number {
        return +this.DOWN_ARROW.isDown - +this.UP_ARROW.isDown;
    }
}
