import { Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { NewDrawingConstants } from '@app/classes/tool_ui_settings/tools.constants';
import { NewDrawingComponent } from '@app/components/canvas-reset/canvas-reset.component';
import { CanvasResizeComponent } from '@app/components/canvas-resize/canvas-resize.component';
import { DrawingComponent } from '@app/components/drawing/drawing.component';
import { EditorComponent } from '@app/components/editor/editor.component';
import { HomePageComponent } from '@app/components/home-page/home-page.component';
import { SelectionHandlerComponent } from '@app/components/selection/selection-handler/selection-handler.component';
import { ShortcutHandlerService } from '@app/services/shortcut/shortcut-handler.service';

@Component({ selector: 'app-sidebar', template: '' })
class StubSidebarComponent {}

describe('EditorComponent', () => {
    let shortcutHandlerServiceSpy: jasmine.SpyObj<ShortcutHandlerService>;
    let component: EditorComponent;
    let fixture: ComponentFixture<EditorComponent>;
    let newDrawingComponent: jasmine.SpyObj<NewDrawingComponent>;

    beforeEach(async(() => {
        shortcutHandlerServiceSpy = jasmine.createSpyObj('ShortcutHandlerService', ['onKeyDown']);
        TestBed.configureTestingModule({
            declarations: [
                HomePageComponent,
                EditorComponent,
                DrawingComponent,
                CanvasResizeComponent,
                StubSidebarComponent,
                NewDrawingComponent,
                SelectionHandlerComponent,
            ],
            providers: [{ provide: ShortcutHandlerService, useValue: shortcutHandlerServiceSpy }],
            imports: [
                RouterTestingModule.withRoutes([
                    { path: 'home', component: HomePageComponent },
                    { path: 'editor', component: EditorComponent },
                ]),
                NoopAnimationsModule,
                MatIconModule,
            ],
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
    it('should create a new drawing when calling reset drawing', () => {
        component.newDrawingMenu = newDrawingComponent;
        component.resetDrawing(NewDrawingConstants.TOOL_ID);
        expect(newDrawingComponent.createNewDrawing).toHaveBeenCalled();
    });
    it('should not create a new drawing when calling with invalid argument', () => {
        component.newDrawingMenu = newDrawingComponent;
        component.resetDrawing('InvalidArgument');
        expect(newDrawingComponent.createNewDrawing).not.toHaveBeenCalled();
    });

    it('Transfer KeyDown events to the handler', () => {
        component.onKeyDown({} as KeyboardEvent);
        expect(shortcutHandlerServiceSpy.onKeyDown).toHaveBeenCalled();
    });
});
