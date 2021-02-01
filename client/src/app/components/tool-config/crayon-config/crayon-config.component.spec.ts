import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrayonConfigComponent } from './crayon-config.component';

describe('CrayonConfigComponent', () => {
    let component: CrayonConfigComponent;
    let fixture: ComponentFixture<CrayonConfigComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CrayonConfigComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CrayonConfigComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
