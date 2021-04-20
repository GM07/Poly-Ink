import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AbstractSelectionService } from '@app/services/tools/abstract-selection.service';
import { AbstractSelectionConfigComponent } from './abstract-selection-config.component';

// tslint:disable:no-string-literal
// tslint:disable:no-any
describe('AbstractSelectionConfigComponent', () => {
    let component: AbstractSelectionConfigComponent;
    let fixture: ComponentFixture<AbstractSelectionConfigComponent>;
    let buttonToggleLabelElements: HTMLLabelElement[];
    let selectionService: AbstractSelectionService;
    let selectAllSpy: jasmine.Spy<any>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AbstractSelectionConfigComponent],
            imports: [NoopAnimationsModule],
        }).compileComponents();
    }));

    beforeEach(() => {
        selectionService = TestBed.inject(AbstractSelectionService);
        fixture = TestBed.createComponent(AbstractSelectionConfigComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        buttonToggleLabelElements = fixture.debugElement.queryAll(By.css('button')).map((debugEl) => debugEl.nativeElement);

        selectAllSpy = spyOn(selectionService, 'selectAll');

        const canvas = document.createElement('canvas');
        component['selectionService'].config.previewSelectionCtx = canvas.getContext('2d') as CanvasRenderingContext2D;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should select all', () => {
        buttonToggleLabelElements[0].click();
        expect(selectAllSpy).toHaveBeenCalled();
        selectAllSpy.calls.reset();
        component.selectAll();
        expect(selectAllSpy).toHaveBeenCalled();
    });

    it('should copy a selection', () => {
        const copySpy = spyOn(component['clipboardService'], 'copyDrawing');
        component.copySelection();
        expect(copySpy).toHaveBeenCalled();
    });

    it('should cut a selection', () => {
        const cutSpy = spyOn(component['clipboardService'], 'cutDrawing');
        component.cutSelection();
        expect(cutSpy).toHaveBeenCalled();
    });

    it('should delete a selection', () => {
        const deleteSpy = spyOn(component['clipboardService'], 'deleteDrawing');
        component.deleteSelection();
        expect(deleteSpy).toHaveBeenCalled();
    });
});
