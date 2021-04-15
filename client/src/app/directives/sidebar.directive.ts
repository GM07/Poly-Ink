import { Directive, HostListener } from '@angular/core';
import { SidebarEventService } from '@app/services/selection/sidebar-events.service';

@Directive({
    selector: '[appSidebar]',
})
export class SidebarDirective {
    constructor(private selectionEvents: SidebarEventService) {}

    @HostListener('mouseenter')
    onMouseEnter(): void {
        this.selectionEvents.onMouseEnterEvent.next();
    }

    @HostListener('mouseleave')
    onMouseLeave(): void {
        this.selectionEvents.onMouseLeaveEvent.next();
    }
}
