import { Component, HostListener, ViewChild } from '@angular/core';
import {
    ExportFileToolConstants,
    NewDrawingConstants,
    RedoConstants,
    SaveFileToolConstants,
    UndoConstants,
} from '@app/classes/tool_ui_settings/tools.constants';
import { NewDrawingComponent } from '@app/components/canvas-reset/canvas-reset.component';
import { ExportDrawingComponent } from '@app/components/export-drawing/export-drawing.component';
import { SaveDrawingComponent } from '@app/components/save-drawing/save-drawing.component';
import { ShortcutHandlerService } from '@app/services/shortcut/shortcut-handler.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';

@Component({
    selector: 'app-editor',
    templateUrl: './editor.component.html',
    styleUrls: ['./editor.component.scss'],
})
export class EditorComponent {
    @ViewChild('newCanvasMenu') private newDrawingMenu: NewDrawingComponent;
    @ViewChild('exportDrawing') private exportDrawing: ExportDrawingComponent;
    @ViewChild('saveDrawing') private saveDrawing: SaveDrawingComponent;

    constructor(public shortcutHandler: ShortcutHandlerService, private undoRedoService: UndoRedoService) {}

    async receiveSidebarButtonEvent(toolID: string): Promise<void> {
        switch (toolID) {
            case RedoConstants.TOOL_ID:
                this.undoRedoService.redo();
                break;
            case UndoConstants.TOOL_ID:
                this.undoRedoService.undo();
                break;
            case NewDrawingConstants.TOOL_ID:
                this.newDrawingMenu.createNewDrawing(false);
                break;
            case ExportFileToolConstants.TOOL_ID:
                await this.exportDrawing.show();
                break;
            case SaveFileToolConstants.TOOL_ID:
                await this.saveDrawing.show();
        }
    }

    @HostListener('document:keydown', ['$event'])
    onKeyDown(event: KeyboardEvent): void {
        this.shortcutHandler.onKeyDown(event);
    }

    @HostListener('document:mousemove', ['$event'])
    onMouseMove(event: MouseEvent): void {
        this.shortcutHandler.onMouseMove(event);
    }

    @HostListener('document:mousedown', ['$event'])
    onDocumentMouseDown(event: MouseEvent): void {
        this.shortcutHandler.onDocumentMouseDown(event);
    }

    @HostListener('window:beforeunload', ['$event'])
    onPageReload(event: BeforeUnloadEvent): void {
        localStorage.setItem('editor_reloading', 'true');
    }
}
