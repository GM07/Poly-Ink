import { ShortcutKey } from '@app/classes/shortcut-key';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ColorService } from 'src/color-picker/services/color.service';
import { Vec2 } from './vec2';

// Ceci est justifié vu qu'on a des fonctions qui seront gérés par les classes enfant
// tslint:disable:no-empty
export abstract class Tool {
    constructor(protected drawingService: DrawingService, protected colorService: ColorService) {}
    mouseDownCoord: Vec2;
    mouseDown: boolean = false;
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

    abstract stopDrawing(): void;

    getPositionFromMouse(event: MouseEvent): Vec2 {
        return { x: event.offsetX, y: event.offsetY };
    }
}
