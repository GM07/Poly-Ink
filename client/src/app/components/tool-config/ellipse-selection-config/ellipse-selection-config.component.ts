import { Component } from '@angular/core';
import { EllipseSelectionService } from '@app/services/tools/ellipse-selection.service';
import { AbstractSelectionConfigComponent } from '../abstract-selection-config/abstract-selection-config.component';

@Component({
    selector: 'app-abstract-selection-config',
    templateUrl: './../abstract-selection-config/abstract-selection-config.component.html',
    styleUrls: ['./../abstract-selection-config/abstract-selection-config.component.scss'],
})
export class EllipseSelectionConfigComponent extends AbstractSelectionConfigComponent {
    constructor(selectionService: EllipseSelectionService) {
        super(selectionService);
    }
}
