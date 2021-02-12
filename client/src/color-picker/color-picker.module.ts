import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { ValueInputModule } from 'src/value-input/value-input.module';
import { ColorIconComponent } from './components/color-icon/color-icon.component';
import { ColorPaletteComponent } from './components/color-palette/color-palette.component';
import { ColorPickerComponent } from './components/color-picker/color-picker.component';
import { ColorPreviewComponent } from './components/color-preview/color-preview.component';
import { ColorSliderComponent } from './components/color-slider/color-slider.component';
import { ColorTextboxComponent } from './components/color-textbox/color-textbox.component';
import { PreviousColorsComponent } from './components/previous-colors/previous-colors.component';
@NgModule({
    imports: [CommonModule, MatIconModule, ValueInputModule, MatButtonModule, MatMenuModule, FormsModule, MatDividerModule],
    declarations: [
        ColorPickerComponent,
        ColorPaletteComponent,
        ColorSliderComponent,
        ColorIconComponent,
        ColorPreviewComponent,
        ColorTextboxComponent,
        PreviousColorsComponent,
    ],
    exports: [ColorIconComponent],
})
export class ColorPickerModule {}
