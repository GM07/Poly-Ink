import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatSliderChange } from '@angular/material/slider';

@Component({
    selector: 'app-value-slider',
    templateUrl: './value-slider.component.html',
    styleUrls: ['./value-slider.component.scss'],
})
export class ValueSliderComponent {
    @Input()
    step: number = 1;

    @Input()
    max: number = 100;

    @Input()
    min: number = 0;

    @Input()
    value: number = 0;

    @Input()
    label: string;

    @Output()
    valueChangeEvent: EventEmitter<[string, number]> = new EventEmitter<[string, number]>();

    constructor() {}

    emitValue(): void {
        this.valueChangeEvent.emit([this.label, this.value]);
    }

    onSliderChange(event: MatSliderChange): void {
        this.value = event.value as number;
        this.emitValue();
    }

    onInputChange(value: number): void {
        if (value < this.min) this.value = this.min;
        else if (value > this.max) this.value = this.max;
        else this.value = value;

        this.emitValue();
    }
}
