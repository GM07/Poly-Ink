import { Injectable } from '@angular/core';
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
    private readonly LINE_DASH: number = 5;
    private mouseUpCoord: Vec2;
    private selectionCoord: Vec2;
    private shiftPressed: boolean;
    private width: number;
    private height: number;
    private selectionData: ImageData | undefined;

    constructor(drawingService: DrawingService, colorService: ColorService) {
        super(drawingService, colorService);
        this.shortcutKey = RectangleSelectionToolConstants.SHORTCUT_KEY;
        this.toolID = RectangleSelectionToolConstants.TOOL_ID;
        this.selectionData = undefined;
    }

    stopDrawing(): void {
        this.endSelection();
        this.selectionData = undefined;
        this.mouseDown = false;
        this.shiftPressed = false;
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        if (this.mouseDown) {
            const mousePos = this.getPositionFromMouse(event);
            if (this.isInSelection(event)) {
                this.selectionCoord = mousePos;
            } else {
                this.endSelection();
                this.mouseDownCoord = mousePos;
                this.mouseUpCoord = this.mouseDownCoord;
                this.drawPreviewRectangle(this.drawingService.previewCtx);
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
            this.drawPreviewRectangle(ctx);
        }
    }

    onMouseLeave(event: MouseEvent): void {
        if (this.mouseDown && this.selectionData === undefined) {
            this.mouseUpCoord = this.getPositionFromMouse(event);
            this.updateRectangle();
        }
    }

    onMouseEnter(event: MouseEvent): void {
        if (this.mouseDown && this.selectionData === undefined) {
            this.mouseUpCoord = this.getPositionFromMouse(event);
            this.updateRectangle();
        }
    }

    onKeyDown(event: KeyboardEvent): void {
        console.log(event.key);
        if (event.key === 'Escape') {
            this.stopDrawing();
        }

        if (event.shiftKey && !this.shiftPressed && this.selectionData === undefined) {
            this.shiftPressed = true;
            if (this.mouseDown) {
                this.updateRectangle();
            }
        }
    }

    onKeyUp(event: KeyboardEvent): void {
        if (!event.shiftKey && this.shiftPressed && this.selectionData === undefined) {
            this.shiftPressed = false;
            if (this.mouseDown) {
                this.updateRectangle();
            }
        }
    }

    private isInSelection(event: MouseEvent): boolean {
        if (this.selectionData === undefined) return false;

        let left: number;
        let right: number;
        let top: number;
        let bottom: number;
        if (this.mouseDownCoord.x < this.mouseDownCoord.x + this.width) {
            left = this.mouseDownCoord.x;
            right = this.mouseDownCoord.x + this.width;
        } else {
            left = this.mouseDownCoord.x + this.width;
            right = this.mouseDownCoord.x;
        }

        if (this.mouseDownCoord.y < this.mouseDownCoord.y + this.height) {
            top = this.mouseDownCoord.y;
            bottom = this.mouseDownCoord.y + this.height;
        } else {
            top = this.mouseDownCoord.y + this.height;
            bottom = this.mouseDownCoord.y;
        }

        const currentPos = this.getPositionFromMouse(event);
        return !(currentPos.x <= left || currentPos.x >= right || currentPos.y <= top || currentPos.y >= bottom);
    }

    private endSelection(): void {
        if (this.selectionData === undefined) return;
        const baseCtx = this.drawingService.baseCtx;
        const imageDataCoords = this.getImageDataCoords();

        baseCtx.putImageData(this.selectionData, imageDataCoords.x, imageDataCoords.y);
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.selectionData = undefined;
    }

    private startSelection(): void {
        if (this.width === 0 || this.height === 0) return;
        const baseCtx = this.drawingService.baseCtx;
        this.selectionData = baseCtx.getImageData(this.mouseDownCoord.x, this.mouseDownCoord.y, this.width, this.height);

        const previewCtx = this.drawingService.previewCtx;
        const imageDataCoords = this.getImageDataCoords();
        previewCtx.putImageData(this.selectionData, imageDataCoords.x, imageDataCoords.y);

        this.drawPreviewRectangle(previewCtx);
        baseCtx.fillStyle = 'red';
        baseCtx.beginPath();
        baseCtx.fillRect(this.mouseDownCoord.x, this.mouseDownCoord.y, this.width, this.height); // Tester
        baseCtx.closePath();
    }

    private getTranslation(mousePos: Vec2): Vec2 {
        return { x: mousePos.x - this.selectionCoord.x, y: mousePos.y - this.selectionCoord.y } as Vec2;
    }

    private updateSelection(translation: Vec2): void {
        if (this.selectionData === undefined) return;
        console.log(translation);

        const ctx = this.drawingService.previewCtx;
        this.drawingService.clearCanvas(ctx);
        let imageDataCoords = this.getImageDataCoords();
        imageDataCoords.x += translation.x;
        imageDataCoords.y += translation.y;
        ctx.putImageData(this.selectionData, imageDataCoords.x, imageDataCoords.y);
        const rectangleCoords = { x: this.mouseDownCoord.x + translation.x, y: this.mouseDownCoord.y + translation.y } as Vec2;
        this.drawRectangle(ctx, rectangleCoords);
    }

    private getImageDataCoords(): Vec2 {
        const x = Math.min(this.mouseDownCoord.x, this.mouseDownCoord.x + this.width);
        const y = Math.min(this.mouseDownCoord.y, this.mouseDownCoord.y + this.height);
        return { x: x, y: y } as Vec2;
    }

    private updateRectangle(): void {
        const ctx = this.drawingService.previewCtx;
        this.drawingService.clearCanvas(ctx);
        this.drawPreviewRectangle(ctx);
    }

    private drawPreviewRectangle(ctx: CanvasRenderingContext2D): void {
        this.width = this.mouseUpCoord.x - this.mouseDownCoord.x;
        this.height = this.mouseUpCoord.y - this.mouseDownCoord.y;
        if (this.shiftPressed) {
            this.height = Math.sign(this.height) * Math.min(Math.abs(this.width), Math.abs(this.height));
            this.width = Math.sign(this.width) * Math.abs(this.height);
        }

        this.drawRectangle(ctx, this.mouseDownCoord);
    }

    private drawRectangle(ctx: CanvasRenderingContext2D, position: Vec2) {
        ctx.lineWidth = 1;
        ctx.setLineDash([this.LINE_DASH, this.LINE_DASH]);
        ctx.strokeStyle = 'black';
        ctx.lineJoin = 'miter' as CanvasLineJoin;
        ctx.lineCap = 'square' as CanvasLineCap;

        ctx.strokeRect(position.x + 0.5, position.y + 0.5, this.width, this.height); // + 0.5 pour donner une allure "sharp"
        ctx.lineDashOffset = this.LINE_DASH;
        ctx.strokeStyle = 'white';
        ctx.strokeRect(position.x + 0.5, position.y + 0.5, this.width, this.height); // + 0.5 pour donner une allure "sharp"

        ctx.lineDashOffset = 0;
        ctx.setLineDash([0]);
    }
}
