import { Component } from '@angular/core';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { RectangleSelectionService } from '@app/services/tools/rectangle-selection.service';
import { AbstractSelectionComponent } from '../abstract-selection/abstract-selection.component';

@Component({
    selector: 'app-rectangle-selection',
    templateUrl: './../abstract-selection/abstract-selection.component.html',
    styleUrls: ['./../abstract-selection/abstract-selection.component.scss'],
})
export class RectangleSelectionComponent extends AbstractSelectionComponent {
    constructor(rectangleSelectionService: RectangleSelectionService, drawingService: DrawingService) {
        super(rectangleSelectionService, drawingService);
    }
}
