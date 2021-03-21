import { Injectable } from '@angular/core';
import { PencilDraw } from '@app/classes/commands/pencil-draw';
import { ShortcutKey } from '@app/classes/shortcut/shortcut-key';
import { Tool } from '@app/classes/tool';
import { PencilConfig } from '@app/classes/tool-config/pencil-config';
import { PencilToolConstants } from '@app/classes/tool_ui_settings/tools.constants';
import { Vec2 } from '@app/classes/vec2';
import { MouseButton } from '@app/constants/control';
import { ToolSettingsConst } from '@app/constants/tool-settings';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ColorService } from 'src/color-picker/services/color.service';

export enum LeftMouse {
    Released = 0,
    Pressed = 1,
}

@Injectable({
    providedIn: 'root',
})
export class PencilService extends Tool {
    config: PencilConfig = new PencilConfig();

    constructor(drawingService: DrawingService, colorService: ColorService) {
        super(drawingService, colorService);

        this.shortcutKey = new ShortcutKey(PencilToolConstants.SHORTCUT_KEY);
        this.toolID = PencilToolConstants.TOOL_ID;
    }

    set lineWidth(width: number) {
        this.config.lineWidth = Math.min(Math.max(width, 1), ToolSettingsConst.MAX_WIDTH);
    }

    onMouseDown(event: MouseEvent): void {
        this.leftMouseDown = event.button === MouseButton.Left;
        if (this.leftMouseDown) {
            this.clearPath();

            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.config.pathData[this.config.pathData.length - 1].push(this.mouseDownCoord);
        }
    }

    onMouseUp(event: MouseEvent): void {
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        if (this.leftMouseDown) {
            if (this.isInCanvas(event)) {
                const mousePosition = this.getPositionFromMouse(event);
                this.config.pathData[this.config.pathData.length - 1].push(mousePosition);
                this.drawBackgroundPoint(mousePosition);
            }
            this.draw();
        }
        this.leftMouseDown = false;
        this.clearPath();
    }

    onMouseMove(event: MouseEvent): void {
        if (this.leftMouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.config.pathData[this.config.pathData.length - 1].push(mousePosition);

            // Drawing on preview canvas and then clear it with every mouse move
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawPreview();
        } else if (this.isInCanvas(event) && !this.colorService.isMenuOpen) {
            this.drawBackgroundPoint(this.getPositionFromMouse(event));
        }
    }

    onMouseLeave(): void {
        if (!this.leftMouseDown) this.drawingService.clearCanvas(this.drawingService.previewCtx);
    }

    onMouseEnter(event: MouseEvent): void {
        if (event.button !== MouseButton.Left) return;

        if (event.buttons === LeftMouse.Pressed) {
            this.config.pathData.push([]);
            this.onMouseMove(event);
        } else if (event.buttons === LeftMouse.Released) {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.leftMouseDown = false;
            this.clearPath();
        }
    }

    stopDrawing(): void {
        this.onMouseUp({} as MouseEvent);
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
    }

    protected drawBackgroundPoint(point: Vec2): void {
        const ctx = this.drawingService.previewCtx;
        this.drawingService.clearCanvas(ctx);

        const backgroundPointConfig = this.config.clone();
        backgroundPointConfig.pathData = [[point]];

        const command = new PencilDraw(this.colorService, backgroundPointConfig);
        command.execute(this.drawingService.previewCtx);
    }

    drawPreview(): void {
        const command = new PencilDraw(this.colorService, this.config);
        this.drawingService.drawPreview(command);
    }

    draw(): void {
        const command = new PencilDraw(this.colorService, this.config);
        this.drawingService.draw(command);
    }

    protected clearPath(): void {
        this.config.pathData = [];
        this.config.pathData.push([]);
    }
}
