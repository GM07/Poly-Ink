import { DrawingService } from '@app/services/drawing/drawing.service';
import { Vec2 } from './vec2';

// Ceci est justifié vu qu'on a des fonctions qui seront gérés par les classes enfant
// tslint:disable:no-empty
export abstract class Tool {
    constructor(protected drawingService: DrawingService) {}
    mouseDownCoord: Vec2;
    mouseDown: boolean = false;
    shortCutKey: string;

    /**
     * Types d'entrées acceptées:
     * "couleur";
     * "#FFFFFF" ou #FFF;
     * "rgb(int, int, int)";
     * "rgba(int, int, int, 1.0)";
     */
    static isColorValid(color: string): boolean {
        let colorIsValid = false;
        const style = new Option().style;
        style.color = color;
        colorIsValid = colorIsValid || style.color === color;
        colorIsValid = colorIsValid || /^#([0-9A-F]{3}){1,2}$/.test(color);
        colorIsValid = colorIsValid || /^rgb\((\d+),\s?(\d+),\s?(\d+)\)$/.test(color);
        colorIsValid = colorIsValid || /^rgba\((\d+,\s?){3}(1(\.0+)?|0*(\.\d+))\)$/.test(color);
        return colorIsValid;
    }

    isInCanvas(event: MouseEvent): boolean {
        const clientRect = this.drawingService.canvas.getBoundingClientRect();
        const left = clientRect.x;
        const right = clientRect.x + clientRect.width;
        const top = clientRect.y;
        const bottom = clientRect.y + clientRect.height;
        if (event.x < left || event.x > right || event.y < top || event.y > bottom) return false;
        return true;
    }

    onMouseDown(event: MouseEvent): void {}

    onMouseUp(event: MouseEvent): void {}

    onMouseMove(event: MouseEvent): void {}

    onMouseLeave(event: MouseEvent): void {}

    onMouseEnter(event: MouseEvent): void {}

    abstract stopDrawing(): void;

    getPositionFromMouse(event: MouseEvent): Vec2 {
        return { x: event.offsetX, y: event.offsetY };
    }
}
