import { Component, Injectable } from '@angular/core';
import { ToolConfig } from '@app/classes/tool-config';
import { ClipboardService } from '@app/services/clipboard/clipboard.service';
import { AbstractSelectionService } from '@app/services/tools/abstract-selection.service';

@Injectable()
@Component({
    selector: 'app-abstract-selection-config',
    templateUrl: './abstract-selection-config.component.html',
    styleUrls: ['./abstract-selection-config.component.scss'],
})
export class AbstractSelectionConfigComponent extends ToolConfig {
    constructor(protected selectionService: AbstractSelectionService, protected clipboardService: ClipboardService) {
        super();
    }

    get isSelectionActive(): boolean {
        return this.selectionService.config.previewSelectionCtx !== null;
    }

    selectAll(): void {
        this.selectionService.selectAll();
    }

    copySelection(): void {
        this.clipboardService.copyDrawing();
    }

    cutSelection(): void {
        this.clipboardService.cutDrawing();
    }

    deleteSelection(): void {
        this.clipboardService.deleteDrawing();
    }
}
