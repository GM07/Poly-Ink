import { Component } from '@angular/core';
import { AbstractSelectionConfigComponent } from '@app/components/tool-config/abstract-selection-config/abstract-selection-config.component';
import { ClipboardService } from '@app/services/clipboard/clipboard.service';
import { EllipseSelectionService } from '@app/services/tools/ellipse-selection.service';

@Component({
    selector: 'app-abstract-selection-config',
    templateUrl: './../abstract-selection-config/abstract-selection-config.component.html',
    styleUrls: ['./../abstract-selection-config/abstract-selection-config.component.scss'],
})
export class EllipseSelectionConfigComponent extends AbstractSelectionConfigComponent {
    constructor(selectionService: EllipseSelectionService, clipboardService: ClipboardService) {
        super(selectionService, clipboardService);
    }
}
