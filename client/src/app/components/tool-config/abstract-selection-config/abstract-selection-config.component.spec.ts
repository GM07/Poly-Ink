import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AbstractSelectionService } from '@app/services/tools/abstract-selection.service';
import { AbstractSelectionConfigComponent } from './abstract-selection-config.component';

describe('AbstractSelectionConfigComponent', () => {
    let component: AbstractSelectionConfigComponent;
    let fixture: ComponentFixture<AbstractSelectionConfigComponent>;
    let buttonToggleLabelElements: HTMLLabelElement[];
    let selectionComponentSpy: jasmine.SpyObj<AbstractSelectionService>;

    beforeEach(async(() => {
        selectionComponentSpy = jasmine.createSpyObj('AbstractSelectionService', ['selectAll']);
        TestBed.configureTestingModule({
            declarations: [AbstractSelectionConfigComponent],
            providers: [{ provide: AbstractSelectionService, useValue: selectionComponentSpy }],
            imports: [NoopAnimationsModule],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AbstractSelectionConfigComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        buttonToggleLabelElements = fixture.debugElement.queryAll(By.css('button')).map((debugEl) => debugEl.nativeElement);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should select all', () => {
        buttonToggleLabelElements[0].click(); // Tout selectionner
        expect(selectionComponentSpy.selectAll).toHaveBeenCalled();
        selectionComponentSpy.selectAll.calls.reset();
        component.selectAll();
        expect(selectionComponentSpy.selectAll).toHaveBeenCalled();
    });
});
