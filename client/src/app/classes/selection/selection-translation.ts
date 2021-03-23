import { ShortcutKey } from '@app/classes/shortcut/shortcut-key';
import { SelectionConfig } from '@app/classes/tool-config/selection-config';
import { Subject } from 'rxjs';
import { Vec2 } from '../vec2';

export class SelectionTranslation {
    private readonly LEFT_ARROW: ShortcutKey = new ShortcutKey('arrowleft');
    private readonly RIGHT_ARROW: ShortcutKey = new ShortcutKey('arrowright');
    private readonly DOWN_ARROW: ShortcutKey = new ShortcutKey('arrowdown');
    private readonly UP_ARROW: ShortcutKey = new ShortcutKey('arrowup');
    private readonly DEFAULT_MOVE_ID: number = -1;
    private readonly FIRST_MOVE_TIMEOUT: number = 500;
    private readonly NEXT_MOVES_TIMEOUT: number = 100;
    private readonly TRANSLATION_PIXELS: number = 3;

    private moveId: number;
    private config: SelectionConfig;

    updateSelectionRequest: Subject<Vec2>;

    constructor(config: SelectionConfig) {
        this.config = config;
        this.moveId = this.DEFAULT_MOVE_ID;
        this.updateSelectionRequest = new Subject<Vec2>();
    }

    onKeyDown(event: KeyboardEvent, leftMouseDown: boolean): void {
        if (this.config.selectionCtx !== null) {
            if (this.isArrowKeyDown(event, leftMouseDown)) {
                event.preventDefault();
                if (event.repeat) return;

                this.setArrowKeyDown(event);
                this.updateSelectionRequest.next({
                    x: this.TRANSLATION_PIXELS * this.HorizontalTranslationModifier(),
                    y: this.TRANSLATION_PIXELS * this.VerticalTranslationModifier(),
                } as Vec2);

                this.startArrowKeyTranslation();
            }
        }
    }

    onKeyUp(event: KeyboardEvent): void {
        if (this.config.selectionCtx !== null) {
            this.setArrowKeyUp(event);
            this.clearArrowKeys();
        }
    }

    stopDrawing() {
        this.RIGHT_ARROW.isDown = false;
        this.LEFT_ARROW.isDown = false;
        this.UP_ARROW.isDown = false;
        this.DOWN_ARROW.isDown = false;
        window.clearInterval(this.moveId);
        this.moveId = this.DEFAULT_MOVE_ID;
    }

    startMouseTranslation(event: MouseEvent){

    }


    // TODO: tester
    private isArrowKeyDown(event: KeyboardEvent, leftMouseDown: boolean): boolean {
        return (
            !leftMouseDown &&
            (this.RIGHT_ARROW.equals(event, true) ||
                this.LEFT_ARROW.equals(event, true) ||
                this.UP_ARROW.equals(event, true) ||
                this.DOWN_ARROW.equals(event, true))
        );
    }

    private startArrowKeyTranslation(): void {
        if (this.moveId === this.DEFAULT_MOVE_ID) {
            setTimeout(() => {
                if (this.moveId === this.DEFAULT_MOVE_ID && this.config.selectionCtx !== null)
                    this.moveId = window.setInterval(() => {
                        this.clearArrowKeys();
                        this.updateSelectionRequest.next({
                            x: this.TRANSLATION_PIXELS * this.HorizontalTranslationModifier(),
                            y: this.TRANSLATION_PIXELS * this.VerticalTranslationModifier(),
                        } as Vec2);
                    }, this.NEXT_MOVES_TIMEOUT);
            }, this.FIRST_MOVE_TIMEOUT);
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
