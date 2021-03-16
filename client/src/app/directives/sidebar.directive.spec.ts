import { TestBed } from '@angular/core/testing';
import { SelectionEventsService } from '@app/services/selection/selection-events.service';
import { SidebarDirective } from './sidebar.directive';

describe('SidebarDirective', () => {
    let selectionEventsService: SelectionEventsService;
    let directive: SidebarDirective;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [SelectionEventsService],
        });

        selectionEventsService = TestBed.inject(SelectionEventsService);
        directive = new SidebarDirective(selectionEventsService);
    });

    it('should create an instance', () => {
        expect(directive).toBeTruthy();
    });

    it('should transfer the mouseenter event', () => {
        console.log(selectionEventsService);
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
