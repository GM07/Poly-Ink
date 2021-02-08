import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatSliderModule } from '@angular/material/slider';
import { ValueSliderComponent } from './value-slider/value-slider.component';

@NgModule({
    imports: [CommonModule, MatSliderModule],
    declarations: [ValueSliderComponent],
    exports: [ValueSliderComponent],
})
export class ValueInputModule {}
