import { Injectable } from '@angular/core';
import { ToolHandlerService } from '@app/services/tools/tool-handler.service';

@Injectable({
    providedIn: 'root',
})
export class ShortcutHandlerService {
    blockShortcuts: boolean;

    constructor(private toolHandlerService: ToolHandlerService) {
        this.blockShortcuts = false;
    }

    onKeyDown(event: KeyboardEvent): void {
        if (!this.blockShortcuts) this.toolHandlerService.onKeyDown(event);
    }
}
