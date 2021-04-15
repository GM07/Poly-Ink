import { ChangeDetectorRef, Component } from '@angular/core';
import { AbstractSelectionComponent } from '@app/components/selection/abstract-selection/abstract-selection.component';
import { ClipboardService } from '@app/services/clipboard/clipboard.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { SidebarEventService } from '@app/services/selection/sidebar-events.service';
import { ShortcutHandlerService } from '@app/services/shortcut/shortcut-handler.service';
import { LassoService } from '@app/services/tools/lasso.service';

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
        selectionEvents: SidebarEventService,
        shortcutHandlerService: ShortcutHandlerService,
        clipboardService: ClipboardService,
    ) {
        super(selectionService, drawingService, cd, selectionEvents, shortcutHandlerService, clipboardService);
    }
}
