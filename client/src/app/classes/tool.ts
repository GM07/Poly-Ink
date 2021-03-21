import { ShortcutKey } from '@app/classes/shortcut/shortcut-key';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ColorService } from 'src/color-picker/services/color.service';
import { Vec2 } from './vec2';

// Justified since there are functions that will be managed by child classes
// tslint:disable:no-empty
export abstract class Tool {
    constructor(protected drawingService: DrawingService, protected colorService: ColorService) {}
    mouseDownCoord: Vec2;
    leftMouseDown: boolean = false;
    shortcutKey: ShortcutKey;
    toolID: string;

    isInCanvas(event: MouseEvent): boolean {
        const clientRect = this.drawingService.canvas.getBoundingClientRect();

        const border: number = this.getBorder();
        const left = clientRect.x;
        const right = clientRect.x + clientRect.width;
        const top = clientRect.y;
        const bottom = clientRect.y + clientRect.height;
        if (event.x < left + border || event.x >= right - border || event.y <= top + border / 2 || event.y >= bottom - border) return false;
        return true;
    }

    private getBorder(): number {
        const borderValue: string = window.getComputedStyle(this.drawingService.canvas).getPropertyValue('border-left-width');
        return Number(borderValue.substring(0, borderValue.length - 2));
    }

    onMouseDown(event: MouseEvent): void {}

    onDoubleClick(event: MouseEvent): void {}

    onMouseUp(event: MouseEvent): void {}

    onMouseMove(event: MouseEvent): void {}

    onMouseLeave(event: MouseEvent): void {}

    onMouseEnter(event: MouseEvent): void {}

    onKeyDown(event: KeyboardEvent): void {}

    onKeyUp(event: KeyboardEvent): void {}

    abstract stopDrawing(): void;

    getPositionFromMouse(event: MouseEvent): Vec2 {
        const clientRect = this.drawingService.canvas.getBoundingClientRect();
        const border: number = this.getBorder();
        return { x: event.clientX - clientRect.x - border, y: event.clientY - clientRect.y - border };
    }
}
