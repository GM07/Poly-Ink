import { Injectable } from '@angular/core';
import { ToolHandlerService } from '@app/services/tools/tool-handler.service';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ShortcutHandlerService {
    private blockShortcutsIn: boolean;
    private lastMouseMoveEvent: MouseEvent;
    blockShortcutsEvent: Subject<boolean>;

    constructor(private toolHandlerService: ToolHandlerService) {
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
        if (!this.blockShortcutsIn) this.toolHandlerService.onKeyDown(event);
    }

    onMouseMove(event: MouseEvent): void {
        this.lastMouseMoveEvent = event;
        if (!this.blockShortcutsIn) {
            this.toolHandlerService.onMouseMove(event);
            this.lastMouseMoveEvent = event;
        }
    }
}
