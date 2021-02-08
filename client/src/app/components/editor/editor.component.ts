import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NewDrawingConstants } from '@app/classes/tool_settings/tools.constants';
import { NewDrawingComponent } from '@app/components/canvas-reset/canvas-reset.component';

@Component({
    selector: 'app-editor',
    templateUrl: './editor.component.html',
    styleUrls: ['./editor.component.scss'],
})
export class EditorComponent {
    @ViewChild('newCanvasMenu') newDrawingMenu: NewDrawingComponent;

    constructor(private router: Router) {
        //
    }

    resetDrawing(toolID: string): void {
        if (toolID === NewDrawingConstants.TOOL_ID) this.newDrawingMenu.createNewDrawing(false);
    }

    backToMenu(): void {
        this.router.navigateByUrl('home');
    }
}
