import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSliderModule } from '@angular/material/slider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/app/app.component';
import { CanvasResizeComponent } from './components/canvas-resize/canvas-resize.component';
import { DrawingComponent } from './components/drawing/drawing.component';
import { EditorComponent } from './components/editor/editor.component';
import { EraserConfigComponent } from './components/eraser-config/eraser-config.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { LaunchToolConfigComponent } from './components/launch-tool-config/launch-tool-config.component';
import { MainMenuComponent } from './components/main-menu/main-menu.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { DiameterJunctionPointComponent } from './components/tool-config/diameter-junction-point/diameter-junction-point.component';
import { EllipseConfigComponent } from './components/tool-config/ellipse-config/ellipse-config.component';
import { JunctionTypeComponent } from './components/tool-config/junction-type/junction-type.component';
import { LineConfigComponent } from './components/tool-config/line-config/line-config.component';
import { RectangleConfigComponent } from './components/tool-config/rectangle-config/rectangle-config.component';
import { ThicknessComponent } from './components/tool-config/thickness/thickness.component';
import { ToolConfigComponent } from './components/tool-config/tool-config.component';
import { TraceTypeComponent } from './components/tool-config/trace-type/trace-type.component';
@NgModule({
    declarations: [AppComponent, EditorComponent, SidebarComponent, DrawingComponent, HomePageComponent, MainMenuComponent, CanvasResizeComponent, ToolConfigComponent,
        LaunchToolConfigComponent,
        RectangleConfigComponent,
        EllipseConfigComponent,
        EraserConfigComponent,
        LineConfigComponent,
        TraceTypeComponent,
        JunctionTypeComponent,
        DiameterJunctionPointComponent,
        ThicknessComponent],
    imports: [
        AppRoutingModule,
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        AppRoutingModule,
        MatButtonModule,
        MatIconModule,
        MatTooltipModule,
        MatSidenavModule,
        MatListModule,
        MatExpansionModule,
        MatDividerModule,
        MatSliderModule,
        MatDialogModule,
        MatInputModule,
        FormsModule,
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
