import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { LassoSelectionConfigComponent } from './lasso-selection-config.component';

describe('LassoSelectionConfigComponent', () => {
    let component: LassoSelectionConfigComponent;
    let fixture: ComponentFixture<LassoSelectionConfigComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [LassoSelectionConfigComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LassoSelectionConfigComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
