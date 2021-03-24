import { Injectable } from '@angular/core';
import { StampDraw } from '@app/classes/commands/stamp-draw';
import { AltKey } from '@app/classes/shortcut/alt-key';
import { ShortcutKey } from '@app/classes/shortcut/shortcut-key';
import { Tool } from '@app/classes/tool';
import { StampConfig } from '@app/classes/tool-config/stamp-config';
import { StampToolConstants } from '@app/classes/tool_ui_settings/tools.constants';
import { MouseButton } from '@app/constants/control';
import { ColorService } from 'src/color-picker/services/color.service';
import { DrawingService } from '../drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class StampService extends Tool {
    alt: AltKey;
    config: StampConfig;

    constructor(protected drawingService: DrawingService, protected colorService: ColorService) {
        super(drawingService, colorService);
        this.shortcutKey = new ShortcutKey(StampToolConstants.SHORTCUT_KEY);
        this.toolID = StampToolConstants.TOOL_ID;
        this.alt = new AltKey();
        this.alt.isDown = false;

        this.config = new StampConfig();
    }

    set scaleValue(scale: number) {
        this.config.scale = Math.min(Math.max(scale, 0.1), 5);
    }

    set angleValue(angle: number) {
        this.config.angle = Math.min(Math.max((angle / 180) * Math.PI, 0), 2 * Math.PI);
    }

    get angleValue(): number {
      return Math.round((this.config.angle / Math.PI) * 180);
    }

    updateStampValue() {
        this.config.etampeImg.src = StampConfig.stampList[this.config.etampe];
    }

    isActive(): boolean {
        return this.drawingService.previewCanvas.style.cursor == 'none';
    }

    stopDrawing() {
        this.drawingService.previewCanvas.style.cursor = 'crosshair';
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
    }

    onMouseMove(event: MouseEvent) {
        this.drawingService.previewCanvas.style.cursor = this.isInCanvas(event) ? 'none' : 'crosshair';
        this.config.position = this.getPositionFromMouse(event);
        this.drawPreview();
    }

    onMouseDown(event: MouseEvent) {
        if (event.button === MouseButton.Left) {
            this.config.position = this.getPositionFromMouse(event);
            this.draw();
        }
    }

    onKeyDown(event: KeyboardEvent) {
        if(!this.alt.isDown && event.altKey)
          this.alt.isDown = this.alt.equals(event);
    }

    onKeyUp(event: KeyboardEvent) {
        if(this.alt.isDown && !event.altKey)
          this.alt.isDown = !this.alt.equals(event);
    }

    draw() {
        const command = new StampDraw(this.colorService, this.config);
        this.drawingService.draw(command);
    }

    drawPreview() {
        const command = new StampDraw(this.colorService, this.config);
        this.drawingService.passDrawPreview(command);
    }
}
