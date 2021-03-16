import { Directive, HostListener } from '@angular/core';
import { SelectionEventsService } from '@app/services/selection/selection-events.service';

@Directive({
    selector: '[appSidebar]',
})
export class SidebarDirective {
    constructor(private selectionEvents: SelectionEventsService) {}

    @HostListener('mouseenter')
    onMouseEnter(): void {
        this.selectionEvents.onMouseEnterEvent.next();
    }

    @HostListener('mouseleave')
    onMouseLeave(): void {
        this.selectionEvents.onMouseLeaveEvent.next();
    }
}
