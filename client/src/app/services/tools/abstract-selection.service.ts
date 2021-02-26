import { Injectable } from '@angular/core';
import { ShortcutKey } from '@app/classes/shortcut-key';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { MouseButton } from '@app/constants/control';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ColorService } from 'src/color-picker/services/color.service';

@Injectable({
    providedIn: 'root',
})
export abstract class AbstractSelectionService extends Tool {
    protected readonly LINE_DASH: number = 8;
    private readonly SELECT_ALL: ShortcutKey = new ShortcutKey('a', true);
    private readonly CANCEL_SELECTION: ShortcutKey = new ShortcutKey('escape');
    private readonly LEFT_ARROW: ShortcutKey = new ShortcutKey('arrowleft');
    private readonly RIGHT_ARROW: ShortcutKey = new ShortcutKey('arrowright');
    private readonly DOWN_ARROW: ShortcutKey = new ShortcutKey('arrowdown');
    private readonly UP_ARROW: ShortcutKey = new ShortcutKey('arrowup');
    protected readonly SELECTION_DATA: HTMLCanvasElement;

    public mouseUpCoord: Vec2;
    protected translationOrigin: Vec2;
    protected firstSelectionCoords: Vec2;
    public selectionCoords: Vec2;

    public width: number;
    public height: number;
    public selectionCtx: CanvasRenderingContext2D | null;

    protected shiftPressed: boolean;
    protected isLeftArrowDown: boolean;
    protected isRightArrowDown: boolean;
    protected isUpArrowDown: boolean;
    protected isDownArrowDown: boolean;
    private moveId: number;

    constructor(drawingService: DrawingService, colorService: ColorService) {
        super(drawingService, colorService);
        this.SELECTION_DATA = document.createElement('canvas');
        this.selectionCtx = null;
        this.selectionCoords = { x: 0, y: 0 } as Vec2;
        this.translationOrigin = { x: 0, y: 0 } as Vec2;
        this.isLeftArrowDown = false;
        this.isRightArrowDown = false;
        this.isUpArrowDown = false; //TODO changer avec merge request de Paul
        this.isDownArrowDown = false;
        this.moveId = -1;
    }

    protected abstract endSelection(): void;

    protected abstract fillBackground(ctx: CanvasRenderingContext2D, currentPosX: number, currentPosY: number): void;

    protected abstract updateSelection(translation: Vec2): void;

