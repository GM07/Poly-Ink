import { Injectable } from '@angular/core';
import { ShortcutKey } from '@app/classes/shortcut/shortcut-key';
import { Tool } from '@app/classes/tool';
import { EyeDropperToolConstants } from '@app/classes/tool_ui_settings/tools.constants';
import { Vec2 } from '@app/classes/vec2';
import { MouseButton } from '@app/constants/control';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { Color } from 'src/color-picker/classes/color';
import { ColorService } from 'src/color-picker/services/color.service';

@Injectable({
    providedIn: 'root',
})
export class PipetteService extends Tool {
    toolID: string;
    previsualisationCanvas: HTMLCanvasElement;
    previsualisationCtx: CanvasRenderingContext2D;

    constructor(drawingService: DrawingService, colorService: ColorService) {
        super(drawingService, colorService);
        this.toolID = EyeDropperToolConstants.TOOL_ID;
        this.shortcutKey = new ShortcutKey(EyeDropperToolConstants.SHORTCUT_KEY);
    }

    stopDrawing(): void {
        // Since stopDrawing is an abstract method we must implement it in every child class
    }

    onMouseDown(event: MouseEvent): void {
        if (this.isInCanvas(event)) {
            const pos: Vec2 = this.getPositionFromMouse(event);
            const color: Uint8ClampedArray = this.drawingService.baseCtx.getImageData(pos.x, pos.y, 1, 1).data;
            if (event.button === MouseButton.Left) {
                this.colorService.primaryColor = new Color(color[0], color[1], color[2]);
            } else if (event.button === MouseButton.Right) {
                this.colorService.secondaryColor = new Color(color[0], color[1], color[2]);
            }
        }
    }

    onMouseMove(event: MouseEvent): void {
        const size = 10;
        const data: HTMLCanvasElement = this.getPrevisualisation(this.getPositionFromMouse(event), { x: size, y: size } as Vec2);
        if (this.previsualisationCtx !== undefined) {
            if (this.isInCanvas(event)) {
                this.previsualisationCtx.imageSmoothingEnabled = false;
                this.previsualisationCtx.beginPath();
                this.previsualisationCtx.drawImage(
                    data,
                    0,
                    0,
                    size,
                    size,
                    0,
                    0,
                    this.previsualisationCanvas.width,
                    this.previsualisationCanvas.height,
                );
                this.drawSelectedPixelRect(this.previsualisationCtx, this.previsualisationCanvas, size);
            } else {
                this.previsualisationCtx.clearRect(0, 0, this.previsualisationCanvas.width, this.previsualisationCanvas.height);
            }
        }
    }

    private drawSelectedPixelRect(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, size: number): void {
        ctx.lineWidth = 1;
        ctx.setLineDash([2, 2]);
        ctx.strokeStyle = 'black';
        ctx.lineJoin = 'miter' as CanvasLineJoin;
        ctx.lineCap = 'square' as CanvasLineCap;
        ctx.strokeRect(canvas.width / 2, canvas.height / 2, canvas.width / size, canvas.height / size);
        ctx.lineDashOffset = 2;
        ctx.strokeStyle = 'white';
        ctx.strokeRect(canvas.width / 2, canvas.height / 2, canvas.width / size, canvas.height / size);
        ctx.lineDashOffset = 0;
        ctx.setLineDash([]);
    }

    private getPrevisualisation(coords: Vec2, size: Vec2): HTMLCanvasElement {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
        canvas.width = size.x;
        canvas.height = size.y;
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        ctx.save();
        ctx.ellipse(size.x / 2, size.y / 2, size.x / 2, size.y / 2, 0, 0, 2 * Math.PI);
        ctx.clip();
        ctx.drawImage(
            this.drawingService.canvas,
            Math.max(0 - size.x / 2, coords.x - size.x / 2),
            Math.max(0 - size.y / 2, coords.y - size.y / 2),
            Math.min(size.x, this.drawingService.canvas.width - coords.x - size.x / 2),
            Math.min(size.y, this.drawingService.canvas.height - coords.y - size.y / 2),
            0,
            0,
            canvas.width,
            canvas.height,
        );
        ctx.restore();
        return canvas;
    }
}
