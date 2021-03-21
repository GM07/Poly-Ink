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
        const left = clientRect.x;
        const right = clientRect.x + clientRect.width;
        const top = clientRect.y;
        const bottom = clientRect.y + clientRect.height;
        if (event.x <= left || event.x >= right || event.y <= top || event.y >= bottom) return false;
        return true;
    }

    onMouseDown(event: MouseEvent): void {}

    onDoubleClick(event: MouseEvent): void {}

    onMouseUp(event: MouseEvent): void {}

    onMouseMove(event: MouseEvent): void {}

    onMouseLeave(event: MouseEvent): void {}

    onMouseEnter(event: MouseEvent): void {}

    onKeyDown(event: KeyboardEvent): void {}

    onKeyUp(event: KeyboardEvent): void {}

    stopDrawing(): void {}

    getPositionFromMouse(event: MouseEvent): Vec2 {
        const clientRect = this.drawingService.canvas.getBoundingClientRect();
        const borderLeftValue: string = window.getComputedStyle(this.drawingService.canvas).getPropertyValue('border-left-width');
        const borderTopValue: string = window.getComputedStyle(this.drawingService.canvas).getPropertyValue('border-top-width');

        const borderLeft: number = Number(borderLeftValue.substring(0, borderLeftValue.length - 2));
        const borderTop: number = Number(borderTopValue.substring(0, borderTopValue.length - 2));

        return { x: event.clientX - clientRect.x - borderLeft, y: event.clientY - clientRect.y - borderTop };
    }
}
