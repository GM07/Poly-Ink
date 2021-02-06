import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
// import { MatDialogModule } from '@angular/material/dialog';
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
import { HomePageComponent } from './components/home-page/home-page.component';
import { MainMenuComponent } from './components/main-menu/main-menu.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { EllipseConfigComponent } from './components/tool-config/ellipse-config/ellipse-config.component';
import { EraserConfigComponent } from './components/tool-config/eraser-config/eraser-config.component';
import { LineConfigComponent } from './components/tool-config/line-config/line-config.component';
import { PencilConfigComponent } from './components/tool-config/pencil-config/pencil-config.component';
import { RectangleConfigComponent } from './components/tool-config/rectangle-config/rectangle-config.component';
import { SettingsHandlerComponent } from './components/tool-config/settings-handler/settings-handler.component';

@NgModule({
    declarations: [
        AppComponent,
        EditorComponent,
        SidebarComponent,
        DrawingComponent,
        HomePageComponent,
        MainMenuComponent,
        CanvasResizeComponent,
        RectangleConfigComponent,
        EllipseConfigComponent,
        EraserConfigComponent,
        LineConfigComponent,
        PencilConfigComponent,
        SettingsHandlerComponent,
    ],
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
        MatCardModule,
        MatInputModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
