import { ChangeDetectorRef, Component } from '@angular/core';
import { AbstractSelectionComponent } from '@app/components/selection/abstract-selection/abstract-selection.component';
import { ClipboardService } from '@app/services/clipboard/clipboard.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { SidebarEventService } from '@app/services/selection/sidebar-events.service';
import { ShortcutHandlerService } from '@app/services/shortcut/shortcut-handler.service';
import { RectangleSelectionService } from '@app/services/tools/rectangle-selection.service';

@Component({
    selector: 'app-rectangle-selection',
    templateUrl: './../abstract-selection/abstract-selection.component.html',
    styleUrls: ['./../abstract-selection/abstract-selection.component.scss'],
})
export class RectangleSelectionComponent extends AbstractSelectionComponent {
    constructor(
        selectionService: RectangleSelectionService,
        drawingService: DrawingService,
        cd: ChangeDetectorRef,
        selectionEvents: SidebarEventService,
        shortcutHandlerService: ShortcutHandlerService,
        clipboardService: ClipboardService,
    ) {
        super(selectionService, drawingService, cd, selectionEvents, shortcutHandlerService, clipboardService);
    }
}
