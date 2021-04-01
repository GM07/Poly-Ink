import { HttpClientModule } from '@angular/common/http';
import { Component, NgZone } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { LineSettings } from '@app/classes/tool_ui_settings/line-settings';
import { NewDrawing } from '@app/classes/tool_ui_settings/new-drawing-settings';
import { LineToolConstants, NewDrawingConstants, PencilToolConstants } from '@app/classes/tool_ui_settings/tools.constants';
import { CanvasResizeComponent } from '@app/components/canvas-resize/canvas-resize.component';
import { EditorComponent } from '@app/components/editor/editor.component';
import { HomePageComponent } from '@app/components/home-page/home-page.component';
import { SidebarComponent } from '@app/components/sidebar/sidebar.component';
import { LineService } from '@app/services/tools/line.service';
import { PencilService } from '@app/services/tools/pencil.service';
import { ToolHandlerService } from '@app/services/tools/tool-handler.service';

@Component({ selector: 'app-settings-handler', template: '' })
class StubSettingsHandlerComponent {}

// tslint:disable:no-string-literal
describe('SidebarComponent', () => {
    let component: SidebarComponent;
    let fixture: ComponentFixture<SidebarComponent>;
    let pencilServiceSpy: jasmine.SpyObj<PencilService>;
    let lineServiceSpy: jasmine.SpyObj<LineService>;
    let toolHandlerService: ToolHandlerService;
    let router: Router;
    let zone: NgZone;

    beforeEach(async(() => {
        const pencilSpy = jasmine.createSpyObj('PencilService', ['stopDrawing'], { toolID: PencilToolConstants.TOOL_ID });
        const lineSpy = jasmine.createSpyObj('LineService', ['stopDrawing'], { toolID: LineToolConstants.TOOL_ID });

        TestBed.configureTestingModule({
            declarations: [CanvasResizeComponent, SidebarComponent, MatIcon, StubSettingsHandlerComponent],
            imports: [
                RouterTestingModule.withRoutes([
                    { path: 'home', component: HomePageComponent },
                    { path: 'editor', component: EditorComponent },
                ]),
                HttpClientModule,
                NoopAnimationsModule,
                MatTooltipModule,
                MatListModule,
                MatIconModule,
                MatIconTestingModule,
                MatSidenavModule,
            ],
            providers: [{ provide: PencilService, useValue: pencilSpy }, { provide: LineService, useValue: lineSpy }, ToolHandlerService],
        }).compileComponents();
    }));

    beforeEach(() => {
        toolHandlerService = TestBed.inject(ToolHandlerService);

        pencilServiceSpy = TestBed.inject(PencilService) as jasmine.SpyObj<PencilService>;
        lineServiceSpy = TestBed.inject(LineService) as jasmine.SpyObj<LineService>;
        fixture = TestBed.createComponent(SidebarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        router = TestBed.inject(Router);
        zone = TestBed.inject(NgZone);
        zone.run(() => {
            router.initialNavigation();
        });
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should change the current tool in toolHandlerService when a tool button is clicked', () => {
        pencilServiceSpy.stopDrawing.and.returnValue();
        lineServiceSpy.stopDrawing.and.returnValue();

        // Default Tool should be Pencil
        expect(toolHandlerService.getCurrentTool().toolID).toEqual(PencilToolConstants.TOOL_ID);
        component.toolIconClicked(new LineSettings());
        expect(toolHandlerService.getCurrentTool().toolID).toEqual(LineToolConstants.TOOL_ID);
    });

    it('should go back to menu', () => {
        const resetSpy = spyOn(component['undoRedoService'], 'reset');
        const funct = spyOn(router, 'navigateByUrl');
        component.backToMenu();
        expect(funct).toHaveBeenCalledWith('home');
        expect(resetSpy).toHaveBeenCalled();
    });

    it('should emit event when newDrawing is clicked', () => {
        spyOn(component.settingClicked, 'emit');
        component.emitClickEvent(new NewDrawing());
        expect(component.settingClicked.emit).toHaveBeenCalled();
        expect(component.settingClicked.emit).toHaveBeenCalledWith(NewDrawingConstants.TOOL_ID);
    });

    it('should init the undo Icon subscription', () => {
        component['undoRedoService'].BLOCK_UNDO_ICON.next(true);
        component['undoRedoService'].BLOCK_UNDO_ICON.next(true);
        expect(component.blockUndoIcon).toBeTruthy();
        component['undoRedoService'].BLOCK_UNDO_ICON.next(false);
        expect(component.blockUndoIcon).toBeFalsy();
    });

    it('should init the redo Icon subscription', () => {
        component['undoRedoService'].BLOCK_REDO_ICON.next(true);
        component['undoRedoService'].BLOCK_REDO_ICON.next(true);
        expect(component.blockRedoIcon).toBeTruthy();
        component['undoRedoService'].BLOCK_REDO_ICON.next(false);
        expect(component.blockRedoIcon).toBeFalsy();
    });

    it('should block the undo redo icons depending on the undoRedoService state', () => {
        component['undoRedoService'].blockUndoRedo = false;
        component['undoRedoService'].currentAction = 0;
        component['undoRedoService'].commands = [];
        component['initUndoRedoService']();
        expect(component.blockUndoIcon).toBeFalsy();
        expect(component.blockRedoIcon).toBeTruthy();
    });
});
