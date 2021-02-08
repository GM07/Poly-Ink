import { TestBed } from '@angular/core/testing';
import { Tool } from '@app/classes/tool';
import * as ToolsConstants from '@app/classes/tool_settings/tools.constants';
import { LineConfigComponent } from '@app/components/tool-config/line-config/line-config.component';
import { PencilConfigComponent } from '@app/components/tool-config/pencil-config/pencil-config.component';
import { RectangleConfigComponent } from '@app/components/tool-config/rectangle-config/rectangle-config.component';
import { LineService } from '@app/services/tools/line-service';
import { PencilService } from '@app/services/tools/pencil-service';
import { RectangleService } from '@app/services/tools/rectangle-service';
import { ToolHandlerService } from '@app/services/tools/tool-handler-service';
import { SettingsHandlerComponent } from './settings-handler.component';

class MockToolHandler extends ToolHandlerService {
    TOOLS_MOCK: Map<string, Tool> = new Map();

    constructor(pencilService: PencilService, lineService: LineService, rectangleService: RectangleService) {
        super(pencilService, lineService, rectangleService);
        this.TOOLS_MOCK.set(ToolsConstants.PencilToolConstants.TOOL_ID, pencilService);
        this.TOOLS_MOCK.set(ToolsConstants.LineToolConstants.TOOL_ID, lineService);
        this.TOOLS_MOCK.set(ToolsConstants.AerosolToolConstants.TOOL_ID, pencilService);
        this.TOOLS_MOCK.set(ToolsConstants.ColorToolConstants.TOOL_ID, pencilService);
        this.TOOLS_MOCK.set(ToolsConstants.EllipseSelectionToolConstants.TOOL_ID, pencilService);
        this.TOOLS_MOCK.set(ToolsConstants.EllipseToolConstants.TOOL_ID, pencilService);
        this.TOOLS_MOCK.set(ToolsConstants.EraserToolConstants.TOOL_ID, pencilService);
        this.TOOLS_MOCK.set(ToolsConstants.EyeDropperToolConstants.TOOL_ID, pencilService);
        this.TOOLS_MOCK.set(ToolsConstants.FillToolConstants.TOOL_ID, pencilService);
        this.TOOLS_MOCK.set(ToolsConstants.LassoToolConstants.TOOL_ID, pencilService);
        this.TOOLS_MOCK.set(ToolsConstants.PolygoneToolConstants.TOOL_ID, pencilService);
        this.TOOLS_MOCK.set(ToolsConstants.RectangleSelectionToolConstants.TOOL_ID, pencilService);
        this.TOOLS_MOCK.set(ToolsConstants.RectangleToolConstants.TOOL_ID, rectangleService);
        this.TOOLS_MOCK.set(ToolsConstants.StampToolConstants.TOOL_ID, pencilService);
        this.TOOLS_MOCK.set(ToolsConstants.TextToolConstants.TOOL_ID, pencilService);
        this.currentTool = this.TOOLS_MOCK.values().next().value;
    }

    getTool(): Tool {
        return this.currentTool;
    }

    setTool(toolId: string): boolean {
        const newCurrentTool: Tool | undefined = this.TOOLS_MOCK.get(toolId);

        if (newCurrentTool !== undefined && newCurrentTool !== this.currentTool) {
            this.currentTool = newCurrentTool;
            return true;
        } else {
            return false;
        }
    }
}

describe('SettingsHandlerComponent', () => {
    let component: SettingsHandlerComponent;
    let pencilService: PencilService;
    let lineService: LineService;
    let rectangleService: RectangleService;
    let toolHandlerService: MockToolHandler;

    beforeEach(() => {
        pencilService = TestBed.inject(PencilService);
        lineService = TestBed.inject(LineService);
        rectangleService = TestBed.inject(RectangleService);
        toolHandlerService = new MockToolHandler(pencilService, lineService, rectangleService);
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
        if (toolHandlerService.getTool() instanceof PencilService) expect(component.activeTab === PencilConfigComponent).toBeTruthy();
        if (toolHandlerService.getTool() instanceof LineService) expect(component.activeTab === LineConfigComponent).toBeTruthy();
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
