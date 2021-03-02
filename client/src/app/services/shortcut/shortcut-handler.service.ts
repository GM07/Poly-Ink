import { Injectable } from '@angular/core';
import { ToolHandlerService } from '@app/services/tools/tool-handler.service';

@Injectable({
    providedIn: 'root',
})
export class ShortcutHandlerService {
    blockShortcuts: boolean = false;
    ignoreEvent: (event: KeyboardEvent) => boolean;

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

    setIgnoreFunctionToDefault(): void {
        this.ignoreEvent = this.defaultIgnoreEvent;
    }
}
