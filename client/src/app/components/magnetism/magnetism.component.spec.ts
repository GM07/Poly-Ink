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
        component.setSelected(MagnetismSelection.topLeft);
        expect(component.topLeft.nativeElement.style.background).toEqual('gray');
        expect(component.topRight.nativeElement.style.background).toEqual('white');
    });

    it('setSelected should toggle top correctly', () => {
        component.setSelected(MagnetismSelection.top);
        expect(component.top.nativeElement.style.background).toEqual('gray');
        expect(component.topLeft.nativeElement.style.background).toEqual('white');
    });

    it('setSelected should toggle topRight correctly', () => {
        component.setSelected(MagnetismSelection.topRight);
        expect(component.topRight.nativeElement.style.background).toEqual('gray');
        expect(component.topLeft.nativeElement.style.background).toEqual('white');
    });

    it('setSelected should toggle left correctly', () => {
        component.setSelected(MagnetismSelection.left);
        expect(component.left.nativeElement.style.background).toEqual('gray');
        expect(component.topLeft.nativeElement.style.background).toEqual('white');
    });

    it('setSelected should toggle center correctly', () => {
        component.setSelected(MagnetismSelection.center);
        expect(component.center.nativeElement.style.background).toEqual('gray');
        expect(component.topLeft.nativeElement.style.background).toEqual('white');
    });

    it('setSelected should toggle right correctly', () => {
        component.setSelected(MagnetismSelection.right);
        expect(component.right.nativeElement.style.background).toEqual('gray');
        expect(component.topLeft.nativeElement.style.background).toEqual('white');
    });

    it('setSelected should toggle bottomLeft correctly', () => {
        component.setSelected(MagnetismSelection.bottomLeft);
        expect(component.bottomLeft.nativeElement.style.background).toEqual('gray');
        expect(component.topLeft.nativeElement.style.background).toEqual('white');
    });

    it('setSelected should toggle bottom correctly', () => {
        component.setSelected(MagnetismSelection.bottom);
        expect(component.bottom.nativeElement.style.background).toEqual('gray');
        expect(component.topLeft.nativeElement.style.background).toEqual('white');
    });

    it('setSelected should toggle bottomRight correctly', () => {
        component.setSelected(MagnetismSelection.bottomRight);
        expect(component.bottomRight.nativeElement.style.background).toEqual('gray');
        expect(component.topLeft.nativeElement.style.background).toEqual('white');
    });
});
