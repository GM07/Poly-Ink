import { ShortcutKey } from '@app/classes/shortcut/shortcut-key';
import { SelectionConfig } from '@app/classes/tool-config/selection-config';
import { Vec2 } from '@app/classes/vec2';
import { Subject } from 'rxjs';
import { MagnetismService } from '@app/services/drawing/magnetism.service';

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
    private translationOrigin: Vec2;
    private bodyWidth: string;
    private bodyHeight: string;

    updateSelectionRequest: Subject<Vec2>;

    constructor(config: SelectionConfig, private magnetismService: MagnetismService) {
        this.bodyWidth = document.body.style.width;
        this.bodyHeight = document.body.style.height;
        this.config = config;
        this.moveId = this.DEFAULT_MOVE_ID;
        this.translationOrigin = { x: 0, y: 0 } as Vec2;
        this.updateSelectionRequest = new Subject<Vec2>();
    }

    onKeyDown(event: KeyboardEvent, leftMouseDown: boolean): void {
        if (this.config.selectionCtx !== null) {
            if (this.isArrowKeyDown(event, leftMouseDown)) {
                event.preventDefault();
                if (event.repeat) return;

                this.setArrowKeyDown(event);
                this.sendUpdateSelectionRequest(
                {
                    x: this.HorizontalTranslationModifier(),
                    y: this.VerticalTranslationModifier(),
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

    onMouseUp(mouseUpCoord: Vec2): void {
        if (this.config.selectionCtx !== null) {
            this.sendUpdateSelectionRequest(this.getTranslation(this.magnetismService.getGridPosition(
              mouseUpCoord, new Vec2(this.config.width, this.config.height))));
        }
    }

    onMouseMove(event: MouseEvent, mouseUpCoord: Vec2): void {
        if (this.config.selectionCtx !== null) {
            let translation = this.getTranslation(this.magnetismService.getGridPosition(mouseUpCoord, new Vec2(this.config.width, this.config.height)));
            this.sendUpdateSelectionRequest(translation);
        }
    }

    startMouseTranslation(mousePosition: Vec2): void {
        this.magnetismService.setDistanceVector(mousePosition, this.config.endCoords, new Vec2(this.config.width, this.config.height));
        this.translationOrigin = mousePosition;
    }

    stopDrawing(): void {
        this.translationOrigin = { x: 0, y: 0 } as Vec2;
        document.body.style.width = this.bodyWidth;
        document.body.style.height = this.bodyHeight;
        this.RIGHT_ARROW.isDown = false;
        this.LEFT_ARROW.isDown = false;
        this.UP_ARROW.isDown = false;
        this.DOWN_ARROW.isDown = false;
        this.clearArrowKeys();
    }

    private sendUpdateSelectionRequest(translation: Vec2): void {
        this.translationOrigin.x += translation.x;
        this.translationOrigin.y += translation.y;
        this.updateSelectionRequest.next(translation);
    }

    private getTranslation(mousePos: Vec2): Vec2 {
        return { x: mousePos.x - this.translationOrigin.x, y: mousePos.y - this.translationOrigin.y } as Vec2;
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
                if (this.moveId === this.DEFAULT_MOVE_ID && this.config.selectionCtx !== null)
                    this.moveId = window.setInterval(() => {
                        this.clearArrowKeys();
                        this.sendUpdateSelectionRequest({
                            x: this.HorizontalTranslationModifier(),
                            y: this.VerticalTranslationModifier(),
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
      if(this.magnetismService.isEnabled){
        return this.magnetismService.getXKeyAjustement(this.config.endCoords.x, this.config.width) + (+this.RIGHT_ARROW.isDown - +this.LEFT_ARROW.isDown) * this.magnetismService.gridService.size;
      } else
        return (+this.RIGHT_ARROW.isDown - +this.LEFT_ARROW.isDown) * this.TRANSLATION_PIXELS;
    }

    private VerticalTranslationModifier(): number {
      if(this.magnetismService.isEnabled)
        return this.magnetismService.getYKeyAjustement(this.config.endCoords.y, this.config.height) + (+this.DOWN_ARROW.isDown - +this.UP_ARROW.isDown) * this.magnetismService.gridService.size;
      else
        return (+this.DOWN_ARROW.isDown - +this.UP_ARROW.isDown) * this.TRANSLATION_PIXELS;
    }
}
