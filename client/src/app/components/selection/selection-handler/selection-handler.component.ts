import { Component } from '@angular/core';
import { TabHandler } from '@app/classes/tab-handler';
import { EllipseSelectionToolConstants, LassoToolConstants, RectangleSelectionToolConstants } from '@app/classes/tool_ui_settings/tools.constants';
import { AbstractSelectionComponent } from '@app/components/selection/abstract-selection/abstract-selection.component';
import { EllipseSelectionComponent } from '@app/components/selection/ellipse-selection/ellipse-selection.component';
import { LassoSelectionComponent } from '@app/components/selection/lasso-selection/lasso-selection.component';
import { RectangleSelectionComponent } from '@app/components/selection/rectangle-selection/rectangle-selection.component';
import { ToolHandlerService } from '@app/services/tools/tool-handler.service';

@Component({
    selector: 'app-selection-handler',
    templateUrl: './selection-handler.component.html',
    styleUrls: ['./selection-handler.component.scss'],
})
export class SelectionHandlerComponent {
    readonly TAB_HANDLER: TabHandler<AbstractSelectionComponent>;

    constructor(toolHandler: ToolHandlerService) {
        this.TAB_HANDLER = new TabHandler<AbstractSelectionComponent>(toolHandler);
        this.TAB_HANDLER.setTab(RectangleSelectionToolConstants.TOOL_ID, RectangleSelectionComponent);
        this.TAB_HANDLER.setTab(EllipseSelectionToolConstants.TOOL_ID, EllipseSelectionComponent);
        this.TAB_HANDLER.setTab(LassoToolConstants.TOOL_ID, LassoSelectionComponent);
    }
}
