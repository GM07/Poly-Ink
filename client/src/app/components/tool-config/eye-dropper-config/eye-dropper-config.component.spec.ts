import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatSliderModule } from '@angular/material/slider';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { EyeDropperConfigComponent } from './eye-dropper-config.component';

describe('PipetteConfigComponent', () => {
    let component: EyeDropperConfigComponent;
    let fixture: ComponentFixture<EyeDropperConfigComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [EyeDropperConfigComponent],
            imports: [MatDividerModule, MatSliderModule, FormsModule, NoopAnimationsModule],
        }).compileComponents();
        fixture = TestBed.createComponent(EyeDropperConfigComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
