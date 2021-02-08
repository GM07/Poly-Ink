import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSliderChange } from '@angular/material/slider';
import { ValueSliderComponent } from './value-slider.component';

describe('ValueSliderComponent', () => {
    let component: ValueSliderComponent;
    let fixture: ComponentFixture<ValueSliderComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ValueSliderComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ValueSliderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should emit value', () => {
        const value = 1;
        const label = 'Test';
        spyOn(component.valueChangeEvent, 'emit');
        component.value = value;
        component.label = label;
        component.emitValue();
        expect(component.valueChangeEvent.emit).toHaveBeenCalledWith([label, value]);
    });

    it('should update value on slider change', () => {
        const sliderValue = 200;
        const sliderChange: MatSliderChange = new MatSliderChange();
        sliderChange.value = sliderValue;

        component.onSliderChange(sliderChange);
        expect(component.value).toEqual(sliderValue);
    });

    it('should emit value on slider change', () => {
        spyOn(component, 'emitValue');
        component.onSliderChange(new MatSliderChange());
        expect(component.emitValue).toHaveBeenCalled();
    });

    it('should emit value on input change', () => {
        spyOn(component, 'emitValue');
        component.onInputChange(1);
        expect(component.emitValue).toHaveBeenCalled();
    });

    it('should not allow input above max', () => {
        const toBig: number = component.max + 1;
        component.onInputChange(toBig);
        expect(component.value).toEqual(component.max);
    });

    it('should not allow input below min', () => {
        const toSmall: number = component.min - 1;
        component.onInputChange(toSmall);
        expect(component.value).toEqual(component.min);
    });

    it('should update value on input change', () => {
        const value = 20;
        component.onInputChange(value);
        expect(component.value).toEqual(component.value);
    });
});
