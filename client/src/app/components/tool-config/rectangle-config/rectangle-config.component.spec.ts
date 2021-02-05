import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatSliderModule } from '@angular/material/slider';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { RectangleConfigComponent } from './rectangle-config.component';

describe('RectangleConfigComponent', () => {
    let component: RectangleConfigComponent;
    let fixture: ComponentFixture<RectangleConfigComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [RectangleConfigComponent],
            imports: [MatDividerModule, MatButtonModule, MatSliderModule, FormsModule, MatInputModule, NoopAnimationsModule]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(RectangleConfigComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
