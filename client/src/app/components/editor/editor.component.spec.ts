import { Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { ExportFileToolConstants, NewDrawingConstants } from '@app/classes/tool_ui_settings/tools.constants';
import { NewDrawingComponent } from '@app/components/canvas-reset/canvas-reset.component';
import { CanvasResizeComponent } from '@app/components/canvas-resize/canvas-resize.component';
import { DrawingComponent } from '@app/components/drawing/drawing.component';
import { EditorComponent } from '@app/components/editor/editor.component';
import { ExportDrawingComponent } from '@app/components/export-drawing/export-drawing.component';
import { HomePageComponent } from '@app/components/home-page/home-page.component';
import { SelectionHandlerComponent } from '@app/components/selection/selection-handler/selection-handler.component';
import { ShortcutHandlerService } from '@app/services/shortcut/shortcut-handler.service';

@Component({ selector: 'app-sidebar', template: '' })
class StubSidebarComponent {}

describe('EditorComponent', () => {
    let shortcutHandlerServiceSpy: jasmine.Spy<(event: KeyboardEvent) => void>;
    let component: EditorComponent;
    let fixture: ComponentFixture<EditorComponent>;
    let newDrawingComponent: jasmine.SpyObj<NewDrawingComponent>;
    let exportDrawingComponent: jasmine.SpyObj<ExportDrawingComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                HomePageComponent,
                EditorComponent,
                DrawingComponent,
                CanvasResizeComponent,
                StubSidebarComponent,
                NewDrawingComponent,
                ExportDrawingComponent,
                SelectionHandlerComponent,
            ],
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
        const shortCut = TestBed.inject(ShortcutHandlerService);
        shortcutHandlerServiceSpy = spyOn(shortCut, 'onKeyDown');
        newDrawingComponent = jasmine.createSpyObj('NewDrawingComponent', ['createNewDrawing']);
        exportDrawingComponent = jasmine.createSpyObj('ExportDrawingComponent', ['show']);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('should create a new drawing when calling reset drawing', () => {
        component.newDrawingMenu = newDrawingComponent;
        component.receiveSidebarButtonEvent(NewDrawingConstants.TOOL_ID);
        expect(newDrawingComponent.createNewDrawing).toHaveBeenCalled();
    });

    it('should create a new drawing when calling reset drawing', () => {
        component.exportDrawing = exportDrawingComponent;
        component.receiveSidebarButtonEvent(ExportFileToolConstants.TOOL_ID);
        expect(exportDrawingComponent.show).toHaveBeenCalled();
    });

    it('should not create a new drawing when calling with invalid argument', () => {
        component.newDrawingMenu = newDrawingComponent;
        component.receiveSidebarButtonEvent('InvalidArgument');
        expect(newDrawingComponent.createNewDrawing).not.toHaveBeenCalled();
    });

    it('Transfer KeyDown events to the handler', () => {
        component.onKeyDown({} as KeyboardEvent);
        expect(shortcutHandlerServiceSpy).toHaveBeenCalled();
    });
});
