import { Component, ViewChild } from '@angular/core';
import { NewDrawingComponent } from '@app/components/canvas-reset/canvas-reset.component';
import { NewDrawingConstants } from '@app/classes/tool_settings/tools.constants';

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

    resetDrawing(toolID: string): void {
        if (toolID === NewDrawingConstants.TOOL_ID) {
            this.newDrawingMenu.createNewDrawing(false);
        }
    }
}
