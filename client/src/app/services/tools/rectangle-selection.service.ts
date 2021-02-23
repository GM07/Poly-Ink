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
    protected mouseUpCoord: Vec2;
    protected translationOrigin: Vec2;
    protected selectionCoords: Vec2;
    protected shiftPressed: boolean;
    protected width: number;
    protected height: number;
    protected selectionData: ImageData | undefined;

    constructor(drawingService: DrawingService, colorService: ColorService) {
        super(drawingService, colorService);
        this.shortcutKey = new ShortcutKey(RectangleSelectionToolConstants.SHORTCUT_KEY);
        this.toolID = RectangleSelectionToolConstants.TOOL_ID;
        this.selectionData = undefined;
        this.selectionCoords = { x: 0, y: 0 } as Vec2;
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
                this.mouseUpCoord = this.mouseDownCoord;
                this.drawPreviewSelection(this.drawingService.previewCtx);
            }
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            if (this.isInCanvas(event)) {
                this.mouseUpCoord = this.getPositionFromMouse(event);
            }
            if (this.selectionData === undefined) {
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.startSelection();
            } else {
                const translation = this.getTranslation(this.mouseUpCoord);
                this.updateSelection(translation);
                this.selectionCoords.x += translation.x;
                this.selectionCoords.y += translation.y;
                this.mouseDownCoord.x += translation.x;
                this.mouseDownCoord.y += translation.y;
            }
        }
        this.mouseDown = false;
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePos = this.getPositionFromMouse(event);
            this.mouseUpCoord = mousePos;
            if (this.selectionData !== undefined) {
                this.updateSelection(this.getTranslation(mousePos));
                return;
            }
            const ctx = this.drawingService.previewCtx;
            this.drawingService.clearCanvas(ctx);
            this.drawPreviewSelection(ctx);
        }
    }

    onMouseLeave(event: MouseEvent): void {
        if (this.mouseDown && this.isInCanvas(event) && this.selectionData === undefined) {
            this.mouseUpCoord = this.getPositionFromMouse(event);
            this.updateDrawingSelection();
        }
    }

    onMouseEnter(event: MouseEvent): void {
        if (this.mouseDown && this.isInCanvas(event) && this.selectionData === undefined) {
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
            this.stopDrawing();
            event.preventDefault();
            this.selectAll();
            return;
        }

        if (event.shiftKey && !this.shiftPressed) {
            this.shiftPressed = true;
            if (this.mouseDown && this.selectionData === undefined) {
                this.updateDrawingSelection();
            }
        }
    }

    onKeyUp(event: KeyboardEvent): void {
        if (!event.shiftKey && this.shiftPressed) {
            this.shiftPressed = false;
            if (this.mouseDown && this.selectionData === undefined) {
                this.updateDrawingSelection();
            }
        }
    }

    selectAll(): void {
        const width = this.drawingService.canvas.width;
        const height = this.drawingService.canvas.height;
        this.mouseDownCoord = { x: 0, y: 0 } as Vec2;
        this.mouseUpCoord = { x: width, y: height } as Vec2;
        this.width = width;
        this.height = height;
        this.startSelection();
    }

    isInSelection(event: MouseEvent): boolean {
        if (this.selectionData === undefined) return false;

        const left = this.selectionCoords.x;
        const right = this.selectionCoords.x + Math.abs(this.width);
        const top = this.selectionCoords.y;
        const bottom = this.selectionCoords.y + Math.abs(this.height);

        const currentPos = this.getPositionFromMouse(event);
        return !(currentPos.x <= left || currentPos.x >= right || currentPos.y <= top || currentPos.y >= bottom);
    }

    protected endSelection(): void {
        if (this.selectionData === undefined) return;
        const baseCtx = this.drawingService.baseCtx;

        baseCtx.putImageData(this.selectionData, this.selectionCoords.x, this.selectionCoords.y);
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.selectionData = undefined;
        this.selectionCoords = { x: 0, y: 0 } as Vec2;
    }

    protected startSelection(): void {
        if (this.width === 0 || this.height === 0) return;
        const baseCtx = this.drawingService.baseCtx;
        this.selectionData = baseCtx.getImageData(this.mouseDownCoord.x, this.mouseDownCoord.y, this.width, this.height);
        this.selectionCoords.x = Math.min(this.mouseDownCoord.x, this.mouseDownCoord.x + this.width);
        this.selectionCoords.y = Math.min(this.mouseDownCoord.y, this.mouseDownCoord.y + this.height);

        const previewCtx = this.drawingService.previewCtx;
        previewCtx.putImageData(this.selectionData, this.selectionCoords.x, this.selectionCoords.y);

        this.drawPreviewSelection(previewCtx);
        baseCtx.fillStyle = 'red';
        baseCtx.beginPath();
        baseCtx.fillRect(this.mouseDownCoord.x, this.mouseDownCoord.y, this.width, this.height); // Tester
        baseCtx.closePath();
    }

    protected getTranslation(mousePos: Vec2): Vec2 {
        return { x: mousePos.x - this.translationOrigin.x, y: mousePos.y - this.translationOrigin.y } as Vec2;
    }

    protected updateSelection(translation: Vec2): void {
        if (this.selectionData === undefined) return;

        const ctx = this.drawingService.previewCtx;
        this.drawingService.clearCanvas(ctx);
        const left = this.selectionCoords.x + translation.x;
        const top = this.selectionCoords.y + translation.y;
        ctx.putImageData(this.selectionData, left, top);
        const rectangleCoords = { x: this.mouseDownCoord.x + translation.x, y: this.mouseDownCoord.y + translation.y } as Vec2;
        this.drawSelection(ctx, rectangleCoords);
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

        this.drawSelection(ctx, this.mouseDownCoord);
    }

    protected drawSelection(ctx: CanvasRenderingContext2D, position: Vec2) {
        ctx.lineWidth = 2;
        ctx.setLineDash([this.LINE_DASH, this.LINE_DASH]);
        ctx.strokeStyle = 'black';
        ctx.lineJoin = 'miter' as CanvasLineJoin;
        ctx.lineCap = 'square' as CanvasLineCap;

        ctx.strokeRect(position.x, position.y, this.width, this.height);
        ctx.lineDashOffset = this.LINE_DASH;
        ctx.strokeStyle = 'white';
        ctx.strokeRect(position.x, position.y, this.width, this.height);

        ctx.lineDashOffset = 0;
        ctx.setLineDash([0]);
    }
}
