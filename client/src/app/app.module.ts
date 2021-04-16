import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StampConfigComponent } from '@app/components/tool-config/stamp-config/stamp-config.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/app/app.component';
import { NewDrawingComponent } from './components/canvas-reset/canvas-reset.component';
import { CanvasResizeComponent } from './components/canvas-resize/canvas-resize.component';
import { CarrouselComponent } from './components/carrousel/carrousel.component';
import { ColorIconComponent } from './components/color-picker/color-icon/color-icon.component';
import { ColorPaletteComponent } from './components/color-picker/color-palette/color-palette.component';
import { ColorPickerComponent } from './components/color-picker/color-picker/color-picker.component';
import { ColorPreviewComponent } from './components/color-picker/color-preview/color-preview.component';
import { ColorSliderComponent } from './components/color-picker/color-slider/color-slider.component';
import { ColorTextboxComponent } from './components/color-picker/color-textbox/color-textbox.component';
import { PreviousColorsComponent } from './components/color-picker/previous-colors/previous-colors.component';
import { DrawingTagsComponent } from './components/drawing-tags/drawing-tags.component';
import { DrawingComponent } from './components/drawing/drawing.component';
import { EditorComponent } from './components/editor/editor.component';
import { ExportDrawingComponent } from './components/export-drawing/export-drawing.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { MagnetismComponent } from './components/magnetism/magnetism.component';
import { SaveDrawingComponent } from './components/save-drawing/save-drawing.component';
import { AbstractSelectionComponent } from './components/selection/abstract-selection/abstract-selection.component';
import { EllipseSelectionComponent } from './components/selection/ellipse-selection/ellipse-selection.component';
import { LassoSelectionComponent } from './components/selection/lasso-selection/lasso-selection.component';
import { RectangleSelectionComponent } from './components/selection/rectangle-selection/rectangle-selection.component';
import { SelectionHandlerComponent } from './components/selection/selection-handler/selection-handler.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { TextComponent } from './components/text/text.component';
import { AbstractSelectionConfigComponent } from './components/tool-config/abstract-selection-config/abstract-selection-config.component';
import { AerosolConfigComponent } from './components/tool-config/aerosol-config/aerosol-config.component';
import { BucketConfigComponent } from './components/tool-config/bucket-config/bucket-config.component';
import { EllipseConfigComponent } from './components/tool-config/ellipse-config/ellipse-config.component';
import { EllipseSelectionConfigComponent } from './components/tool-config/ellipse-selection-config/ellipse-selection-config.component';
import { EraserConfigComponent } from './components/tool-config/eraser-config/eraser-config.component';
import { EyeDropperConfigComponent } from './components/tool-config/eye-dropper-config/eye-dropper-config.component';
import { GridConfigComponent } from './components/tool-config/grid-config/grid-config.component';
import { LassoSelectionConfigComponent } from './components/tool-config/lasso-selection-config/lasso-selection-config.component';
import { LineConfigComponent } from './components/tool-config/line-config/line-config.component';
import { PencilConfigComponent } from './components/tool-config/pencil-config/pencil-config.component';
import { PolygoneConfigComponent } from './components/tool-config/polygone-config/polygone-config.component';
import { RectangleConfigComponent } from './components/tool-config/rectangle-config/rectangle-config.component';
import { RectangleSelectionConfigComponent } from './components/tool-config/rectangle-selection-config/rectangle-selection-config.component';
import { SettingsHandlerComponent } from './components/tool-config/settings-handler/settings-handler.component';
import { TextConfigComponent } from './components/tool-config/text-config/text-config.component';
import { HexTextboxComponent } from './components/value-input/hex-textbox/hex-textbox.component';
import { ValueSliderComponent } from './components/value-input/value-slider/value-slider.component';
import { SidebarDirective } from './directives/sidebar.directive';

@NgModule({
    declarations: [
        AppComponent,
        EditorComponent,
        SidebarComponent,
        DrawingComponent,
        HomePageComponent,
        CanvasResizeComponent,
        NewDrawingComponent,
        RectangleConfigComponent,
        EllipseConfigComponent,
        EraserConfigComponent,
        LineConfigComponent,
        PencilConfigComponent,
        EyeDropperConfigComponent,
        SettingsHandlerComponent,
        CanvasResizeComponent,
        SidebarComponent,
        ExportDrawingComponent,
        PolygoneConfigComponent,
        RectangleSelectionConfigComponent,
        EllipseSelectionConfigComponent,
        AbstractSelectionConfigComponent,
        AbstractSelectionComponent,
        RectangleSelectionComponent,
        EllipseSelectionComponent,
        SelectionHandlerComponent,
        AerosolConfigComponent,
        DrawingTagsComponent,
        CarrouselComponent,
        SaveDrawingComponent,
        SidebarDirective,
        StampConfigComponent,
        BucketConfigComponent,
        LassoSelectionComponent,
        GridConfigComponent,
        MagnetismComponent,
        LassoSelectionConfigComponent,
        TextComponent,
        TextConfigComponent,
        ColorIconComponent,
        ColorPickerComponent,
        ColorPaletteComponent,
        ColorPreviewComponent,
        PreviousColorsComponent,
        HexTextboxComponent,
        ValueSliderComponent,
        ColorTextboxComponent,
        ColorSliderComponent,
    ],
    imports: [
        AppRoutingModule,
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        AppRoutingModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatIconModule,
        MatTooltipModule,
        MatSidenavModule,
        MatSlideToggleModule,
        MatListModule,
        MatInputModule,
        MatExpansionModule,
        MatChipsModule,
        MatDividerModule,
        MatSliderModule,
        MatIconModule,
        FormsModule,
        ReactiveFormsModule,
        MatChipsModule,
        MatFormFieldModule,
        MatProgressSpinnerModule,
        MatSelectModule,
        MatMenuModule,
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
