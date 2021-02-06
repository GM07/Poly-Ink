import { TestBed } from '@angular/core/testing';
import { Tool } from '@app/classes/tool';
import { LineConfigComponent } from '@app/components/tool-config/line-config/line-config.component';
import { PencilConfigComponent } from '@app/components/tool-config/pencil-config/pencil-config.component';
import { RectangleConfigComponent } from '@app/components/tool-config/rectangle-config/rectangle-config.component';
import { LineService } from '@app/services/tools/line-service';
import { PencilService } from '@app/services/tools/pencil-service';
import { RectangleService } from '@app/services/tools/rectangle-service';
import { ToolHandlerService } from '@app/services/tools/tool-handler-service';
import { SettingsHandlerComponent } from './settings-handler.component';

class MockToolHandler extends ToolHandlerService {
    constructor(pencilService: PencilService, lineService: LineService, rectangleService: RectangleService) {
        super(pencilService, lineService, rectangleService);
    }

    getTool(): Tool {
        return this.currentTool;
    }

    setTool(toolClass: typeof Tool): boolean {
        for (const tool of this.TOOLS) {
            if (tool !== this.currentTool && tool instanceof toolClass) {
                this.currentTool = tool;
                return true;
            }
        }
        return false;
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
        toolHandlerService.setTool(LineService);
        expect(component.activeTab === LineConfigComponent).toBeTruthy();
    });

    it('should change the return value of activeTab for RectangleConfigComponent when setTool(RectangleService) is called', () => {
        toolHandlerService.setTool(RectangleService);
        expect(component.activeTab === RectangleConfigComponent).toBeTruthy();
    });
});
