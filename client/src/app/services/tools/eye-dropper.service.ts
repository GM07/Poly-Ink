import { Injectable } from '@angular/core';
import { ShortcutKey } from '@app/classes/shortcut/shortcut-key';
import { Tool } from '@app/classes/tool';
import { EyeDropperToolConstants } from '@app/classes/tool_ui_settings/tools.constants';
import { Vec2 } from '@app/classes/vec2';
import { MouseButton } from '@app/constants/control';
import { ToolSettingsConst } from '@app/constants/tool-settings';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { Subject } from 'rxjs';
import { Color } from 'src/color-picker/classes/color';
import { ColorService } from 'src/color-picker/services/color.service';

@Injectable({
    providedIn: 'root',
})
export class EyeDropperService extends Tool {
    toolID: string;
    previsualisationCanvas: HTMLCanvasElement;
    previsualisationCtx: CanvasRenderingContext2D;
    updatePrevisualisation: Subject<string> = new Subject();

    constructor(drawingService: DrawingService, colorService: ColorService) {
        super(drawingService, colorService);
        this.toolID = EyeDropperToolConstants.TOOL_ID;
        this.shortcutKey = new ShortcutKey(EyeDropperToolConstants.SHORTCUT_KEY);
        this.previsualisationCanvas = document.createElement('canvas');
        this.previsualisationCanvas.width = ToolSettingsConst.EYE_DROPPER_PREVIEW_WIDTH ** 2;
        this.previsualisationCanvas.height = ToolSettingsConst.EYE_DROPPER_PREVIEW_WIDTH ** 2;
        this.previsualisationCtx = this.previsualisationCanvas.getContext('2d') as CanvasRenderingContext2D;
    }

    stopDrawing(): void {
        // Since stopDrawing is an abstract method we must implement it in every child class
    }

    onMouseDown(event: MouseEvent): void {
        if (this.isInCanvas(event)) {
            if (event.button === MouseButton.Left) {
                this.colorService.primaryColor = this.getColor(this.getPositionFromMouse(event));
            } else if (event.button === MouseButton.Right) {
                this.colorService.secondaryColor = this.getColor(this.getPositionFromMouse(event));
            }
        }
    }

    onMouseMove(event: MouseEvent): void {
        let color = '';
        const data: HTMLCanvasElement = this.getPrevisualisation(this.getPositionFromMouse(event), ToolSettingsConst.EYE_DROPPER_PREVIEW_WIDTH);
        if (this.isInCanvas(event) && !this.colorService.isMenuOpen) {
            this.previsualisationCtx.imageSmoothingEnabled = false;
            this.previsualisationCtx.clearRect(0, 0, this.previsualisationCanvas.width, this.previsualisationCanvas.height);
            this.previsualisationCtx.beginPath();
            this.previsualisationCtx.save();
            this.previsualisationCtx.ellipse(
                this.previsualisationCanvas.width / 2,
                this.previsualisationCanvas.height / 2,
                this.previsualisationCanvas.width / 2,
                this.previsualisationCanvas.height / 2,
                0,
                0,
                2 * Math.PI,
            );
            this.previsualisationCtx.clip();
            this.previsualisationCtx.drawImage(
                data,
                0,
                0,
                ToolSettingsConst.EYE_DROPPER_PREVIEW_WIDTH,
                ToolSettingsConst.EYE_DROPPER_PREVIEW_WIDTH,
                0,
                0,
                this.previsualisationCanvas.width,
                this.previsualisationCanvas.height,
            );
            this.previsualisationCtx.restore();

            this.drawSelectedPixelRect(this.previsualisationCtx);

            this.drawCircleAroundPreview(this.previsualisationCtx, this.previsualisationCanvas.width / 2);

            this.drawCircleAroundMouse(
                this.drawingService.previewCtx,
                { x: event.offsetX, y: event.offsetY } as Vec2,
                ToolSettingsConst.EYE_DROPPER_PREVIEW_WIDTH / 2,
            );

            color = this.getColor(this.getPositionFromMouse(event)).hexString;
        } else {
            this.previsualisationCtx.clearRect(0, 0, this.previsualisationCanvas.width, this.previsualisationCanvas.height);
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
        }
        this.updatePrevisualisation.next(color);
    }

    private drawSelectedPixelRect(ctx: CanvasRenderingContext2D): void {
        const centerX = ToolSettingsConst.EYE_DROPPER_PREVIEW_WIDTH * Math.floor(ToolSettingsConst.EYE_DROPPER_PREVIEW_WIDTH / 2);
        const centerY = ToolSettingsConst.EYE_DROPPER_PREVIEW_WIDTH * Math.floor(ToolSettingsConst.EYE_DROPPER_PREVIEW_WIDTH / 2);
        ctx.lineWidth = 1;
        ctx.setLineDash([2, 2]);
        ctx.strokeStyle = 'black';
        ctx.lineJoin = 'miter' as CanvasLineJoin;
        ctx.lineCap = 'square' as CanvasLineCap;
        ctx.strokeRect(centerX, centerY, ToolSettingsConst.EYE_DROPPER_PREVIEW_WIDTH, ToolSettingsConst.EYE_DROPPER_PREVIEW_WIDTH);
        ctx.lineDashOffset = 2;
        ctx.strokeStyle = 'white';
        ctx.strokeRect(centerX, centerY, ToolSettingsConst.EYE_DROPPER_PREVIEW_WIDTH, ToolSettingsConst.EYE_DROPPER_PREVIEW_WIDTH);
        ctx.lineDashOffset = 0;
        ctx.setLineDash([]);
    }

    private drawCircleAroundPreview(ctx: CanvasRenderingContext2D, size: number): void {
        ctx.strokeStyle = 'black';
        ctx.ellipse(size, size, size, size, 0, 0, 2 * Math.PI);
        ctx.stroke();
    }

    private drawCircleAroundMouse(ctx: CanvasRenderingContext2D, coords: Vec2, radius: number): void {
        ctx.clearRect(0, 0, this.drawingService.previewCanvas.width, this.drawingService.previewCanvas.height);
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'black';
        ctx.ellipse(coords.x, coords.y, radius, radius, 0, 0, 2 * Math.PI);
        ctx.stroke();
    }

    private getPrevisualisation(coords: Vec2, size: number): HTMLCanvasElement {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
        canvas.width = size;
        canvas.height = size;
        const radius = size / 2;
        ctx.imageSmoothingEnabled = false;
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(
            this.drawingService.canvas,
            Math.max(0 - radius, coords.x - radius),
            Math.max(0 - radius, coords.y - radius),
            Math.min(size, this.drawingService.canvas.width - coords.x - radius),
            Math.min(size, this.drawingService.canvas.height - coords.y - radius),
            0,
            0,
            canvas.width,
            canvas.height,
        );
        return canvas;
    }

    private getColor(pos: Vec2): Color {
        const colorData: Uint8ClampedArray = this.drawingService.baseCtx.getImageData(pos.x, pos.y, 1, 1).data;
        return new Color(colorData[0], colorData[1], colorData[2]);
    }
}
