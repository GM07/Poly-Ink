import { Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CanvasResizeComponent } from '@app/components/canvas-resize/canvas-resize.component';
import { DrawingComponent } from '@app/components/drawing/drawing.component';
import { EditorComponent } from '@app/components/editor/editor.component';

@Component({ selector: 'app-sidebar', template: '' })
class StubSidebarComponent {}

describe('EditorComponent', () => {
    let component: EditorComponent;
    let fixture: ComponentFixture<EditorComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DrawingComponent, CanvasResizeComponent, StubSidebarComponent],
            imports: [],
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
