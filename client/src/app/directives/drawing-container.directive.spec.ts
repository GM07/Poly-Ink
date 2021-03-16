import { TestBed } from '@angular/core/testing';
import { SelectionEventsService } from '@app/services/selection/selection-events.service';
import { DrawingContainerDirective } from './drawing-container.directive';

describe('DrawingContainerDirective', () => {
    let selectionEventsService: SelectionEventsService;
    let directive: DrawingContainerDirective;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [SelectionEventsService],
        });

        selectionEventsService = TestBed.inject(SelectionEventsService);
        directive = new DrawingContainerDirective(selectionEventsService);
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
