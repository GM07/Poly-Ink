import { Component, Type } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { EllipseSelectionService } from '@app/services/tools/ellipse-selection.service';
import { RectangleSelectionService } from '@app/services/tools/rectangle-selection.service';
import { ToolHandlerService } from '@app/services/tools/tool-handler.service';
import { AbstractSelectionComponent } from '../abstract-selection/abstract-selection.component';
import { EllipseSelectionComponent } from '../ellipse-selection/ellipse-selection.component';
import { RectangleSelectionComponent } from '../rectangle-selection/rectangle-selection.component';

@Component({
    selector: 'app-selection-handler',
    templateUrl: './selection-handler.component.html',
    styleUrls: ['./selection-handler.component.scss'],
})
export class SelectionHandlerComponent {
    settingsList: Map<typeof Tool, typeof AbstractSelectionComponent> = new Map();
    lastTab: Type<AbstractSelectionComponent> | undefined;
    lastTool: Tool;

    constructor(private toolHandler: ToolHandlerService) {
        this.applyNewTab();
        this.settingsList.set(RectangleSelectionService, RectangleSelectionComponent);
        this.settingsList.set(EllipseSelectionService, EllipseSelectionComponent);
    }

    get activeTab(): Type<AbstractSelectionComponent> | undefined {
        if (this.toolHandler.getTool() === this.lastTool) return this.lastTab;
        this.applyNewTab();
        return this.lastTab;
    }

    applyNewTab(): void {
        for (const [tool, selectionComponent] of this.settingsList) {
            if (this.toolHandler.getTool() instanceof tool) {
                this.lastTool = this.toolHandler.getTool();
                this.lastTab = selectionComponent;
                return;
            }
        }
        this.lastTool = this.toolHandler.getTool();
        this.lastTab = undefined;
    }
}
