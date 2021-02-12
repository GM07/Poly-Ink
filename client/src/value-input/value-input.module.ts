import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSliderModule } from '@angular/material/slider';
import { ValueSliderComponent } from 'src/value-input/components/value-slider/value-slider.component';
import { HexTextboxComponent } from './components/hex-textbox/hex-textbox.component';

@NgModule({
    imports: [CommonModule, MatSliderModule, FormsModule],
    declarations: [ValueSliderComponent, HexTextboxComponent],
    exports: [ValueSliderComponent, HexTextboxComponent],
})
export class ValueInputModule {}
