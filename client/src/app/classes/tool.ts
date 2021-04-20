import { ShortcutKey } from '@app/classes/shortcut/shortcut-key';
import { ColorService } from '@app/services/color/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { Vec2 } from './vec2';

// Justified since there are functions that will be managed by child classes
// tslint:disable:no-empty
export abstract class Tool {
    mouseDownCoord: Vec2;
    leftMouseDown: boolean = false;
    shortcutKey: ShortcutKey;
    toolID: string;
    constructor(protected drawingService: DrawingService, protected colorService: ColorService) {}

    isInCanvas(event: MouseEvent): boolean {
        const clientRect = this.drawingService.canvas.getBoundingClientRect();

        const border: number = this.getBorder();
        const left = clientRect.x;
        const right = clientRect.x + clientRect.width;
        const top = clientRect.y;
        const bottom = clientRect.y + clientRect.height;
        return !(event.x < left + border || event.x >= right - border || event.y <= top + border / 2 || event.y >= bottom - border);
    }

    onMouseDown(_: MouseEvent): void {}

    onDoubleClick(_: MouseEvent): void {}

    onMouseUp(_: MouseEvent): void {}

    onMouseMove(_: MouseEvent): void {}

    onMouseLeave(_: MouseEvent): void {}

    onMouseEnter(_: MouseEvent): void {}

    onKeyDown(_: KeyboardEvent): void {}

    onKeyUp(_: KeyboardEvent): void {}

    onDocumentMouseDown(_: MouseEvent): void {}

    stopDrawing(): void {}

    getPositionFromMouse(event: MouseEvent): Vec2 {
        const clientRect = this.drawingService.canvas.getBoundingClientRect();
        const border: number = this.getBorder();
        return new Vec2(event.clientX - clientRect.x, event.clientY - clientRect.y).substractValue(border);
    }

    private getBorder(): number {
        const borderValue: string = window.getComputedStyle(this.drawingService.canvas).getPropertyValue('border-left-width');
        return Number(borderValue.substring(0, borderValue.length - 2));
    }
}
