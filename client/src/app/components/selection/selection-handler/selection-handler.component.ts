import { Component, Type } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { AbstractSelectionComponent } from '@app/components/selection/abstract-selection/abstract-selection.component';
import { EllipseSelectionComponent } from '@app/components/selection/ellipse-selection/ellipse-selection.component';
import { RectangleSelectionComponent } from '@app/components/selection/rectangle-selection/rectangle-selection.component';
import { EllipseSelectionService } from '@app/services/tools/ellipse-selection.service';
import { LassoService } from '@app/services/tools/lasso.service';
import { RectangleSelectionService } from '@app/services/tools/rectangle-selection.service';
import { ToolHandlerService } from '@app/services/tools/tool-handler.service';
import { LassoSelectionComponent } from '../lasso-selection/lasso-selection.component';

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
        this.settingsList.set(LassoService, LassoSelectionComponent);
    }

    get activeTab(): Type<AbstractSelectionComponent> | undefined {
        if (this.toolHandler.getCurrentTool() === this.lastTool) return this.lastTab;
        this.applyNewTab();
        return this.lastTab;
    }

    private applyNewTab(): void {
        for (const [tool, selectionComponent] of this.settingsList) {
            if (this.toolHandler.getCurrentTool() instanceof tool) {
                this.lastTool = this.toolHandler.getCurrentTool();
                this.lastTab = selectionComponent;
                return;
            }
        }
        this.lastTool = this.toolHandler.getCurrentTool();
        this.lastTab = undefined;
    }
}
