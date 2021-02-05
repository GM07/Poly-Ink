import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { EllipseConfigComponent } from './ellipse-config.component';

describe('EllipseConfigComponent', () => {
    let component: EllipseConfigComponent;
    let fixture: ComponentFixture<EllipseConfigComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [EllipseConfigComponent],
            imports: [MatDividerModule, MatButtonModule, MatSliderModule, NoopAnimationsModule, MatInputModule, FormsModule]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EllipseConfigComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
