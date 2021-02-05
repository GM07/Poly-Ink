import { Component, ViewChild } from '@angular/core';
import { NewDrawingComponent } from '@app/components/canvas-reset/canvas-reset.component';

@Component({
    selector: 'app-editor',
    templateUrl: './editor.component.html',
    styleUrls: ['./editor.component.scss'],
})
export class EditorComponent {
    @ViewChild('newCanvasMenu') newDrawingMenu: NewDrawingComponent;

    constructor() {
        //
    }

    executeAction(action: string): void {
        if (action === 'Nouveau Dessin') {
            this.newDrawingMenu.createNewDrawing(false);
        }
    }
}
