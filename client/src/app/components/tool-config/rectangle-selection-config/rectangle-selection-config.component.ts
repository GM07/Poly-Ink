import { Component } from '@angular/core';
import { AbstractSelectionConfigComponent } from '@app/components/tool-config/abstract-selection-config/abstract-selection-config.component';
import { ClipboardService } from '@app/services/clipboard/clipboard.service';
import { RectangleSelectionService } from '@app/services/tools/rectangle-selection.service';

@Component({
    selector: 'app-rectangle-selection-config',
    templateUrl: './../abstract-selection-config/abstract-selection-config.component.html',
    styleUrls: ['./../abstract-selection-config/abstract-selection-config.component.scss'],
})
export class RectangleSelectionConfigComponent extends AbstractSelectionConfigComponent {
    constructor(rectangleSelectionService: RectangleSelectionService, clipboardService: ClipboardService) {
        super(rectangleSelectionService, clipboardService);
    }
}
