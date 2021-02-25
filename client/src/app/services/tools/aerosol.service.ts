import { Injectable } from '@angular/core';
import { ShortcutKey } from '@app/classes/shortcut-key';
import { Tool } from '@app/classes/tool';
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
const DEGREES = 360;

@Injectable({
    providedIn: 'root',
})
export class AerosolService extends Tool {
    toolID: string = AerosolToolConstants.TOOL_ID;

    private dropletDiameterIn: number;
    private areaDiameterIn: number;
    sprayIntervalID: number;
    private nDropletsPerSpray: number;
    private emissionsPerSecondIn: number;
    mousePosition: Vec2;

    constructor(drawingService: DrawingService, colorService: ColorService) {
        super(drawingService, colorService);
        this.shortcutKey = new ShortcutKey(AerosolToolConstants.SHORTCUT_KEY);
        this.nDropletsPerSpray = ToolSettingsConst.DEFAULT_AEROSOL_AREA_DIAMETER;
        this.dropletDiameterIn = ToolSettingsConst.MIN_DROPLETS_WIDTH;
        this.areaDiameterIn = ToolSettingsConst.DEFAULT_AEROSOL_AREA_DIAMETER;
        this.emissionsPerSecondIn = ToolSettingsConst.DEFAULT_AEROSOL_EMISSIONS_PER_SECOND;
    }

    stopDrawing(): void {
        this.onMouseUp({} as MouseEvent);
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
    }

    get areaDiameter(): number {
        return this.areaDiameterIn;
    }

    set areaDiameter(diameter: number) {
        this.areaDiameterIn = Math.min(Math.max(diameter, ToolSettingsConst.MIN_AREA_WIDTH), ToolSettingsConst.MAX_AREA_WIDTH);
    }

    get dropletDiameter(): number {
        return this.dropletDiameterIn;
    }

    set dropletDiameter(diameter: number) {
        this.dropletDiameterIn = Math.min(Math.max(diameter, ToolSettingsConst.MIN_DROPLETS_WIDTH), ToolSettingsConst.MAX_DROPLETS_WIDTH);
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
        this.mouseDown = event.button === MouseButton.Left;
        if (this.mouseDown) {
            this.mousePosition = this.getPositionFromMouse(event);
            this.sprayContinuously(this.drawingService.previewCtx);
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            // Copie du preview sur le base
            this.drawingService.baseCtx.drawImage(this.drawingService.previewCtx.canvas, 0, 0);
        }
        this.mouseDown = false;
        window.clearInterval(this.sprayIntervalID);
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            this.mousePosition = this.getPositionFromMouse(event);
        }
    }

    onMouseLeave(event: MouseEvent): void {
        window.clearInterval(this.sprayIntervalID);
        if (!this.mouseDown) this.drawingService.clearCanvas(this.drawingService.previewCtx);
    }

    onMouseEnter(event: MouseEvent): void {
        if (event.button !== MouseButton.Left) return;

        if (event.buttons === LeftMouse.Pressed) {
            this.onMouseDown(event);
        }
    }

    sprayContinuously(ctx: CanvasRenderingContext2D): void {
        this.sprayIntervalID = window.setInterval(() => {
            this.drawSpray(this.drawingService.previewCtx);
        }, MS_PER_SECOND / this.emissionsPerSecondIn);
    }

    drawSpray(ctx: CanvasRenderingContext2D): void {
        ctx.beginPath();
        ctx.fillStyle = this.colorService.primaryRgba;
        ctx.strokeStyle = this.colorService.primaryRgba;
        ctx.lineWidth = this.areaDiameter;
        ctx.lineCap = 'round' as CanvasLineCap;
        ctx.lineJoin = 'round' as CanvasLineJoin;

        for (let i = 0; i < this.nDropletsPerSpray; i++) {
            const randOffset: Vec2 = this.randomDroplet();

            const randX: number = this.mousePosition.x + randOffset.x;
            const randY: number = this.mousePosition.y + randOffset.y;
            ctx.arc(randX, randY, this.dropletDiameter / 2, 0, 2 * Math.PI);
            ctx.fill();
            ctx.beginPath();
            ctx.stroke();
        }
    }

    randomDroplet(): Vec2 {
        const randAngle = Math.random() * DEGREES;
        const randRadius = (Math.random() * (this.areaDiameter - this.dropletDiameter)) / 2;
        return {
            x: Math.cos(randAngle) * randRadius,
            y: Math.sin(randAngle) * randRadius,
        };
    }
}
