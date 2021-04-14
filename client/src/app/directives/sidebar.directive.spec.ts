import { TestBed } from '@angular/core/testing';
import { SidebarEventService } from '@app/services/selection/sidebar-events.service';
import { SidebarDirective } from './sidebar.directive';

describe('SidebarDirective', () => {
    let selectionEventsService: SidebarEventService;
    let directive: SidebarDirective;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [SidebarEventService],
        });

        selectionEventsService = TestBed.inject(SidebarEventService);
        directive = new SidebarDirective(selectionEventsService);
    });

    it('should create an instance', () => {
        expect(directive).toBeTruthy();
    });

    it('should transfer the mouseenter event', () => {
        const nextSpy = spyOn(selectionEventsService.onMouseEnterEvent, 'next');
        directive.onMouseEnter();
        expect(nextSpy).toHaveBeenCalled();
    });

    it('should transfer the mouseleave event', () => {
        const nextSpy = spyOn(selectionEventsService.onMouseLeaveEvent, 'next');
        directive.onMouseLeave();
        expect(nextSpy).toHaveBeenCalled();
    });
});
