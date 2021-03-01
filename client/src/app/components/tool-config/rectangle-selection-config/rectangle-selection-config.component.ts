import { Component } from '@angular/core';
import { AbstractSelectionConfigComponent } from '@app/components/tool-config/abstract-selection-config/abstract-selection-config.component';
import { RectangleSelectionService } from '@app/services/tools/rectangle-selection.service';

@Component({
    selector: 'app-rectangle-selection-config',
    templateUrl: './../abstract-selection-config/abstract-selection-config.component.html',
    styleUrls: ['./../abstract-selection-config/abstract-selection-config.component.scss'],
})
export class RectangleSelectionConfigComponent extends AbstractSelectionConfigComponent {
    constructor(rectangleSelectionService: RectangleSelectionService) {
        super(rectangleSelectionService);
    }
}
