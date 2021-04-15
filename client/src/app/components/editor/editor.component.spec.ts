import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import {
    ExportFileToolConstants,
    NewDrawingConstants,
    RedoConstants,
    SaveFileToolConstants,
    UndoConstants,
} from '@app/classes/tool_ui_settings/tools.constants';
import { NewDrawingComponent } from '@app/components/canvas-reset/canvas-reset.component';
import { CanvasResizeComponent } from '@app/components/canvas-resize/canvas-resize.component';
import { DrawingComponent } from '@app/components/drawing/drawing.component';
import { EditorComponent } from '@app/components/editor/editor.component';
import { ExportDrawingComponent } from '@app/components/export-drawing/export-drawing.component';
import { HomePageComponent } from '@app/components/home-page/home-page.component';
import { SaveDrawingComponent } from '@app/components/save-drawing/save-drawing.component';
import { SelectionHandlerComponent } from '@app/components/selection/selection-handler/selection-handler.component';
import { ShortcutHandlerService } from '@app/services/shortcut/shortcut-handler.service';

// tslint:disable:no-string-literal
// tslint:disable:max-classes-per-file

@Component({ selector: 'app-sidebar', template: '' })
class StubSidebarComponent {}

@Component({ selector: 'app-carrousel', template: '' })
class StubCarrouselComponent {}

describe('EditorComponent', () => {
    let shortcutServiceSpy: jasmine.SpyObj<ShortcutHandlerService>;
    let component: EditorComponent;
    let fixture: ComponentFixture<EditorComponent>;
    let newDrawingComponent: jasmine.SpyObj<NewDrawingComponent>;
    let exportDrawingComponent: jasmine.SpyObj<ExportDrawingComponent>;
    let saveDrawingComponent: jasmine.SpyObj<SaveDrawingComponent>;

    beforeEach(async(() => {
        shortcutServiceSpy = jasmine.createSpyObj('ShortcutHandlerService', ['onKeyDown', 'onMouseMove', 'onMouseClick']);

        TestBed.configureTestingModule({
            declarations: [
                HomePageComponent,
                StubCarrouselComponent,
                EditorComponent,
                DrawingComponent,
                CanvasResizeComponent,
                StubSidebarComponent,
                NewDrawingComponent,
                ExportDrawingComponent,
                SaveDrawingComponent,
                SelectionHandlerComponent,
            ],
            imports: [
                RouterTestingModule.withRoutes([
                    { path: 'home', component: HomePageComponent },
                    { path: 'editor', component: EditorComponent },
                ]),
                NoopAnimationsModule,
                MatIconModule,
                HttpClientTestingModule,
            ],
            providers: [{ provide: ShortcutHandlerService, useValue: shortcutServiceSpy }],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EditorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        newDrawingComponent = jasmine.createSpyObj('NewDrawingComponent', ['createNewDrawing']);
        exportDrawingComponent = jasmine.createSpyObj('ExportDrawingComponent', ['show']);
        saveDrawingComponent = jasmine.createSpyObj('SaveDrawingComponent', ['show']);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('should create a new drawing when calling reset drawing', () => {
        component['newDrawingMenu'] = newDrawingComponent;
        component.receiveSidebarButtonEvent(NewDrawingConstants.TOOL_ID);
        expect(newDrawingComponent.createNewDrawing).toHaveBeenCalled();
    });

    it('should create a new drawing when calling reset drawing', () => {
        component['exportDrawing'] = exportDrawingComponent;
        component.receiveSidebarButtonEvent(ExportFileToolConstants.TOOL_ID);
        expect(exportDrawingComponent.show).toHaveBeenCalled();
    });

    it('should create a new drawing when calling reset drawing', () => {
        component['saveDrawing'] = saveDrawingComponent;
        component.receiveSidebarButtonEvent(SaveFileToolConstants.TOOL_ID);
        expect(saveDrawingComponent.show).toHaveBeenCalled();
    });

    it('should not create a new drawing when calling with invalid argument', () => {
        component['newDrawingMenu'] = newDrawingComponent;
        component.receiveSidebarButtonEvent('InvalidArgument');
        expect(newDrawingComponent.createNewDrawing).not.toHaveBeenCalled();
    });

    it('Transfer KeyDown events to the shortcut handler', () => {
        component.onKeyDown({} as KeyboardEvent);
        expect(shortcutServiceSpy.onKeyDown).toHaveBeenCalled();
    });

    it('Transfer mouse move events to the shortcut handler', () => {
        component.onMouseMove({} as MouseEvent);
        expect(shortcutServiceSpy.onMouseMove).toHaveBeenCalled();
    });

    it('Transfer mouse move events to the shortcut handler', () => {
        component.onMouseClick({} as MouseEvent);
        expect(shortcutServiceSpy.onMouseClick).toHaveBeenCalled();
    });

    it('should register the beginning of editor reloading in local storage', () => {
        spyOn(localStorage, 'setItem');
        component.onPageReload({} as BeforeUnloadEvent);
        expect(localStorage.setItem).toHaveBeenCalledWith('editor_reloading', 'true');
    });

    it('should call undo on button click', () => {
        spyOn(component['undoRedoService'], 'undo').and.stub();
        component.receiveSidebarButtonEvent(UndoConstants.TOOL_ID);
        expect(component['undoRedoService'].undo).toHaveBeenCalled();
    });

    it('should call redo on button click', () => {
        spyOn(component['undoRedoService'], 'redo').and.stub();
        component.receiveSidebarButtonEvent(RedoConstants.TOOL_ID);
        expect(component['undoRedoService'].redo).toHaveBeenCalled();
    });
});
