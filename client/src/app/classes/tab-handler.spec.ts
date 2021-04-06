import { TestBed } from '@angular/core/testing';
import { PencilConfigComponent } from '@app/components/tool-config/pencil-config/pencil-config.component';
import { RectangleConfigComponent } from '@app/components/tool-config/rectangle-config/rectangle-config.component';
import { PencilService } from '@app/services/tools/pencil.service';
import { RectangleSelectionService } from '@app/services/tools/rectangle-selection.service';
import { ToolHandlerService } from '@app/services/tools/tool-handler.service';
import { TabHandler } from './tab-handler';
import { ToolConfig } from './tool-config';
import { PencilToolConstants, RectangleSelectionToolConstants } from './tool_ui_settings/tools.constants';

// tslint:disable:no-any
describe('SelectionHandlerComponent', () => {
    let tabHandler: TabHandler<ToolConfig>;
    let toolHandlerService: ToolHandlerService;
    let pencilService: PencilService;
    let rectangleSelectionService: RectangleSelectionService;
    let getCurrentToolSpy: jasmine.Spy<any>;

    beforeEach(() => {
        pencilService = TestBed.inject(PencilService);
        rectangleSelectionService = TestBed.inject(RectangleSelectionService);
        toolHandlerService = TestBed.inject(ToolHandlerService);

        getCurrentToolSpy = spyOn<any>(toolHandlerService, 'getCurrentTool').and.returnValue(pencilService);

        tabHandler = new TabHandler<ToolConfig>(toolHandlerService);
        tabHandler.setTab(PencilToolConstants.TOOL_ID, PencilConfigComponent);
        tabHandler.setTab(RectangleSelectionToolConstants.TOOL_ID, RectangleConfigComponent);
    });

    it('should create', () => {
        expect(tabHandler).toBeTruthy();
    });

    it('return undefined if there are no match for the current tool', () => {
        tabHandler = new TabHandler<ToolConfig>(toolHandlerService);
        expect(tabHandler.activeTab).toBeUndefined();
    });

    it('should return the matching type for the current tool', () => {
        expect(tabHandler.activeTab === PencilConfigComponent).toBeTruthy();
        getCurrentToolSpy.and.returnValue(rectangleSelectionService);
        expect(tabHandler.activeTab === RectangleConfigComponent).toBeTruthy();
    });
});
