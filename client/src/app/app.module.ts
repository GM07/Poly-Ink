import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/app/app.component';
import { DrawingComponent } from './components/drawing/drawing.component';
import { EditorComponent } from './components/editor/editor.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { MainMenuComponent } from './components/main-menu/main-menu.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';

@NgModule({
    declarations: [AppComponent, EditorComponent, SidebarComponent, DrawingComponent, MainMenuComponent, HomePageComponent],
    imports: [BrowserModule, HttpClientModule, AppRoutingModule, BrowserAnimationsModule, MatButtonModule, MatExpansionModule, MatIconModule],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
