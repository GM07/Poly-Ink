import { Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NewDrawingConstants } from '@app/classes/tool_settings/tools.constants';
import { NewDrawingComponent } from '@app/components/canvas-reset/canvas-reset.component';
import { CanvasResizeComponent } from '@app/components/canvas-resize/canvas-resize.component';
import { DrawingComponent } from '@app/components/drawing/drawing.component';
import { SettingsHandlerComponent } from '@app/components/tool-config/settings-handler/settings-handler.component';
import { EditorComponent } from './editor.component';

@Component({ selector: 'app-sidebar', template: '' })
class StubSidebarComponent {}

describe('EditorComponent', () => {
    let component: EditorComponent;
    let fixture: ComponentFixture<EditorComponent>;
    let newDrawingComponent: jasmine.SpyObj<NewDrawingComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                EditorComponent,
                DrawingComponent,
                CanvasResizeComponent,
                StubSidebarComponent,
                SettingsHandlerComponent,
                NewDrawingComponent,
            ],
            imports: [NoopAnimationsModule],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EditorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        newDrawingComponent = jasmine.createSpyObj('NewDrawingComponent', ['createNewDrawing']);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it("should create a new drawing when clicking on 'nouveau dessin'", () => {
        component.newDrawingMenu = newDrawingComponent;
        component.resetDrawing(NewDrawingConstants.TOOL_ID);
        expect(newDrawingComponent.createNewDrawing).toHaveBeenCalled();
    });

    it('should not create a new drawing when calling with invalid argument', () => {
        component.newDrawingMenu = newDrawingComponent;
        component.resetDrawing('InvalidArgument');
        expect(newDrawingComponent.createNewDrawing).not.toHaveBeenCalled();
    });
});
