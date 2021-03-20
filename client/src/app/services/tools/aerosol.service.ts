import { Injectable } from '@angular/core';
import { AerosolDraw } from '@app/classes/commands/aerosol-draw';
import { ShortcutKey } from '@app/classes/shortcut/shortcut-key';
import { Tool } from '@app/classes/tool';
import { AerosolConfig } from '@app/classes/tool-config/aerosol-config';
import { AerosolToolConstants } from '@app/classes/tool_ui_settings/tools.constants';
import { Vec2 } from '@app/classes/vec2';
import { MouseButton } from '@app/constants/control';
import { ToolSettingsConst } from '@app/constants/tool-settings';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ColorService } from 'src/color-picker/services/color.service';
export enum LeftMouse {
    Released = 0,
    Pressed = 1,
}

const MS_PER_SECOND = 1000;

@Injectable({
    providedIn: 'root',
})
export class AerosolService extends Tool {
    toolID: string = AerosolToolConstants.TOOL_ID;
    sprayIntervalID: number;

    config: AerosolConfig = new AerosolConfig();
    private emissionsPerSecondIn: number;

    constructor(drawingService: DrawingService, colorService: ColorService) {
        super(drawingService, colorService);
        this.shortcutKey = new ShortcutKey(AerosolToolConstants.SHORTCUT_KEY);
        this.emissionsPerSecondIn = ToolSettingsConst.DEFAULT_AEROSOL_EMISSIONS_PER_SECOND;
    }

    stopDrawing(): void {
        this.onMouseUp({} as MouseEvent);
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
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

    onMouseDown(event: MouseEvent): void {
        this.leftMouseDown = event.button === MouseButton.Left;
        if (this.leftMouseDown) {
            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.sprayContinuously(this.drawingService.previewCtx);
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.leftMouseDown) {
            this.draw();
            this.config.droplets = [];
        }
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.leftMouseDown = false;
        window.clearInterval(this.sprayIntervalID);
    }

    onMouseMove(event: MouseEvent): void {
        if (this.leftMouseDown) {
            this.mouseDownCoord = this.getPositionFromMouse(event);
        }
    }

    onMouseLeave(event: MouseEvent): void {
        window.clearInterval(this.sprayIntervalID);
        if (!this.leftMouseDown) {
            this.config.droplets = [];
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
        }
    }

    onMouseEnter(event: MouseEvent): void {
        if (event.button !== MouseButton.Left) return;

        if (event.buttons === LeftMouse.Pressed) {
            this.onMouseDown(event);
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

    private sprayContinuously(ctx: CanvasRenderingContext2D): void {
        this.config.droplets = [];

        this.sprayIntervalID = window.setInterval(() => {
            this.placeDroplets();
            this.drawPreview();
        }, MS_PER_SECOND / this.emissionsPerSecondIn);
    }

    private placeDroplets(): void {
        this.config.droplets.push([]);
        for (let i = 0; i < this.config.nDropletsPerSpray; i++) {
            const randOffset: Vec2 = this.randomDroplet();

            const randX: number = this.mouseDownCoord.x + randOffset.x;
            const randY: number = this.mouseDownCoord.y + randOffset.y;
            this.config.droplets[this.config.droplets.length - 1].push({ x: randX, y: randY });
        }
    }

    private randomDroplet(): Vec2 {
        const areaRadius = this.config.areaDiameter / 2;
        const angle = Math.PI * Math.random() * this.config.areaDiameter;
        const randomDistFromCenter = Math.random() * areaRadius + Math.random() * areaRadius;
        const randomRadius = randomDistFromCenter > areaRadius ? this.config.areaDiameter - randomDistFromCenter : randomDistFromCenter;
        return {
            x: Math.cos(angle) * randomRadius,
            y: Math.sin(angle) * randomRadius,
        };
    }
}
