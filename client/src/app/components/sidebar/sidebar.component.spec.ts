import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {MatIcon, MatIconModule} from '@angular/material/icon';
import {MatIconTestingModule} from '@angular/material/icon/testing';
import {MatListModule} from '@angular/material/list';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatTooltipModule} from '@angular/material/tooltip';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {LineSettings} from '@app/classes/tool_settings/line-settings';
import {LineToolConstants, PencilToolConstants} from '@app/classes/tool_settings/tools.constants';
import {SettingsHandlerComponent} from '@app/components/tool-config/settings-handler/settings-handler.component';
import {LineService} from '@app/services/tools/line-service';
import {PencilService} from '@app/services/tools/pencil-service';
import {ToolHandlerService} from '@app/services/tools/tool-handler-service';
import {SidebarComponent} from './sidebar.component';

describe('SidebarComponent', () => {
    let component: SidebarComponent;
    let fixture: ComponentFixture < SidebarComponent >;
    let pencilServiceSpy: jasmine.SpyObj<PencilService>;
    let lineServiceSpy: jasmine.SpyObj<LineService>;
    let toolHandlerService: ToolHandlerService;

    beforeEach(async (() => {
        const pencilSpy = jasmine.createSpyObj('PencilService', ['stopDrawing'], {toolID: PencilToolConstants.TOOL_ID});
        const lineSpy = jasmine.createSpyObj('LineService', ['stopDrawing'], {toolID: LineToolConstants.TOOL_ID});

        TestBed.configureTestingModule({
            declarations: [
                SidebarComponent, MatIcon, SettingsHandlerComponent
            ],
            imports: [
                MatTooltipModule,
                MatListModule,
                MatIconModule,
                NoopAnimationsModule,
                MatIconTestingModule,
                MatSidenavModule
            ],
            providers: [
                {
                    provide: PencilService,
                    useValue: pencilSpy
                }, {
                    provide: LineService,
                    useValue: lineSpy
                },
                ToolHandlerService,
            ]
        }).compileComponents();
    }));

    beforeEach(() => { // Inject service to test
        toolHandlerService = TestBed.inject(ToolHandlerService);

        // Inject its spy dependecies
        pencilServiceSpy = TestBed.inject(PencilService)as jasmine.SpyObj<PencilService>;
        lineServiceSpy = TestBed.inject(LineService)as jasmine.SpyObj<LineService>;
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
});
