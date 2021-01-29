import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LaunchToolConfigComponent } from './launch-tool-config.component';

describe('LaunchToolConfigComponent', () => {
    let component: LaunchToolConfigComponent;
    let fixture: ComponentFixture<LaunchToolConfigComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [LaunchToolConfigComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LaunchToolConfigComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
