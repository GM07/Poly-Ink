import { Component, Type } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { EllipseSelectionToolConstants, RectangleSelectionToolConstants } from '@app/classes/tool_ui_settings/tools.constants';
import { AbstractSelectionComponent } from '@app/components/selection/abstract-selection/abstract-selection.component';
import { EllipseSelectionComponent } from '@app/components/selection/ellipse-selection/ellipse-selection.component';
import { RectangleSelectionComponent } from '@app/components/selection/rectangle-selection/rectangle-selection.component';
import { ToolHandlerService } from '@app/services/tools/tool-handler.service';

@Component({
    selector: 'app-selection-handler',
    templateUrl: './selection-handler.component.html',
    styleUrls: ['./selection-handler.component.scss'],
})
export class SelectionHandlerComponent {
    settingsList: Map<string, typeof AbstractSelectionComponent> = new Map();
    lastTab: Type<AbstractSelectionComponent> | undefined;
    lastTool: Tool;

    constructor(private toolHandler: ToolHandlerService) {
        this.applyNewTab();
        this.settingsList.set(RectangleSelectionToolConstants.TOOL_ID, RectangleSelectionComponent);
        this.settingsList.set(EllipseSelectionToolConstants.TOOL_ID, EllipseSelectionComponent);
    }

    get activeTab(): Type<AbstractSelectionComponent> | undefined {
        if (this.toolHandler.getCurrentTool() === this.lastTool) return this.lastTab;
        this.applyNewTab();
        return this.lastTab;
    }

    private applyNewTab(): void {
        for (const [toolID, selectionComponent] of this.settingsList) {
            if (this.toolHandler.getCurrentTool().toolID === toolID) {
                this.lastTool = this.toolHandler.getCurrentTool();
                this.lastTab = selectionComponent;
                return;
            }
        }
        this.lastTool = this.toolHandler.getCurrentTool();
        this.lastTab = undefined;
    }
}
