import { Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CanvasResizeComponent } from '@app/components/canvas-resize/canvas-resize.component';
import { DrawingComponent } from '@app/components/drawing/drawing.component';
import { SettingsHandlerComponent } from '@app/components/tool-config/settings-handler/settings-handler.component';
import { EditorComponent } from './editor.component';

@Component({ selector: 'app-sidebar', template: '' })
class StubSidebarComponent {}

describe('EditorComponent', () => {
    let component: EditorComponent;
    let fixture: ComponentFixture<EditorComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [EditorComponent, DrawingComponent, CanvasResizeComponent, StubSidebarComponent, SettingsHandlerComponent],
            imports: [NoopAnimationsModule],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EditorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
