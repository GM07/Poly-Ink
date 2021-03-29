import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AutoSaveService {
    constructor() { }

    hasSavedDrawing(): boolean {
        return localStorage.getItem('drawing') !== null;
    }

    save(canvas: CanvasRenderingContext2D) {
        localStorage.setItem('drawing', canvas.canvas.toDataURL()); 
    }

}
