import { ShortcutKey } from '@app/classes/shortcut/shortcut-key';
import { SelectionConfig } from '@app/classes/tool-config/selection-config';
import { Vec2 } from '@app/classes/vec2';
import { MagnetismService } from '@app/services/drawing/magnetism.service';
import { Subject } from 'rxjs';

export class SelectionTranslation {
    readonly UPDATE_SELECTION_REQUEST: Subject<Vec2> = new Subject<Vec2>();
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
    private translationOrigin: Vec2;
    private bodyWidth: string;
    private bodyHeight: string;
    private isMouseTranslationStarted: boolean;

    constructor(config: SelectionConfig, private magnetismService: MagnetismService) {
        this.bodyWidth = document.body.style.width;
        this.bodyHeight = document.body.style.height;
        this.config = config;
        this.moveId = this.DEFAULT_MOVE_ID;
        this.translationOrigin = new Vec2(0, 0);
        this.isMouseTranslationStarted = false;
    }

    onKeyDown(event: KeyboardEvent, leftMouseDown: boolean): void {
        if (this.config.previewSelectionCtx !== null) {
            if (this.isArrowKeyDown(event, leftMouseDown)) {
                event.preventDefault();
                if (event.repeat) return;

                this.setArrowKeyDown(event);
                this.sendUpdateSelectionRequest(new Vec2(this.HorizontalTranslationModifier(), this.VerticalTranslationModifier()));

                this.startArrowKeyTranslation();
            }
        }
    }

    onKeyUp(event: KeyboardEvent): void {
        if (this.config.previewSelectionCtx !== null) {
            this.setArrowKeyUp(event);
            this.clearArrowKeys();
        }
    }

    onMouseUp(mouseUpCoord: Vec2): void {
        if (this.config.previewSelectionCtx !== null && this.isMouseTranslationStarted) {
            this.sendUpdateSelectionRequest(this.getTranslation(this.magnetismService.getGridPosition(mouseUpCoord)));
        }
    }

    onMouseMove(event: MouseEvent, mouseUpCoord: Vec2): void {
        if (this.config.previewSelectionCtx !== null && this.isMouseTranslationStarted) {
            const translation = this.getTranslation(this.magnetismService.getGridPosition(mouseUpCoord));
            this.sendUpdateSelectionRequest(translation);
            document.body.style.width = event.pageX + this.config.width + 'px';
            document.body.style.height = event.pageY + this.config.height + 'px';
        }
    }

    startMouseTranslation(mousePosition: Vec2): void {
        this.magnetismService.setDistanceVector(mousePosition, this.config.endCoords, new Vec2(this.config.width, this.config.height));
        this.isMouseTranslationStarted = true;
        this.translationOrigin = mousePosition;
    }

    stopDrawing(): void {
        this.isMouseTranslationStarted = false;
        this.translationOrigin = new Vec2(0, 0);
        document.body.style.width = this.bodyWidth;
        document.body.style.height = this.bodyHeight;
        this.RIGHT_ARROW.isDown = false;
        this.LEFT_ARROW.isDown = false;
        this.UP_ARROW.isDown = false;
        this.DOWN_ARROW.isDown = false;
        this.clearArrowKeys();
    }

    private sendUpdateSelectionRequest(translation: Vec2): void {
        this.translationOrigin = this.translationOrigin.add(translation);
        this.UPDATE_SELECTION_REQUEST.next(translation);
    }

    private getTranslation(mousePos: Vec2): Vec2 {
        return mousePos.substract(this.translationOrigin);
    }

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
                if (this.moveId === this.DEFAULT_MOVE_ID && this.config.previewSelectionCtx !== null)
                    this.moveId = window.setInterval(() => {
                        this.clearArrowKeys();
                        this.sendUpdateSelectionRequest(new Vec2(this.HorizontalTranslationModifier(), this.VerticalTranslationModifier()));
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
        if (this.magnetismService.isEnabled) {
            return (
                this.magnetismService.getXKeyAjustement(this.config.endCoords.x, this.config.width) +
                (+this.RIGHT_ARROW.isDown - +this.LEFT_ARROW.isDown) * this.magnetismService.gridService.size
            );
        } else return (+this.RIGHT_ARROW.isDown - +this.LEFT_ARROW.isDown) * this.TRANSLATION_PIXELS;
    }

    private VerticalTranslationModifier(): number {
        if (this.magnetismService.isEnabled)
            return (
                this.magnetismService.getYKeyAjustement(this.config.endCoords.y, this.config.height) +
                (+this.DOWN_ARROW.isDown - +this.UP_ARROW.isDown) * this.magnetismService.gridService.size
            );
        else return (+this.DOWN_ARROW.isDown - +this.UP_ARROW.isDown) * this.TRANSLATION_PIXELS;
    }
}
