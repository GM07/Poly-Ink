import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MatDividerModule } from '@angular/material/divider';
import { Tool } from '@app/classes/tool';
import * as ToolsConstants from '@app/classes/tool_ui_settings/tools.constants';
import { LineConfigComponent } from '@app/components/tool-config/line-config/line-config.component';
import { PencilConfigComponent } from '@app/components/tool-config/pencil-config/pencil-config.component';
import { RectangleConfigComponent } from '@app/components/tool-config/rectangle-config/rectangle-config.component';
import { SettingsHandlerComponent } from '@app/components/tool-config/settings-handler/settings-handler.component';
import { AerosolService } from '@app/services/tools/aerosol.service';
import { EllipseSelectionService } from '@app/services/tools/ellipse-selection.service';
import { EllipseService } from '@app/services/tools/ellipse.service';
import { EraserService } from '@app/services/tools/eraser.service';
import { EyeDropperService } from '@app/services/tools/eye-dropper.service';
import { LineService } from '@app/services/tools/line.service';
import { PencilService } from '@app/services/tools/pencil.service';
import { PolygoneService } from '@app/services/tools/polygone.service';
import { RectangleSelectionService } from '@app/services/tools/rectangle-selection.service';
import { RectangleService } from '@app/services/tools/rectangle.service';
import { ToolHandlerService } from '@app/services/tools/tool-handler.service';
import { BucketService } from './../../../services/tools/bucket.service';

// tslint:disable:max-classes-per-file
class MockToolHandler extends ToolHandlerService {
    TOOLS_MOCK: Map<string, Tool> = new Map();
    currentToolStub: Tool;

    constructor(
        pencilService: PencilService,
        lineService: LineService,
        aerosolService: AerosolService,
        rectangleService: RectangleService,
        eraserService: EraserService,
        ellipseService: EllipseService,
        ellipseSelectionService: EllipseSelectionService,
        rectangleSelectionService: RectangleSelectionService,
        polygoneService: PolygoneService,
        eyeDropperService: EyeDropperService,
        bucketService: BucketService,
    ) {
        super(
            pencilService,
            lineService,
            aerosolService,
            rectangleService,
            ellipseService,
            rectangleSelectionService,
            ellipseSelectionService,
            eraserService,
            polygoneService,
            eyeDropperService,
            bucketService,
        );
        this.TOOLS_MOCK.set(ToolsConstants.PencilToolConstants.TOOL_ID, pencilService);
        this.TOOLS_MOCK.set(ToolsConstants.LineToolConstants.TOOL_ID, lineService);
        this.TOOLS_MOCK.set(ToolsConstants.RectangleToolConstants.TOOL_ID, rectangleService);
        this.TOOLS_MOCK.set(ToolsConstants.EllipseSelectionToolConstants.TOOL_ID, ellipseSelectionService);
        this.TOOLS_MOCK.set(ToolsConstants.PolygoneToolConstants.TOOL_ID, polygoneService);
        this.TOOLS_MOCK.set(ToolsConstants.AerosolToolConstants.TOOL_ID, aerosolService);
        this.TOOLS_MOCK.set(ToolsConstants.RectangleSelectionToolConstants.TOOL_ID, rectangleSelectionService);
        this.TOOLS_MOCK.set(ToolsConstants.EyeDropperToolConstants.TOOL_ID, eyeDropperService);
        this.TOOLS_MOCK.set(ToolsConstants.BucketToolConstants.TOOL_ID, bucketService);
        this.currentToolStub = this.TOOLS_MOCK.values().next().value;
    }

    getCurrentTool(): Tool {
        return this.currentToolStub;
    }

    setTool(toolId: string): boolean {
        const newCurrentTool: Tool | undefined = this.TOOLS_MOCK.get(toolId);

        if (newCurrentTool !== undefined && newCurrentTool !== this.currentToolStub) {
            this.currentToolStub = newCurrentTool;
            return true;
        } else {
            return false;
        }
    }
}

@Component({ selector: 'app-color-icon', template: '' })
class StubColorIconComponent {}
// tslint:enable:max-classes-per-file

describe('SettingsHandlerComponent', () => {
    let component: SettingsHandlerComponent;
    let pencilService: PencilService;
    let lineService: LineService;
    let aerosolService: AerosolService;
    let rectangleService: RectangleService;
    let eraserService: EraserService;
    let ellipseService: EllipseService;
    let polygoneService: PolygoneService;
    let ellipseSelectionService: EllipseSelectionService;
    let rectangleSelectionService: RectangleSelectionService;
    let eyeDropperService: EyeDropperService;
    let toolHandlerService: MockToolHandler;
    let bucketService: BucketService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [SettingsHandlerComponent, StubColorIconComponent],
            imports: [MatDividerModule],
        }).compileComponents();
        pencilService = TestBed.inject(PencilService);
        lineService = TestBed.inject(LineService);
        aerosolService = TestBed.inject(AerosolService);
        rectangleService = TestBed.inject(RectangleService);
        eraserService = TestBed.inject(EraserService);
        ellipseService = TestBed.inject(EllipseService);
        polygoneService = TestBed.inject(PolygoneService);
        ellipseSelectionService = TestBed.inject(EllipseSelectionService);
        rectangleSelectionService = TestBed.inject(RectangleSelectionService);
        eyeDropperService = TestBed.inject(EyeDropperService);
        bucketService = TestBed.inject(BucketService);

        toolHandlerService = new MockToolHandler(
            pencilService,
            lineService,
            aerosolService,
            rectangleService,
            eraserService,
            ellipseService,
            ellipseSelectionService,
            rectangleSelectionService,
            polygoneService,
            eyeDropperService,
            bucketService,
        );
        component = new SettingsHandlerComponent(toolHandlerService);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('lastTool should be of type Tool', () => {
        expect(component.lastTool).toBeInstanceOf(Tool);
    });

    it('lastTab should be a PencilConfigComponent as default', () => {
        expect(component.lastTab === PencilConfigComponent).toBeTruthy();
    });

    it('activeTab should be a the display of the current tool', () => {
        if (toolHandlerService.getCurrentTool() instanceof PencilService) expect(component.activeTab === PencilConfigComponent).toBeTruthy();
        if (toolHandlerService.getCurrentTool() instanceof LineService) expect(component.activeTab === LineConfigComponent).toBeTruthy();
    });

    it('should change the return value of activeTab for LineConfigComponent when setTool(LineService) is called', () => {
        toolHandlerService.setTool(ToolsConstants.LineToolConstants.TOOL_ID);
        expect(component.activeTab === LineConfigComponent).toBeTruthy();
    });

    it('should change the return value of activeTab for RectangleConfigComponent when setTool(RectangleService) is called', () => {
        toolHandlerService.setTool(ToolsConstants.RectangleToolConstants.TOOL_ID);
        expect(component.activeTab === RectangleConfigComponent).toBeTruthy();
    });
});
