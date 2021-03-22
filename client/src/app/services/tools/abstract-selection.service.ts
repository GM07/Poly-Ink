import { Injectable } from '@angular/core';
import { Geometry } from '@app/classes/math/geometry';
import { ShiftKey } from '@app/classes/shortcut/shift-key';
import { ShortcutKey } from '@app/classes/shortcut/shortcut-key';
import { Tool } from '@app/classes/tool';
import { SelectionConfig } from '@app/classes/tool-config/selection-config';
import { Vec2 } from '@app/classes/vec2';
import { MouseButton } from '@app/constants/control';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { Subject } from 'rxjs';
import { ColorService } from 'src/color-picker/services/color.service';

@Injectable({
    providedIn: 'root',
})
export abstract class AbstractSelectionService extends Tool {
    protected readonly LINE_DASH: number = 8;
    protected readonly BORDER_WIDTH: number = 2;
    private readonly SELECT_ALL: ShortcutKey = new ShortcutKey('a', true);
    private readonly CANCEL_SELECTION: ShortcutKey = new ShortcutKey('escape');
    private readonly LEFT_ARROW: ShortcutKey = new ShortcutKey('arrowleft');
    private readonly RIGHT_ARROW: ShortcutKey = new ShortcutKey('arrowright');
    private readonly DOWN_ARROW: ShortcutKey = new ShortcutKey('arrowdown');
    private readonly UP_ARROW: ShortcutKey = new ShortcutKey('arrowup');
    private readonly DEFAULT_MOVE_ID: number = -1;
    private readonly FIRST_MOVE_TIMEOUT: number = 500;
    private readonly NEXT_MOVES_TIMEOUT: number = 100;
    protected readonly SHIFT: ShortcutKey = new ShiftKey();
    protected SELECTION_DATA: HTMLCanvasElement;

    updatePoints: Subject<boolean>;
    mouseUpCoord: Vec2;
    translationOrigin: Vec2;
    config: SelectionConfig = new SelectionConfig();

    selectionCtx: CanvasRenderingContext2D | null;

    private moveId: number;
    private bodyWidth: string;
    private bodyHeight: string;

    constructor(drawingService: DrawingService, colorService: ColorService) {
        super(drawingService, colorService);
        this.SELECTION_DATA = document.createElement('canvas');
        this.selectionCtx = null;
        this.config.endCoords = { x: 0, y: 0 } as Vec2;
        this.translationOrigin = { x: 0, y: 0 } as Vec2;
        this.moveId = this.DEFAULT_MOVE_ID;
        this.drawingService.changes.subscribe(() => {
            this.updateSelection({ x: 0, y: 0 } as Vec2);
        });
        this.bodyWidth = document.body.style.width;
        this.bodyHeight = document.body.style.height;
        this.updatePoints = new Subject<boolean>();
    }

    protected abstract endSelection(): void;

    protected abstract fillBackground(ctx: CanvasRenderingContext2D, currentPos: Vec2): void;

    protected abstract updateSelectionRequired(): void;

    protected abstract drawPreviewSelectionRequired(): void;

    protected abstract drawSelection(ctx: CanvasRenderingContext2D, position: Vec2, size: Vec2): void;

    onMouseDown(event: MouseEvent): void {
        this.leftMouseDown = event.button === MouseButton.Left;
        if (this.leftMouseDown && !this.isInSelection(event)) {
            console.log('mdown');
            document.body.style.width = this.bodyWidth;
            document.body.style.height = this.bodyHeight;
            const mousePos = this.getPositionFromMouse(event);
            this.endSelection();
            this.mouseDownCoord = mousePos;
            this.mouseUpCoord = mousePos;
            this.config.width = this.mouseUpCoord.x - this.mouseDownCoord.x;
            this.config.height = this.mouseUpCoord.y - this.mouseDownCoord.y;
            this.updatePoints.next(false);
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.leftMouseDown) {
            this.setMouseUpCoord(event);
            if (this.selectionCtx === null) {
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.startSelection();
            } else {
                this.updateSelection(this.getTranslation(this.mouseUpCoord));
            }
        }
        this.leftMouseDown = false;
    }

    onMouseMove(event: MouseEvent): void {
        if (this.leftMouseDown) {
            this.setMouseUpCoord(event);
            if (this.selectionCtx !== null) {
                this.updateSelection(this.getTranslation(this.mouseUpCoord));
                document.body.style.width = event.pageX + this.config.width + 'px';
                document.body.style.height = event.pageY + this.config.height + 'px';
            } else {
                const ctx = this.drawingService.previewCtx;
                this.drawingService.clearCanvas(ctx);
                this.drawPreviewSelection();
            }
            console.log(this.translationOrigin, this.mouseUpCoord, this.mouseDownCoord);
        }
    }

