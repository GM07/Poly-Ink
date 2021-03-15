import { ChangeDetectorRef, Component } from '@angular/core';
import { AbstractSelectionComponent } from '@app/components/selection/abstract-selection/abstract-selection.component';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { RectangleSelectionService } from '@app/services/tools/rectangle-selection.service';

@Component({
    selector: 'app-rectangle-selection',
    templateUrl: './../abstract-selection/abstract-selection.component.html',
    styleUrls: ['./../abstract-selection/abstract-selection.component.scss'],
})
export class RectangleSelectionComponent extends AbstractSelectionComponent {
    constructor(rectangleSelectionService: RectangleSelectionService, drawingService: DrawingService, cd: ChangeDetectorRef) {
        super(rectangleSelectionService, drawingService, cd);
    }
}
