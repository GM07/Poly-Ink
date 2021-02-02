import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JunctionTypeComponent } from './junction-type.component';

describe('JunctionTypeComponent', () => {
    let component: JunctionTypeComponent;
    let fixture: ComponentFixture<JunctionTypeComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [JunctionTypeComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(JunctionTypeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
