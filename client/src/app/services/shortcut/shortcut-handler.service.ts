import { Injectable } from '@angular/core';
import { ClipboardService } from '@app/services/clipboard/clipboard.service';
import { GridService } from '@app/services/drawing/grid.service';
import { MagnetismService } from '@app/services/drawing/magnetism.service';
import { TextService } from '@app/services/tools/text.service';
import { ToolHandlerService } from '@app/services/tools/tool-handler.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ShortcutHandlerService {
    private blockShortcutsIn: boolean;
    private isWhiteListed: boolean;
    private lastMouseMoveEvent: MouseEvent;
    blockShortcutsEvent: Subject<boolean>;

    constructor(
        private toolHandlerService: ToolHandlerService,
        private undoRedoService: UndoRedoService,
        private clipboardService: ClipboardService,
        private textService: TextService,
        private magnetismService: MagnetismService,
        private gridService: GridService,
    ) {
        this.isWhiteListed = false;
        this.blockShortcutsIn = false;
        this.blockShortcutsEvent = new Subject<boolean>();
        this.initSubscriptions();
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
        if (!this.blockShortcutsIn) {
            this.undoRedoService.onKeyDown(event);
            this.toolHandlerService.onKeyDown(event);
            this.clipboardService.onKeyDown(event);
            this.gridService.onKeyDown(event);
            this.magnetismService.onKeyDown(event);
        } else if (this.isWhiteListed) {
            this.toolHandlerService.getCurrentTool().onKeyDown(event);
        }
    }

    onMouseMove(event: MouseEvent): void {
        this.lastMouseMoveEvent = event;
        if (!this.blockShortcutsIn && !this.isWhiteListed) {
            this.toolHandlerService.onMouseMove(event);
            this.lastMouseMoveEvent = event;
        }
    }

    private initSubscriptions(): void {
        this.textService.BLOCK_SHORTCUTS.subscribe((block: boolean) => {
            this.blockShortcuts = block;
            this.isWhiteListed = block;
        });
    }
}
