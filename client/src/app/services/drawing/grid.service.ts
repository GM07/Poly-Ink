import { Injectable } from '@angular/core';
import { ShortcutKey } from '@app/classes/shortcut/shortcut-key';
import { Vec2 } from '@app/classes/vec2';
import { ToolMath } from '@app/constants/math';
import { ToolSettingsConst } from '@app/constants/tool-settings';
import { Colors } from 'src/color-picker/constants/colors';

@Injectable({
    providedIn: 'root',
})
export class GridService {
    ctx: CanvasRenderingContext2D;
    canvas: HTMLCanvasElement;
    gridVisibility: boolean;
    size: number;
    private gridColor: string;
    private opacity: number;
    private toggleGridShortcut: ShortcutKey;
    private upsizeGridShortcut: ShortcutKey[];
    private downSizeGridShortcut: ShortcutKey;

    constructor() {
        this.size = ToolSettingsConst.GRID_MIN_SIZE;
        this.toggleGridShortcut = new ShortcutKey('g');
        this.upsizeGridShortcut = [new ShortcutKey('+'), new ShortcutKey('='), new ShortcutKey('+', false, true)];
        this.downSizeGridShortcut = new ShortcutKey('-');
        this.opacity = ToolSettingsConst.GRID_DEFAULT_OPACITY;
        this.gridVisibility = false;
    }

    toggleGridVisibility(): void {
        this.gridVisibility = !this.gridVisibility;
    }

    set sizeValue(size: number) {
        this.size = Math.max(Math.min(size, ToolSettingsConst.GRID_MAX_SIZE), ToolSettingsConst.GRID_MIN_SIZE);
        this.updateGrid();
    }

    get sizeValue(): number {
        return this.size;
    }

    set opacityValue(size: number) {
        this.opacity = Math.max(ToolSettingsConst.GRID_MIN_OPACITY, Math.min(1 - size / ToolMath.PERCENTAGE, ToolSettingsConst.GRID_MAX_OPACITY));
        this.updateGrid();
    }

    get opacityValue(): number {
        return Math.round((1 - this.opacity) * ToolMath.PERCENTAGE);
    }

    onKeyDown(event: KeyboardEvent): void {
        if (this.toggleGridShortcut.equals(event)) {
            this.toggleGridVisibility();
        } else if (ShortcutKey.contains(this.upsizeGridShortcut, event)) {
            this.sizeValue = this.sizeValue + ToolSettingsConst.GRID_STEP;
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.updateGrid();
        } else if (this.downSizeGridShortcut.equals(event)) {
            this.sizeValue = this.sizeValue - ToolSettingsConst.GRID_STEP;
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.updateGrid();
        }
    }

    updateGrid(): void {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.lineWidth = 1;
        this.ctx.setLineDash([2, 2]);
        this.gridColor = Colors.BLACK.toRgbaString(this.opacity);

        for (let i = 0; i < this.canvas.width; i += this.size) this.drawDotted(new Vec2(i, 0), new Vec2(i, this.canvas.height));

        for (let i = 0; i < this.canvas.width; i += this.size) this.drawDotted(new Vec2(0, i), new Vec2(this.canvas.width, i));

        this.ctx.setLineDash([]);
    }

    drawDotted(begin: Vec2, end: Vec2): void {
        this.ctx.strokeStyle = this.gridColor;
        this.drawLine(new Vec2(begin.x, begin.y), new Vec2(end.x, end.y));
        this.ctx.lineDashOffset = 2;
        this.ctx.strokeStyle = Colors.WHITE.rgbString;
        this.drawLine(new Vec2(begin.x, begin.y), new Vec2(end.x, end.y));
        this.ctx.lineDashOffset = 0;
    }

    drawLine(begin: Vec2, end: Vec2): void {
        this.ctx.beginPath();
        this.ctx.moveTo(begin.x, begin.y);
        this.ctx.lineTo(end.x, end.y);
        this.ctx.stroke();
    }
}
