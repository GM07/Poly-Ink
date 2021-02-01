import { Injectable } from '@angular/core';
import { CanvasConst } from '@app/constants/canvas.ts';

@Injectable({
    providedIn: 'root',
})
export class CanvasTestHelper {
    canvas: HTMLCanvasElement;
    drawCanvas: HTMLCanvasElement;
    selectionCanvas: HTMLCanvasElement;

    constructor() {
        this.canvas = this.createCanvas(CanvasConst.MIN_WIDTH, CanvasConst.MIN_HEIGHT);
        this.drawCanvas = this.createCanvas(CanvasConst.MIN_WIDTH, CanvasConst.MIN_HEIGHT);
        this.selectionCanvas = this.createCanvas(CanvasConst.MIN_WIDTH, CanvasConst.MIN_HEIGHT);
    }

    private createCanvas(width: number, height: number): HTMLCanvasElement {
        const canvas: HTMLCanvasElement = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        return canvas;
    }
}
