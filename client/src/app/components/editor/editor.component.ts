import { Component, ViewChild } from '@angular/core';
import { NewDrawingConstants } from '@app/classes/tool_ui_settings/tools.constants';
import { NewDrawingComponent } from '@app/components/canvas-reset/canvas-reset.component';

@Component({
    selector: 'app-editor',
    templateUrl: './editor.component.html',
    styleUrls: ['./editor.component.scss'],
})
export class EditorComponent {
    @ViewChild('newCanvasMenu') newDrawingMenu: NewDrawingComponent;

    resetDrawing(toolID: string): void {
        if (toolID === NewDrawingConstants.TOOL_ID) this.newDrawingMenu.createNewDrawing(false);
    }
}
