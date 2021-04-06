import { Component } from '@angular/core';
import { AbstractSelectionConfigComponent } from '@app/components/tool-config/abstract-selection-config/abstract-selection-config.component';
import { ClipboardService } from '@app/services/clipboard/clipboard.service';
import { LassoService } from '@app/services/tools/lasso.service';

@Component({
    selector: 'app-lasso-selection-config',
    templateUrl: './../abstract-selection-config/abstract-selection-config.component.html',
    styleUrls: ['./../abstract-selection-config/abstract-selection-config.component.scss'],
})
export class LassoSelectionConfigComponent extends AbstractSelectionConfigComponent {
    constructor(selectionService: LassoService, clipboardService: ClipboardService) {
        super(selectionService, clipboardService);
    }
}
