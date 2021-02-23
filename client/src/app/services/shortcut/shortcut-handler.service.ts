import { Injectable } from '@angular/core';
import { ToolHandlerService } from '@app/services/tools/tool-handler.service';

@Injectable({
    providedIn: 'root',
})
export class ShortcutHandlerService {
    blockShortcuts: boolean = false;

    constructor(private toolHandlerService: ToolHandlerService) {}

    handleKeyEvent(event: KeyboardEvent): void {
        if (this.blockShortcuts) {
            event.preventDefault();
            event.stopImmediatePropagation();
        }
    }

    onKeyDown(event: KeyboardEvent): void {
        if (!this.blockShortcuts) this.toolHandlerService.onKeyDown(event);
    }
}
