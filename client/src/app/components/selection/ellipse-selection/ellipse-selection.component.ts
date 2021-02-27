import { Component } from '@angular/core';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { EllipseSelectionService } from '@app/services/tools/ellipse-selection.service';
import { AbstractSelectionComponent } from '../abstract-selection/abstract-selection.component';

@Component({
    selector: 'app-ellipse-selection',
    templateUrl: './../abstract-selection/abstract-selection.component.html',
    styleUrls: ['./../abstract-selection/abstract-selection.component.scss'],
})
export class EllipseSelectionComponent extends AbstractSelectionComponent {
    constructor(selectionService: EllipseSelectionService, drawingService: DrawingService) {
        super(selectionService, drawingService);
    }
}
