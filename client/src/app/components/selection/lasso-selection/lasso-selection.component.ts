import { ChangeDetectorRef, Component } from '@angular/core';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { SelectionEventsService } from '@app/services/selection/selection-events.service';
import { ShortcutHandlerService } from '@app/services/shortcut/shortcut-handler.service';
import { LassoService } from '@app/services/tools/lasso.service';
import { AbstractSelectionComponent } from '../abstract-selection/abstract-selection.component';

@Component({
    selector: 'app-lasso-selection',
    templateUrl: './../abstract-selection/abstract-selection.component.html',
    styleUrls: ['./../abstract-selection/abstract-selection.component.scss'],
})
export class LassoSelectionComponent extends AbstractSelectionComponent {
    constructor(
        selectionService: LassoService,
        drawingService: DrawingService,
        cd: ChangeDetectorRef,
        selectionEvents: SelectionEventsService,
        shortcutHandlerService: ShortcutHandlerService,
    ) {
        super(selectionService, drawingService, cd, selectionEvents, shortcutHandlerService);
    }
}
