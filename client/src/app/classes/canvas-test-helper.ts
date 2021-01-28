import { Injectable } from '@angular/core';
import { canvasConst } from '@app/constants/canvas.ts';

@Injectable({
    providedIn: 'root',
})
export class CanvasTestHelper {
    canvas: HTMLCanvasElement;
    drawCanvas: HTMLCanvasElement;
    selectionCanvas: HTMLCanvasElement;

    constructor() {
        this.canvas = this.createCanvas(canvasConst.MIN_WIDTH, canvasConst.MIN_HEIGHT);
        this.drawCanvas = this.createCanvas(canvasConst.MIN_WIDTH, canvasConst.MIN_HEIGHT);
        this.selectionCanvas = this.createCanvas(canvasConst.MIN_WIDTH, canvasConst.MIN_HEIGHT);
    }

    private createCanvas(width: number, height: number): HTMLCanvasElement {
        const canvas: HTMLCanvasElement = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        return canvas;
    }
}
