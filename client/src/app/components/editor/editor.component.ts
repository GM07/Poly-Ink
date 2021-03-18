import { Component, HostListener, ViewChild } from '@angular/core';
import { ExportFileToolConstants, NewDrawingConstants } from '@app/classes/tool_ui_settings/tools.constants';
import { NewDrawingComponent } from '@app/components/canvas-reset/canvas-reset.component';
import { ExportDrawingComponent } from '@app/components/export-drawing/export-drawing.component';
import { ShortcutHandlerService } from '@app/services/shortcut/shortcut-handler.service';

@Component({
    selector: 'app-editor',
    templateUrl: './editor.component.html',
    styleUrls: ['./editor.component.scss'],
})
export class EditorComponent {
    @ViewChild('newCanvasMenu') newDrawingMenu: NewDrawingComponent;
    @ViewChild('exportDrawing') exportDrawing: ExportDrawingComponent;

    async receiveSidebarButtonEvent(toolID: string): Promise<void> {
        switch (toolID) {
            case NewDrawingConstants.TOOL_ID:
                this.newDrawingMenu.createNewDrawing(false);
                break;
            case ExportFileToolConstants.TOOL_ID:
                await this.exportDrawing.show();
                break;
        }
    }

    constructor(public shortcutHandler: ShortcutHandlerService) {}

    @HostListener('document:keydown', ['$event'])
    onKeyDown(event: KeyboardEvent): void {
        this.shortcutHandler.onKeyDown(event);
    }

    @HostListener('document:mousemove', ['$event'])
    onMouseMove(event: MouseEvent): void {
        this.shortcutHandler.onMouseMove(event);
    }
}
