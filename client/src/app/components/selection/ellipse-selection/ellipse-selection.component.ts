import { ChangeDetectorRef, Component } from '@angular/core';
import { AbstractSelectionComponent } from '@app/components/selection/abstract-selection/abstract-selection.component';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { SelectionEventsService } from '@app/services/selection/selection-events.service';
import { ShortcutHandlerService } from '@app/services/shortcut/shortcut-handler.service';
import { EllipseSelectionService } from '@app/services/tools/ellipse-selection.service';

@Component({
    selector: 'app-ellipse-selection',
    templateUrl: './../abstract-selection/abstract-selection.component.html',
    styleUrls: ['./../abstract-selection/abstract-selection.component.scss'],
})
export class EllipseSelectionComponent extends AbstractSelectionComponent {
    constructor(
        selectionService: EllipseSelectionService,
        drawingService: DrawingService,
        cd: ChangeDetectorRef,
        selectionEvents: SelectionEventsService,
        shortcutHandlerService: ShortcutHandlerService,
    ) {
        super(selectionService, drawingService, cd, selectionEvents, shortcutHandlerService);
    }
}
