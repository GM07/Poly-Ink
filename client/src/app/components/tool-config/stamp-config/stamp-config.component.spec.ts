import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StampConfigComponent } from './stamp-config.component';

describe('StampConfigComponent', () => {
    let component: StampConfigComponent;
    let fixture: ComponentFixture<StampConfigComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [StampConfigComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(StampConfigComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
