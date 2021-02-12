import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSliderChange } from '@angular/material/slider';
import { ValueSliderComponent } from './value-slider.component';

describe('ValueSliderComponent', () => {
    let component: ValueSliderComponent;
    let fixture: ComponentFixture<ValueSliderComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            schemas: [NO_ERRORS_SCHEMA],
            declarations: [ValueSliderComponent],
        });
        fixture = TestBed.createComponent(ValueSliderComponent);
        component = fixture.componentInstance;
    });

    it('can load instance', () => {
        expect(component).toBeTruthy();
    });

    it(`step has default value`, () => {
        expect(component.step).toEqual(1);
    });

    it(`max has default value`, () => {
        expect(component.max).toEqual(100);
    });

    it(`min has default value`, () => {
        expect(component.min).toEqual(0);
    });

    it(`value has default value`, () => {
        expect(component.value).toEqual(0);
    });

    it('should make proper call on slider change', () => {
        const matSliderChangeStub: MatSliderChange = <any>{};
        spyOn(component, 'emitValue').and.stub();
        component.onSliderChange(matSliderChangeStub);
        expect(component.emitValue).toHaveBeenCalled();
    });

    it('should emit value', () => {
        spyOn(component.valueChangeEvent, 'emit').and.stub();
        component.emitValue();
        expect(component.valueChangeEvent.emit).toHaveBeenCalled();
    });
});
