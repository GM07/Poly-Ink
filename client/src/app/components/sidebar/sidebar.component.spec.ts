import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LineSettings } from '@app/classes/tool_settings/line-settings';
import { NewDrawing } from '@app/classes/tool_settings/new-drawing-settings';
import { LineToolConstants, NewDrawingConstants, PencilToolConstants } from '@app/classes/tool_settings/tools.constants';
import { SettingsHandlerComponent } from '@app/components/tool-config/settings-handler/settings-handler.component';
import { LineService } from '@app/services/tools/line-service';
import { PencilService } from '@app/services/tools/pencil-service';
import { ToolHandlerService } from '@app/services/tools/tool-handler-service';
import { SidebarComponent } from './sidebar.component';

describe('SidebarComponent', () => {
    let component: SidebarComponent;
    let fixture: ComponentFixture<SidebarComponent>;
    let pencilServiceSpy: jasmine.SpyObj<PencilService>;
    let lineServiceSpy: jasmine.SpyObj<LineService>;
    let toolHandlerService: ToolHandlerService;

    beforeEach(async(() => {
        const pencilSpy = jasmine.createSpyObj('PencilService', ['stopDrawing'], { toolID: PencilToolConstants.TOOL_ID });
        const lineSpy = jasmine.createSpyObj('LineService', ['stopDrawing'], { toolID: LineToolConstants.TOOL_ID });

        TestBed.configureTestingModule({
            declarations: [SidebarComponent, MatIcon, SettingsHandlerComponent],
            imports: [MatTooltipModule, MatListModule, MatIconModule, BrowserAnimationsModule, MatIconTestingModule, MatSidenavModule],
            providers: [{ provide: PencilService, useValue: pencilSpy }, { provide: LineService, useValue: lineSpy }, ToolHandlerService],
        }).compileComponents();
    }));

    beforeEach(() => {
        // Inject service to test
        toolHandlerService = TestBed.inject(ToolHandlerService);

        // Inject its spy dependecies
        pencilServiceSpy = TestBed.inject(PencilService) as jasmine.SpyObj<PencilService>;
        lineServiceSpy = TestBed.inject(LineService) as jasmine.SpyObj<LineService>;
        fixture = TestBed.createComponent(SidebarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should change the current tool in toolHandlerService when a tool button is clicked', () => {
        pencilServiceSpy.stopDrawing.and.returnValue();
        lineServiceSpy.stopDrawing.and.returnValue();

        // Default Tool should be Pencil
        expect(toolHandlerService.currentTool.toolID).toEqual(PencilToolConstants.TOOL_ID);
        component.toolIconClicked(new LineSettings());
        expect(toolHandlerService.currentTool.toolID).toEqual(LineToolConstants.TOOL_ID);
    });

    it('should emit event when newDrawing is clicked', () => {
        spyOn(component.settingClicked, 'emit');
        component.emitClickEvent(new NewDrawing());
        expect(component.settingClicked.emit).toHaveBeenCalled();
        expect(component.settingClicked.emit).toHaveBeenCalledWith(NewDrawingConstants.TOOL_ID);
    });
});
