import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LineSettings } from '@app/classes/tool_settings/index-top';
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
        const pencilSpy = jasmine.createSpyObj('PencilService', ['stopDrawing']);
        const lineSpy = jasmine.createSpyObj('LineService', ['stopDrawing']);

        TestBed.configureTestingModule({
            declarations: [SidebarComponent],
            imports: [MatTooltipModule, MatListModule, MatIconModule, BrowserAnimationsModule],
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

        // component.toolIconClicked(new PencilSettings());
        console.log(toolHandlerService.currentTool);
        expect(toolHandlerService.getTool()).toBeInstanceOf(PencilService);
        // component.toolIconClicked(new LineSettings());
        expect(toolHandlerService.getTool()).toBeInstanceOf(LineSettings);
    });
});
