import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatSliderModule } from '@angular/material/slider';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MagnetismSelection } from '@app/services/drawing/magnetism.service';
import { MagnetismComponent } from './magnetism.component';

// tslint:disable:no-string-literal
describe('MagnetismComponent', () => {
    let component: MagnetismComponent;
    let fixture: ComponentFixture<MagnetismComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [MagnetismComponent],
            imports: [MatDividerModule, MatSliderModule, FormsModule, NoopAnimationsModule],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MagnetismComponent);
        component = fixture.componentInstance;
        component.magnetismService.isEnabled = true;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('setSelected should toggle topLeft correctly', () => {
        component.setSelected(MagnetismSelection.TopLeft);
        expect(component.magnetismService.selection).toEqual(MagnetismSelection.TopLeft);
    });

    it('getSelected should return selected', () => {
        component.magnetismService.selection = MagnetismSelection.TopRight;
        expect(component.isSelected(MagnetismSelection.TopRight)).toEqual({ 'background-color': '#ec5681' });
        expect(component.isSelected(MagnetismSelection.Right)).toEqual({ 'background-color': 'white' });
    });
});
