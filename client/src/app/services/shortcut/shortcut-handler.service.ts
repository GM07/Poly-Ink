import { Injectable } from '@angular/core';
import { ToolHandlerService } from '@app/services/tools/tool-handler.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';

@Injectable({
    providedIn: 'root',
})
export class ShortcutHandlerService {
    blockShortcuts: boolean;

    constructor(private toolHandlerService: ToolHandlerService, private undoRedoService: UndoRedoService) {
        this.blockShortcuts = false;
    }

    onKeyDown(event: KeyboardEvent): void {
        if (!this.blockShortcuts) {
            this.toolHandlerService.onKeyDown(event);
            this.undoRedoService.onKeyDown(event);
        }
    }
}
