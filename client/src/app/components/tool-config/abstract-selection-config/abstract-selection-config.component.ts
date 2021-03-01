import { Component, Injectable } from '@angular/core';
import { ToolConfig } from '@app/classes/tool-config';
import { AbstractSelectionService } from '@app/services/tools/abstract-selection.service';

@Injectable()
@Component({
    selector: 'app-abstract-selection-config',
    templateUrl: './abstract-selection-config.component.html',
    styleUrls: ['./abstract-selection-config.component.scss'],
})
export class AbstractSelectionConfigComponent extends ToolConfig {
    constructor(protected selectionService: AbstractSelectionService) {
        super();
    }

    selectAll() {
        this.selectionService.selectAll();
    }
}