    protected abstract drawPreviewSelection(ctx: CanvasRenderingContext2D): void;

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
                this.drawPreviewSelection(this.drawingService.previewCtx);
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
            this.mouseUpCoord = mousePos;
            if (this.selectionCtx !== null) {
                this.updateSelection(this.getTranslation(mousePos));
            } else {
                const ctx = this.drawingService.previewCtx;
                this.drawingService.clearCanvas(ctx);
                this.drawPreviewSelection(ctx);
            }
        }
    }

    onMouseLeave(event: MouseEvent): void {
        if (this.mouseDown && this.isInCanvas(event) && this.selectionCtx === null) {
            this.mouseUpCoord = this.getPositionFromMouse(event);
            this.updateDrawingSelection();
        }
    }

    onMouseEnter(event: MouseEvent): void {
        if (this.mouseDown && this.isInCanvas(event) && this.selectionCtx === null) {
            this.mouseUpCoord = this.getPositionFromMouse(event);
            this.updateDrawingSelection();
        }
    }

    onKeyDown(event: KeyboardEvent): void {
        if (this.CANCEL_SELECTION.equals(event)) {
            this.stopDrawing();
            return;
        } else if (this.SELECT_ALL.equals(event)) {
            event.preventDefault();
            this.selectAll();
            return;
        } else if (event.shiftKey && !this.shiftPressed) {
            this.shiftPressed = true;
            if (this.mouseDown && this.selectionCtx === null) {
                this.updateDrawingSelection();
            }
        } else if (this.selectionCtx !== null) {
            const PIXELS = 3;
            if (this.RIGHT_ARROW.equals(event) || this.LEFT_ARROW.equals(event) || this.UP_ARROW.equals(event) || this.DOWN_ARROW.equals(event)) {
                event.preventDefault();
                if (event.repeat) return;
                this.setArrowKeyDown(event);
                this.updateSelection({ x: PIXELS * this.getXArrow(), y: PIXELS * this.getYArrow() } as Vec2);

                if (this.moveId === -1) {
                    setTimeout(() => {
                        if (this.moveId === -1)
                            this.moveId = window.setInterval(() => {
                                this.updateSelection({ x: PIXELS * this.getXArrow(), y: PIXELS * this.getYArrow() } as Vec2);
                            }, 100);
                    }, 500);
                }
            }
        }
    }

    onKeyUp(event: KeyboardEvent): void {
        if (!event.shiftKey && this.shiftPressed) {
            this.shiftPressed = false;
            if (this.mouseDown && this.selectionCtx === null) {
                this.updateDrawingSelection();
            }
        }
        if (this.selectionCtx !== null) {
            this.setArrowKeyUp(event);
            if (!this.isRightArrowDown && !this.isLeftArrowDown && !this.isUpArrowDown && !this.isDownArrowDown) {
                window.clearInterval(this.moveId);
                this.moveId = -1;
            }
        }
    }

    selectAll(): void {
        this.stopDrawing();
        const width = this.drawingService.canvas.width;
        const height = this.drawingService.canvas.height;
        this.mouseDownCoord = { x: 0, y: 0 } as Vec2;
        this.mouseUpCoord = { x: width, y: height } as Vec2;
        this.width = width;
        this.height = height;
        this.startSelection();
    }

    isInSelection(event: MouseEvent): boolean {
        if (this.selectionCtx === null) return false;

        const left = this.selectionCoords.x;
        const right = this.selectionCoords.x + Math.abs(this.width);
        const top = this.selectionCoords.y;
        const bottom = this.selectionCoords.y + Math.abs(this.height);

        const currentPos = this.getPositionFromMouse(event);
        return !(currentPos.x < left || currentPos.x > right || currentPos.y < top || currentPos.y > bottom);
    }

    stopDrawing(): void {
        this.endSelection();
        this.mouseDown = false;
        this.shiftPressed = false;
        this.drawingService.clearCanvas(this.drawingService.previewCtx);

        this.isRightArrowDown = false;
        this.isLeftArrowDown = false;
        this.isUpArrowDown = false;
        this.isDownArrowDown = false;
    }

    private setArrowKeyDown(event: KeyboardEvent): void {
        if (this.RIGHT_ARROW.equals(event)) this.isRightArrowDown = true;
        if (this.LEFT_ARROW.equals(event)) this.isLeftArrowDown = true;
        if (this.UP_ARROW.equals(event)) this.isUpArrowDown = true;
        if (this.DOWN_ARROW.equals(event)) this.isDownArrowDown = true;
    }

    private setArrowKeyUp(event: KeyboardEvent): void {
        if (this.RIGHT_ARROW.equals(event)) this.isRightArrowDown = false;
        if (this.LEFT_ARROW.equals(event)) this.isLeftArrowDown = false;
        if (this.UP_ARROW.equals(event)) this.isUpArrowDown = false;
        if (this.DOWN_ARROW.equals(event)) this.isDownArrowDown = false;
    }

    private getXArrow(): number {
        return (this.isRightArrowDown ? 1 : 0) - (this.isLeftArrowDown ? 1 : 0);
    }

    private getYArrow(): number {
        return (this.isDownArrowDown ? 1 : 0) - (this.isUpArrowDown ? 1 : 0);
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

        this.drawPreviewSelection(previewCtx);
    }

    public getTranslation(mousePos: Vec2): Vec2 {
        return { x: mousePos.x - this.translationOrigin.x, y: mousePos.y - this.translationOrigin.y } as Vec2;
    }

    private updateDrawingSelection(): void {
        const ctx = this.drawingService.previewCtx;
        this.drawingService.clearCanvas(ctx);
        this.drawPreviewSelection(ctx);
    }
}
