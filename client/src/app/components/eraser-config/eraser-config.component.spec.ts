import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EraserConfigComponent } from './eraser-config.component';

describe('EraserConfigComponent', () => {
    let component: EraserConfigComponent;
    let fixture: ComponentFixture<EraserConfigComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [EraserConfigComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EraserConfigComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
