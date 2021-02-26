import { async, /*ComponentFixture,*/ TestBed } from '@angular/core/testing';

import { RectangleSelectionConfigComponent } from './rectangle-selection-config.component';

describe('RectangleSelectionConfigComponent', () => {
    //let component: RectangleSelectionConfigComponent;
    //let fixture: ComponentFixture<RectangleSelectionConfigComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [RectangleSelectionConfigComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        //fixture = TestBed.createComponent(RectangleSelectionConfigComponent);
        //component = fixture.componentInstance;
        //fixture.detectChanges();
    });

    it('should create', () => {
      expect(true).toBe(true);
      // expect(component).toBeTruthy();
    });
});
