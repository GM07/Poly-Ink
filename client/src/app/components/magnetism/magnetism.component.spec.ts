import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatSliderModule } from '@angular/material/slider';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MagnetismSelection } from '@app/services/drawing/magnetism.service';

import { MagnetismComponent } from './magnetism.component';

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
        expect(component['topLeft'].nativeElement.style.background).toEqual('rgb(236, 86, 129)');
        expect(component['topRight'].nativeElement.style.background).toEqual('white');
    });

    it('setSelected should toggle top correctly', () => {
        component.setSelected(MagnetismSelection.Top);
        expect(component['top'].nativeElement.style.background).toEqual('rgb(236, 86, 129)');
        expect(component['topLeft'].nativeElement.style.background).toEqual('white');
    });

    it('setSelected should toggle topRight correctly', () => {
        component.setSelected(MagnetismSelection.TopRight);
        expect(component['topRight'].nativeElement.style.background).toEqual('rgb(236, 86, 129)');
        expect(component['topLeft'].nativeElement.style.background).toEqual('white');
    });

    it('setSelected should toggle left correctly', () => {
        component.setSelected(MagnetismSelection.Left);
        expect(component['left'].nativeElement.style.background).toEqual('rgb(236, 86, 129)');
        expect(component['topLeft'].nativeElement.style.background).toEqual('white');
    });

    it('setSelected should toggle center correctly', () => {
        component.setSelected(MagnetismSelection.Center);
        expect(component['center'].nativeElement.style.background).toEqual('rgb(236, 86, 129)');
        expect(component['topLeft'].nativeElement.style.background).toEqual('white');
    });

    it('setSelected should toggle right correctly', () => {
        component.setSelected(MagnetismSelection.Right);
        expect(component['right'].nativeElement.style.background).toEqual('rgb(236, 86, 129)');
        expect(component['topLeft'].nativeElement.style.background).toEqual('white');
    });

    it('setSelected should toggle bottomLeft correctly', () => {
        component.setSelected(MagnetismSelection.BottomLeft);
        expect(component['bottomLeft'].nativeElement.style.background).toEqual('rgb(236, 86, 129)');
        expect(component['topLeft'].nativeElement.style.background).toEqual('white');
    });

    it('setSelected should toggle bottom correctly', () => {
        component.setSelected(MagnetismSelection.Bottom);
        expect(component['bottom'].nativeElement.style.background).toEqual('rgb(236, 86, 129)');
        expect(component['topLeft'].nativeElement.style.background).toEqual('white');
    });

    it('setSelected should toggle bottomRight correctly', () => {
        component.setSelected(MagnetismSelection.BottomRight);
        expect(component['bottomRight'].nativeElement.style.background).toEqual('rgb(236, 86, 129)');
        expect(component['topLeft'].nativeElement.style.background).toEqual('white');
    });
});
