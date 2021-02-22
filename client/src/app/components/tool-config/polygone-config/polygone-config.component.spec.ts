import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PolygoneConfigComponent } from './polygone-config.component';

describe('PolygoneConfigComponent', () => {
    let component: PolygoneConfigComponent;
    let fixture: ComponentFixture<PolygoneConfigComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PolygoneConfigComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PolygoneConfigComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
