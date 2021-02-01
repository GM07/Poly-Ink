import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
<<<<<<< HEAD
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';
=======
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
>>>>>>> a69e6817a990a88b4336a4ffa3d85e0dffa38255
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/app/app.component';
import { DrawingComponent } from './components/drawing/drawing.component';
import { EditorComponent } from './components/editor/editor.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { LaunchToolConfigComponent } from './components/launch-tool-config/launch-tool-config.component';
import { MainMenuComponent } from './components/main-menu/main-menu.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { CrayonConfigComponent } from './components/tool-config/crayon-config/crayon-config.component';
import { EllipseConfigComponent } from './components/tool-config/ellipse-config/ellipse-config.component';
import { EraserConfigComponent } from './components/tool-config/eraser-config/eraser-config.component';
import { LineConfigComponent } from './components/tool-config/line-config/line-config.component';
import { RectangleConfigComponent } from './components/tool-config/rectangle-config/rectangle-config.component';
import { ToolConfigComponent } from './components/tool-config/tool-config.component';

@NgModule({
<<<<<<< HEAD
    declarations: [
        AppComponent,
        EditorComponent,
        SidebarComponent,
        DrawingComponent,
        MainMenuComponent,
        HomePageComponent,
        ToolConfigComponent,
        LaunchToolConfigComponent,
        RectangleConfigComponent,
        CrayonConfigComponent,
        EllipseConfigComponent,
        EraserConfigComponent,
        LineConfigComponent,
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MatButtonModule,
        MatExpansionModule,
        MatIconModule,
        MatDividerModule,
        MatSliderModule,
        MatDialogModule,
        BrowserAnimationsModule,
        MatInputModule,
        FormsModule,
=======
    declarations: [AppComponent, EditorComponent, SidebarComponent, DrawingComponent, HomePageComponent, MainMenuComponent],
    imports: [
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
>>>>>>> a69e6817a990a88b4336a4ffa3d85e0dffa38255
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
