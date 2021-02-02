import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiameterJunctionPointComponent } from './diameter-junction-point.component';

describe('DiameterJunctionPointComponent', () => {
    let component: DiameterJunctionPointComponent;
    let fixture: ComponentFixture<DiameterJunctionPointComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DiameterJunctionPointComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DiameterJunctionPointComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
