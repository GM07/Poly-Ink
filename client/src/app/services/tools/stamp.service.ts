import { Injectable } from '@angular/core';
import { StampDraw } from '@app/classes/commands/stamp-draw';
import { AltKey } from '@app/classes/shortcut/alt-key';
import { ShortcutKey } from '@app/classes/shortcut/shortcut-key';
import { Tool } from '@app/classes/tool';
import { StampConfig } from '@app/classes/tool-config/stamp-config';
import { StampToolConstants } from '@app/classes/tool_ui_settings/tools.constants';
import { MouseButton } from '@app/constants/control';
import { ToolMath } from '@app/constants/math';
import { ToolSettingsConst } from '@app/constants/tool-settings';
import { ColorService } from '@app/services/color/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { SidebarEventService } from '@app/services/selection/sidebar-events.service';
@Injectable({
    providedIn: 'root',
})
export class StampService extends Tool {
    readonly ALT_KEY: AltKey = new AltKey();
    config: StampConfig;
    private isInSidebar: boolean;

    constructor(protected drawingService: DrawingService, protected colorService: ColorService, private selectionEvents: SidebarEventService) {
        super(drawingService, colorService);
        this.shortcutKey = new ShortcutKey(StampToolConstants.SHORTCUT_KEY);
        this.toolID = StampToolConstants.TOOL_ID;

        this.config = new StampConfig();

        this.isInSidebar = false;

        this.selectionEvents.onMouseEnterEvent.subscribe(() => (this.isInSidebar = true));
        this.selectionEvents.onMouseLeaveEvent.subscribe(() => (this.isInSidebar = false));
    }

    set scaleValue(scale: number) {
        this.config.scale = Math.min(Math.max(scale, ToolSettingsConst.STAMP_MIN_VALUE), ToolSettingsConst.STAMP_MAX_VALUE);
    }

    set angleValue(angle: number) {
        this.config.angle = Math.min(Math.max((angle / ToolMath.DEGREE_CONVERSION_FACTOR) * Math.PI, 0), 2 * Math.PI);
    }

    get angleValue(): number {
        return Math.round((this.config.angle / Math.PI) * ToolMath.DEGREE_CONVERSION_FACTOR);
    }

    isActive(): boolean {
        return this.drawingService.previewCanvas.style.cursor === 'none';
    }

    stopDrawing(): void {
        this.drawingService.previewCanvas.style.cursor = 'crosshair';
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
    }

    onMouseMove(event: MouseEvent): void {
        this.drawingService.previewCanvas.style.cursor = 'none';
        this.config.position = this.getPositionFromMouse(event);
        this.drawPreview();
    }

    onMouseClick(event: MouseEvent): void {
        if (event.button === MouseButton.Left && !this.isInSidebar) {
            this.config.position = this.getPositionFromMouse(event);
            this.draw();
        }
    }

    onKeyDown(event: KeyboardEvent): void {
        if (this.ALT_KEY.equals(event)) {
            event.preventDefault();
            this.ALT_KEY.isDown = true;
        }
    }

    onKeyUp(event: KeyboardEvent): void {
        if (this.ALT_KEY.equals(event)) {
            event.preventDefault();
            this.ALT_KEY.isDown = false;
        }
    }

    draw(): void {
        const command = new StampDraw(this.colorService, this.config);
        this.drawingService.draw(command);
    }

    drawPreview(): void {
        const command = new StampDraw(this.colorService, this.config);
        this.drawingService.passDrawPreview(command);
    }
}
