import { Injectable } from '@angular/core';
import { AerosolDraw } from '@app/classes/commands/aerosol-draw';
import { ShortcutKey } from '@app/classes/shortcut/shortcut-key';
import { Tool } from '@app/classes/tool';
import { AerosolConfig } from '@app/classes/tool-config/aerosol-config';
import { AerosolToolConstants } from '@app/classes/tool_ui_settings/tools.constants';
import { Vec2 } from '@app/classes/vec2';
import { MouseButton } from '@app/constants/control';
import { ToolSettingsConst } from '@app/constants/tool-settings';
import { ColorService } from '@app/services/color/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
export enum LeftMouse {
    Released = 0,
    Pressed = 1,
}

const MS_PER_SECOND = 1000;

@Injectable({
    providedIn: 'root',
})
export class AerosolService extends Tool {
    sprayIntervalID: number;

    config: AerosolConfig;
    private emissionsPerSecondIn: number;

    constructor(drawingService: DrawingService, colorService: ColorService) {
        super(drawingService, colorService);
        this.shortcutKey = new ShortcutKey(AerosolToolConstants.SHORTCUT_KEY);
        this.emissionsPerSecondIn = ToolSettingsConst.DEFAULT_AEROSOL_EMISSIONS_PER_SECOND;
        this.toolID = AerosolToolConstants.TOOL_ID;
        this.config = new AerosolConfig();
    }

    get areaDiameter(): number {
        return this.config.areaDiameter;
    }

    set areaDiameter(diameter: number) {
        this.config.areaDiameter = Math.min(Math.max(diameter, ToolSettingsConst.MIN_AREA_WIDTH), ToolSettingsConst.MAX_AREA_WIDTH);
        this.config.nDropletsPerSpray = this.config.areaDiameter;
    }

    get dropletDiameter(): number {
        return this.config.dropletDiameter;
    }

    set dropletDiameter(diameter: number) {
        this.config.dropletDiameter = Math.min(Math.max(diameter, ToolSettingsConst.MIN_DROPLETS_WIDTH), ToolSettingsConst.MAX_DROPLETS_WIDTH);
    }

    get emissionsPerSecond(): number {
        return this.emissionsPerSecondIn;
    }

    set emissionsPerSecond(emissionsPerSecond: number) {
        this.emissionsPerSecondIn = Math.min(
            Math.max(emissionsPerSecond, ToolSettingsConst.MIN_EMISSIONS_PER_SECOND),
            ToolSettingsConst.MAX_EMISSIONS_PER_SECOND,
        );
    }

    stopDrawing(): void {
        this.onMouseUp();
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
    }

    onMouseDown(event: MouseEvent): void {
        this.leftMouseDown = event.button === MouseButton.Left;
        if (this.leftMouseDown) {
            this.config.seed = Math.random().toString();
            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.sprayContinuously();
        }
    }

    onMouseUp(): void {
        if (this.leftMouseDown) {
            this.draw();
        }
        this.config.points = [];
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.leftMouseDown = false;
        window.clearInterval(this.sprayIntervalID);
    }

    onMouseMove(event: MouseEvent): void {
        if (this.leftMouseDown) {
            this.mouseDownCoord = this.getPositionFromMouse(event);
        }
    }

    onMouseLeave(): void {
        window.clearInterval(this.sprayIntervalID);
        if (!this.leftMouseDown) {
            this.config.points = [];
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
        }
    }

    onMouseEnter(event: MouseEvent): void {
        if (event.button !== MouseButton.Left) return;

        if (event.buttons === LeftMouse.Pressed && this.leftMouseDown) {
            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.sprayContinuously();
        }
    }

    draw(): void {
        const command = new AerosolDraw(this.colorService, this.config);
        this.drawingService.draw(command);
    }

    drawPreview(): void {
        const command = new AerosolDraw(this.colorService, this.config);
        this.drawingService.drawPreview(command);
    }

    private sprayContinuously(): void {
        this.sprayIntervalID = window.setInterval(() => {
            this.placePoints();
            this.drawPreview();
        }, MS_PER_SECOND / this.emissionsPerSecondIn);
    }

    private placePoints(): void {
        this.config.points.push(new Vec2(this.mouseDownCoord.x, this.mouseDownCoord.y));
    }
}
