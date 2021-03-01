import { Injectable } from '@angular/core';
import { ToolHandlerService } from '@app/services/tools/tool-handler.service';

@Injectable({
    providedIn: 'root',
})
export class ShortcutHandlerService {
    public blockShortcuts: boolean = false;
    public ignoreEvent = (event: KeyboardEvent): boolean => {
        return false;
    };

    constructor(private toolHandlerService: ToolHandlerService) {
        this.ignoreEvent = this.defaultIgnoreEvent;
    }

    handleKeyEvent(event: KeyboardEvent): void {
        if (this.blockShortcuts || this.ignoreEvent(event)) {
            event.preventDefault();
            event.stopImmediatePropagation();
        }
    }

    onKeyDown(event: KeyboardEvent): void {
        if (!this.blockShortcuts && !this.ignoreEvent(event)) this.toolHandlerService.onKeyDown(event);
    }

    defaultIgnoreEvent(event: KeyboardEvent): boolean {
        return false;
    }
}
