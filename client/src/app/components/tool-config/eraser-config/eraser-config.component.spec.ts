import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { EraserConfigComponent } from './eraser-config.component';

describe('EraserConfigComponent', () => {
    let component: EraserConfigComponent;
    let fixture: ComponentFixture<EraserConfigComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [EraserConfigComponent],
            imports: [MatDividerModule, MatSliderModule, NoopAnimationsModule, FormsModule, MatInputModule]
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
