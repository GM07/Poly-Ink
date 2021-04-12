import { Injectable } from '@angular/core';
import { ClipboardService } from '@app/services/clipboard/clipboard.service';
import { GridService } from '@app/services/drawing/grid.service';
import { TextService } from '@app/services/tools/text.service';
import { ToolHandlerService } from '@app/services/tools/tool-handler.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ShortcutHandlerService {
    private blockShortcutsIn: boolean;
    private lastMouseMoveEvent: MouseEvent;
    blockShortcutsEvent: Subject<boolean>;

    constructor(
        private toolHandlerService: ToolHandlerService,
        private undoRedoService: UndoRedoService,
        private gridService: GridService,
        private clipboardService: ClipboardService,
    ) {
        this.blockShortcutsIn = false;
        this.blockShortcutsEvent = new Subject<boolean>();
    }

    get blockShortcuts(): boolean {
        return this.blockShortcutsIn;
    }

    set blockShortcuts(block: boolean) {
        if (this.lastMouseMoveEvent !== undefined && block) {
            this.toolHandlerService.onMouseUp(this.lastMouseMoveEvent);
        }

        this.blockShortcutsIn = block;
        this.blockShortcutsEvent.next(block);
    }

    onKeyDown(event: KeyboardEvent): void {
        if (this.toolHandlerService.getCurrentTool() instanceof TextService) this.toolHandlerService.getCurrentTool().onKeyDown(event);
        if (!this.blockShortcutsIn) {
            this.undoRedoService.onKeyDown(event);
            this.toolHandlerService.onKeyDown(event);
            this.clipboardService.onKeyDown(event);
            this.gridService.onKeyDown(event);
        }
    }

    onMouseMove(event: MouseEvent): void {
        this.lastMouseMoveEvent = event;
        if (!this.blockShortcutsIn) {
            this.toolHandlerService.onMouseMove(event);
            this.lastMouseMoveEvent = event;
        }
    }
}