    onKeyDown(event: KeyboardEvent): void {
        if (this.CANCEL_SELECTION.equals(event)) {
            this.stopDrawing();
        } else if (this.SELECT_ALL.equals(event)) {
            event.preventDefault();
            this.selectAll();
        } else if (this.SHIFT.equals(event)) {
            this.config.shiftDown = true;
            if (this.leftMouseDown && this.selectionCtx === null) {
                this.updateDrawingSelection();
            }
        } else if (this.selectionCtx !== null) {
            const PIXELS = 3;
            if (
                !this.leftMouseDown &&
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
                        if (this.moveId === this.DEFAULT_MOVE_ID && this.selectionCtx !== null)
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
        if (this.SHIFT.equals(event)) {
            this.config.shiftDown = false;
            if (this.leftMouseDown && this.selectionCtx === null) {
                this.updateDrawingSelection();
            }
        }
        if (this.selectionCtx !== null) {
            this.setArrowKeyUp(event);
            this.clearArrowKeys();
        }
    }

    selectAll(): void {
        this.endSelection();
        this.config.endCoords = { x: 0, y: 0 } as Vec2;
        const width = this.drawingService.canvas.width;
        const height = this.drawingService.canvas.height;
        this.mouseDownCoord = { x: 0, y: 0 } as Vec2;
        this.mouseUpCoord = { x: width, y: height } as Vec2;
        this.config.width = width;
        this.config.height = height;
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.startSelection();
        this.updatePoints.next(true);
    }

    isInSelection(event: MouseEvent): boolean {
        if (this.selectionCtx === null) return false;

        const left = this.config.endCoords.x;
        const right = this.config.endCoords.x + Math.abs(this.config.width);
        const top = this.config.endCoords.y;
        const bottom = this.config.endCoords.y + Math.abs(this.config.height);

        const currentPos = this.getPositionFromMouse(event);
        return currentPos.x >= left && currentPos.x <= right && currentPos.y >= top && currentPos.y <= bottom;
    }

    stopDrawing(): void {
        this.endSelection();
        this.leftMouseDown = false;
        this.config.shiftDown = false;
        this.drawingService.clearCanvas(this.drawingService.previewCtx);

        this.RIGHT_ARROW.isDown = false;
        this.LEFT_ARROW.isDown = false;
        this.UP_ARROW.isDown = false;
        this.DOWN_ARROW.isDown = false;
        window.clearInterval(this.moveId);
        this.moveId = this.DEFAULT_MOVE_ID;
        this.updatePoints.next(false);
    }

    getTranslation(mousePos: Vec2): Vec2 {
        return { x: mousePos.x - this.translationOrigin.x, y: mousePos.y - this.translationOrigin.y } as Vec2;
    }

    private setMouseUpCoord(event: MouseEvent): void {
        if (this.leftMouseDown && this.selectionCtx === null && !this.isInCanvas(event)) {
            const rect = this.drawingService.canvas.getBoundingClientRect();
            const mousePos: Vec2 = this.getPositionFromMouse(event);
            if (event.x >= rect.right) mousePos.x = this.drawingService.canvas.width;
            if (event.x <= rect.left) mousePos.x = 0;
            if (event.y <= rect.top) mousePos.y = 0;
            if (event.y >= rect.bottom) mousePos.y = this.drawingService.canvas.height;
            this.mouseUpCoord = mousePos;
        } else {
            this.mouseUpCoord = this.getPositionFromMouse(event);
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

    private startSelection(): void {
        if (Geometry.roundTowardsZero(this.config.width) === 0 || Geometry.roundTowardsZero(this.config.height) === 0) {
            this.drawingService.unblockUndoRedo();
            return;
        }
        this.SELECTION_DATA.width = Math.abs(this.config.width);
        this.SELECTION_DATA.height = Math.abs(this.config.height);
        this.selectionCtx = this.SELECTION_DATA.getContext('2d') as CanvasRenderingContext2D;
        const x = Math.min(this.mouseDownCoord.x, this.mouseDownCoord.x + this.config.width);
        const y = Math.min(this.mouseDownCoord.y, this.mouseDownCoord.y + this.config.height);
        this.config.endCoords = { x, y } as Vec2;
        this.config.startCoords = { x, y } as Vec2;

        this.selectionCtx.drawImage(
            this.drawingService.canvas,
            x,
            y,
            Math.abs(this.config.width),
            Math.abs(this.config.height),
            0,
            0,
            Math.abs(this.config.width),
            Math.abs(this.config.height),
        );

        const previewCtx = this.drawingService.previewCtx;
        previewCtx.drawImage(this.SELECTION_DATA, x, y);

        this.drawPreviewSelection();
        this.updatePoints.next(true);
    }

    private updateSelection(translation: Vec2): void {
        if (this.selectionCtx === null) return;

        this.config.endCoords.x += translation.x;
        this.config.endCoords.y += translation.y;
        this.translationOrigin.x += translation.x;
        this.translationOrigin.y += translation.y;
        this.updateSelectionRequired();
        this.updatePoints.next(true);
    }

    private drawPreviewSelection(): void {
        this.drawingService.blockUndoRedo();

        this.config.width = this.mouseUpCoord.x - this.mouseDownCoord.x;
        this.config.height = this.mouseUpCoord.y - this.mouseDownCoord.y;

        this.drawPreviewSelectionRequired();
    }

    private updateDrawingSelection(): void {
        const ctx = this.drawingService.previewCtx;
        this.drawingService.clearCanvas(ctx);
        this.drawPreviewSelection();
    }
}
