import { Injectable } from '@angular/core';
import { ShortcutKey } from '@app/classes/shortcut-key';
import { Tool } from '@app/classes/tool';
import { RectangleSelectionToolConstants } from '@app/classes/tool_ui_settings/tools.constants';
import { Vec2 } from '@app/classes/vec2';
import { MouseButton } from '@app/constants/control';
import { ColorService } from 'src/color-picker/services/color.service';
import { DrawingService } from '../drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class RectangleSelectionService extends Tool {
    protected readonly LINE_DASH: number = 8;
    protected readonly SELECT_ALL: ShortcutKey = new ShortcutKey('a', true);
    protected readonly CANCEL_SELECTION: ShortcutKey = new ShortcutKey('escape');
    protected readonly LEFT_ARROW: ShortcutKey = new ShortcutKey('arrowleft');
    protected readonly RIGHT_ARROW: ShortcutKey = new ShortcutKey('arrowright');
    protected readonly DOWN_ARROW: ShortcutKey = new ShortcutKey('arrowdown');
    protected readonly UP_ARROW: ShortcutKey = new ShortcutKey('arrowup');
    protected readonly SELECTION_DATA: HTMLCanvasElement;

    protected mouseUpCoord: Vec2;
    protected translationOrigin: Vec2;
    protected firstSelectionCoords: Vec2;
    protected selectionCoords: Vec2;
    protected shiftPressed: boolean;
    protected width: number;
    protected height: number;
    protected selectionCtx: CanvasRenderingContext2D | null;
    protected isLeftArrowDown: boolean;
    protected isRightArrowDown: boolean;
    protected isUpArrowDown: boolean;
    protected isDownArrowDown: boolean;

    constructor(drawingService: DrawingService, colorService: ColorService) {
        super(drawingService, colorService);
        this.shortcutKey = new ShortcutKey(RectangleSelectionToolConstants.SHORTCUT_KEY);
        this.toolID = RectangleSelectionToolConstants.TOOL_ID;
        this.SELECTION_DATA = document.createElement('canvas');
        this.selectionCtx = null;
        this.selectionCoords = { x: 0, y: 0 } as Vec2;
        this.isLeftArrowDown = false;
        this.isRightArrowDown = false;
        this.isUpArrowDown = false;
        this.isDownArrowDown = false;
    }

    stopDrawing(): void {
        this.endSelection();
        this.mouseDown = false;
        this.shiftPressed = false;
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
    }

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
                const translation = this.getTranslation(this.mouseUpCoord);
                this.updateSelection(translation);
                this.selectionCoords.x += translation.x;
                this.selectionCoords.y += translation.y;
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
                return;
            }
            const ctx = this.drawingService.previewCtx;
            this.drawingService.clearCanvas(ctx);
            this.drawPreviewSelection(ctx);
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
        }
        if (this.SELECT_ALL.equals(event)) {
            event.preventDefault();
            this.selectAll();
            return;
        }

        if (event.shiftKey && !this.shiftPressed) {
            this.shiftPressed = true;
            if (this.mouseDown && this.selectionCtx === null) {
                this.updateDrawingSelection();
            }
        }
        if (this.selectionCtx !== null) {
            const PIXELS = 3;
            if (this.RIGHT_ARROW.equals(event) || this.LEFT_ARROW.equals(event) || this.UP_ARROW.equals(event) || this.DOWN_ARROW.equals(event)) {
                event.preventDefault();
                if (this.RIGHT_ARROW.equals(event)) this.isRightArrowDown = true;
                if (this.LEFT_ARROW.equals(event)) this.isLeftArrowDown = true;
                if (this.UP_ARROW.equals(event)) this.isUpArrowDown = true;
                if (this.DOWN_ARROW.equals(event)) this.isDownArrowDown = true;
                this.moveSelection(
                    (this.isRightArrowDown ? PIXELS : 0) - (this.isLeftArrowDown ? PIXELS : 0),
                    (this.isDownArrowDown ? PIXELS : 0) - (this.isUpArrowDown ? PIXELS : 0),
                );
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
            if (this.RIGHT_ARROW.equals(event)) this.isRightArrowDown = false;
            if (this.LEFT_ARROW.equals(event)) this.isLeftArrowDown = false;
            if (this.UP_ARROW.equals(event)) this.isUpArrowDown = false;
            if (this.DOWN_ARROW.equals(event)) this.isDownArrowDown = false;
        }
    }

    private moveSelection(x: number, y: number): void {
        this.updateSelection({ x, y } as Vec2);
        this.selectionCoords.x += x;
        this.selectionCoords.y += y;
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
        return !(currentPos.x <= left || currentPos.x >= right || currentPos.y <= top || currentPos.y >= bottom);
    }

    protected endSelection(): void {
        if (this.selectionCtx === null) return;
        const baseCtx = this.drawingService.baseCtx;

        this.fillBackground(baseCtx, this.selectionCoords.x, this.selectionCoords.y);

        baseCtx.drawImage(this.SELECTION_DATA, this.selectionCoords.x, this.selectionCoords.y);
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.selectionCtx = null;

        this.selectionCoords = { x: 0, y: 0 } as Vec2;
        this.translationOrigin = { x: 0, y: 0 } as Vec2;

        this.isRightArrowDown = false;
        this.isLeftArrowDown = false;
        this.isUpArrowDown = false;
        this.isDownArrowDown = false;
    }

    protected startSelection(): void {
        if (this.width === 0 || this.height === 0) return;
        //const baseCtx = this.drawingService.baseCtx;
        this.SELECTION_DATA.width = Math.abs(this.width);
        this.SELECTION_DATA.height = Math.abs(this.height);
        this.selectionCtx = this.SELECTION_DATA.getContext('2d') as CanvasRenderingContext2D;
        const x = Math.min(this.mouseDownCoord.x, this.mouseDownCoord.x + this.width);
        const y = Math.min(this.mouseDownCoord.y, this.mouseDownCoord.y + this.height);
        this.selectionCoords = { x: x, y: y } as Vec2;
        this.firstSelectionCoords = { x: x, y: y } as Vec2;

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
        //baseCtx.fillStyle = 'red';

        //this.fillBackground(baseCtx);
    }

    protected fillBackground(ctx: CanvasRenderingContext2D, currentPosX: number, currentPosY: number): void {
        if (this.firstSelectionCoords.x !== currentPosX || this.firstSelectionCoords.y !== currentPosY) {
            ctx.beginPath();
            ctx.fillStyle = 'red';
            ctx.fillRect(this.firstSelectionCoords.x, this.firstSelectionCoords.y, Math.abs(this.width), Math.abs(this.height));
            ctx.closePath();
        }
    }

    protected getTranslation(mousePos: Vec2): Vec2 {
        return { x: mousePos.x - this.translationOrigin.x, y: mousePos.y - this.translationOrigin.y } as Vec2;
    }

    protected updateSelection(translation: Vec2): void {
        if (this.selectionCtx === null) return;

        const ctx = this.drawingService.previewCtx;
        this.drawingService.clearCanvas(ctx);
        const left = this.selectionCoords.x + translation.x;
        const top = this.selectionCoords.y + translation.y;

        this.fillBackground(ctx, left, top);

        const rectangleCoords = { x: this.selectionCoords.x + translation.x, y: this.selectionCoords.y + translation.y } as Vec2;
        ctx.drawImage(this.SELECTION_DATA, left, top);
        this.drawSelection(ctx, rectangleCoords, Math.abs(this.width), Math.abs(this.height));
    }

    protected updateDrawingSelection(): void {
        const ctx = this.drawingService.previewCtx;
        this.drawingService.clearCanvas(ctx);
        this.drawPreviewSelection(ctx);
    }

    protected drawPreviewSelection(ctx: CanvasRenderingContext2D): void {
        this.width = this.mouseUpCoord.x - this.mouseDownCoord.x;
        this.height = this.mouseUpCoord.y - this.mouseDownCoord.y;
        if (this.shiftPressed) {
            this.height = Math.sign(this.height) * Math.min(Math.abs(this.width), Math.abs(this.height));
            this.width = Math.sign(this.width) * Math.abs(this.height);
        }

        this.drawSelection(ctx, this.mouseDownCoord, this.width, this.height);
    }

    protected drawSelection(ctx: CanvasRenderingContext2D, position: Vec2, width: number, height: number): void {
        ctx.lineWidth = 2;
        ctx.setLineDash([this.LINE_DASH, this.LINE_DASH]);
        ctx.strokeStyle = 'black';
        ctx.lineJoin = 'miter' as CanvasLineJoin;
        ctx.lineCap = 'square' as CanvasLineCap;

        ctx.strokeRect(position.x, position.y, width, height);
        ctx.lineDashOffset = this.LINE_DASH;
        ctx.strokeStyle = 'white';
        ctx.strokeRect(position.x, position.y, width, height);

        ctx.lineDashOffset = 0;
        ctx.setLineDash([]);
    }
}
