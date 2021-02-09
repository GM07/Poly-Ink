import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSliderModule } from '@angular/material/slider';
import { HexTextboxComponent } from './hex-textbox/hex-textbox.component';
import { ValueSliderComponent } from './value-slider/value-slider.component';

@NgModule({
    imports: [CommonModule, MatSliderModule, FormsModule],
    declarations: [ValueSliderComponent, HexTextboxComponent],
    exports: [ValueSliderComponent, HexTextboxComponent],
})
export class ValueInputModule {}
