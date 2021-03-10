import { Injectable } from '@angular/core';
import { ShiftKey } from '@app/classes/shortcut/shift-key';
import { ShortcutKey } from '@app/classes/shortcut/shortcut-key';
import { Tool } from '@app/classes/tool';
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

    updatePoints: Subject<boolean> = new Subject();
    mouseUpCoord: Vec2;
    protected translationOrigin: Vec2;
    protected firstSelectionCoords: Vec2;
    selectionCoords: Vec2;

    width: number;
    height: number;
    selectionCtx: CanvasRenderingContext2D | null;

    private moveId: number;

    constructor(drawingService: DrawingService, colorService: ColorService) {
        super(drawingService, colorService);
        this.SELECTION_DATA = document.createElement('canvas');
        this.selectionCtx = null;
        this.selectionCoords = { x: 0, y: 0 } as Vec2;
        this.translationOrigin = { x: 0, y: 0 } as Vec2;
        this.moveId = this.DEFAULT_MOVE_ID;
    }

    protected abstract endSelection(): void;

    protected abstract fillBackground(ctx: CanvasRenderingContext2D, currentPos: Vec2): void;

    protected abstract updateSelectionRequired(): void;

    protected abstract drawPreviewSelectionRequired(): void;

    protected abstract drawSelection(ctx: CanvasRenderingContext2D, position: Vec2, width: number, height: number): void;

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        if (this.mouseDown) {
            const mousePos = this.getPositionFromMouse(event);
            if (this.isInSelection(event)) {
                this.translationOrigin = mousePos;
            } else {
                this.endSelection();
                this.mouseDownCoord = mousePos;
                this.mouseUpCoord = mousePos;
                this.drawPreviewSelection();
            }
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            if (this.isInCanvas(event)) {
                this.mouseUpCoord = this.getPositionFromMouse(event);
            }
            if (this.selectionCtx === null) {
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.startSelection();
            } else {
                this.updateSelection(this.getTranslation(this.mouseUpCoord));
            }
        }
        this.mouseDown = false;
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePos = this.getPositionFromMouse(event);
            if (this.isInCanvas(event)) {
                this.mouseUpCoord = mousePos;
            }
            if (this.selectionCtx !== null) {
                this.updateSelection(this.getTranslation(this.mouseUpCoord));
            } else {
                const ctx = this.drawingService.previewCtx;
                this.drawingService.clearCanvas(ctx);
                this.drawPreviewSelection();
            }
        }
    }

    onMouseLeave(event: MouseEvent): void {
        if (this.mouseDown && this.selectionCtx === null) {
            const rect = this.drawingService.canvas.getBoundingClientRect();
            const mousePos: Vec2 = this.mouseUpCoord;
            if (event.x >= rect.right) mousePos.x = this.drawingService.canvas.width;
            if (event.x <= rect.left) mousePos.x = 0;
            if (event.y <= rect.top) mousePos.y = 0;
            if (event.y >= rect.bottom) mousePos.y = this.drawingService.canvas.height;
            this.mouseUpCoord = mousePos;
            this.updateDrawingSelection();
        }
    }

    onKeyDown(event: KeyboardEvent): void {
        if (this.CANCEL_SELECTION.equals(event)) {
            this.stopDrawing();
        } else if (this.SELECT_ALL.equals(event)) {
            event.preventDefault();
            this.selectAll();
        } else if (this.SHIFT.equals(event)) {
            this.SHIFT.isDown = true;
            if (this.mouseDown && this.selectionCtx === null) {
                this.updateDrawingSelection();
            }
        } else if (this.selectionCtx !== null) {
            const PIXELS = 3;
            if (
                !this.mouseDown &&
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
            this.SHIFT.isDown = false;
            if (this.mouseDown && this.selectionCtx === null) {
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
        this.selectionCoords = { x: 0, y: 0 } as Vec2;
        const width = this.drawingService.canvas.width;
        const height = this.drawingService.canvas.height;
        this.mouseDownCoord = { x: 0, y: 0 } as Vec2;
        this.mouseUpCoord = { x: width, y: height } as Vec2;
        this.width = width;
        this.height = height;
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.startSelection();
        this.updatePoints.next(true);
    }

    isInSelection(event: MouseEvent): boolean {
        if (this.selectionCtx === null) return false;

        const left = this.selectionCoords.x;
        const right = this.selectionCoords.x + Math.abs(this.width);
        const top = this.selectionCoords.y;
        const bottom = this.selectionCoords.y + Math.abs(this.height);

        const currentPos = this.getPositionFromMouse(event);
        return currentPos.x >= left && currentPos.x <= right && currentPos.y >= top && currentPos.y <= bottom;
    }

    stopDrawing(): void {
        this.endSelection();
        this.mouseDown = false;
        this.SHIFT.isDown = false;
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
        if (this.width === 0 || this.height === 0) return;
        this.SELECTION_DATA.width = Math.abs(this.width);
        this.SELECTION_DATA.height = Math.abs(this.height);
        this.selectionCtx = this.SELECTION_DATA.getContext('2d') as CanvasRenderingContext2D;
        const x = Math.min(this.mouseDownCoord.x, this.mouseDownCoord.x + this.width);
        const y = Math.min(this.mouseDownCoord.y, this.mouseDownCoord.y + this.height);
        this.selectionCoords = { x, y } as Vec2;
        this.firstSelectionCoords = { x, y } as Vec2;

        this.selectionCtx.drawImage(
            this.drawingService.canvas,
            x,
            y,
            Math.abs(this.width),
            Math.abs(this.height),
            0,
            0,
            Math.abs(this.width),
            Math.abs(this.height),
        );

        const previewCtx = this.drawingService.previewCtx;
        previewCtx.drawImage(this.SELECTION_DATA, x, y);

        this.drawPreviewSelection();
    }

    private updateSelection(translation: Vec2): void {
        if (this.selectionCtx === null) return;

        this.selectionCoords.x += translation.x;
        this.selectionCoords.y += translation.y;
        this.translationOrigin.x += translation.x;
        this.translationOrigin.y += translation.y;
        this.updateSelectionRequired();

        this.updatePoints.next(true);
    }

    private drawPreviewSelection(): void {
        this.width = this.mouseUpCoord.x - this.mouseDownCoord.x;
        this.height = this.mouseUpCoord.y - this.mouseDownCoord.y;

        this.drawPreviewSelectionRequired();
    }

    private updateDrawingSelection(): void {
        const ctx = this.drawingService.previewCtx;
        this.drawingService.clearCanvas(ctx);
        this.drawPreviewSelection();
    }

    isInCanvas(event: MouseEvent): boolean {
        const clientRect = this.drawingService.canvas.getBoundingClientRect();
        const left = clientRect.x + this.BORDER_WIDTH - 1;
        const right = clientRect.x + clientRect.width - this.BORDER_WIDTH;
        const top = clientRect.y + this.BORDER_WIDTH - 1;
        const bottom = clientRect.y + clientRect.height - this.BORDER_WIDTH;
        return event.x > left && event.x < right && event.y > top && event.y < bottom;
    }
}