import { Component } from '@angular/core';
import { RectangleSelectionService } from '@app/services/tools/rectangle-selection.service';
import { AbstractSelectionConfigComponent } from '../abstract-selection-config/abstract-selection-config.component';

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
