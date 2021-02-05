import { Component, HostListener } from '@angular/core';
import { NewDrawingService } from '@app/services/drawing/canvas-reset.service';

@Component({
    selector: 'app-canvas-reset',
    templateUrl: './canvas-reset.component.html',
    styleUrls: ['./canvas-reset.component.scss'],
})
export class NewDrawingComponent {
    constructor(private newDrawing: NewDrawingService) {}

    removeWarning(): void {
        this.newDrawing.showWarning = false;
    }

    showWarning(): boolean {
        return this.newDrawing.showWarning;
    }

    createNewDrawing(confirm: boolean): void {
        this.removeWarning();
        this.newDrawing.newCanvas(confirm);
    }

    @HostListener('document:keydown', ['$event'])
    onKeyPressed(event: KeyboardEvent): void {
        if (event.ctrlKey && event.key !== 'Control') {
            if (event.key.toLocaleLowerCase() === 'o') {
                event.preventDefault();
                this.newDrawing.newCanvas();
            }
        }
    }
}
