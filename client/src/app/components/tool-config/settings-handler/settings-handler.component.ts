import { Component } from '@angular/core';
import { TabHandler } from '@app/classes/tab-handler';
import {
    AerosolToolConstants,
    BucketToolConstants,
    EllipseSelectionToolConstants,
    EllipseToolConstants,
    EraserToolConstants,
    EyeDropperToolConstants,
    LassoToolConstants,
    LineToolConstants,
    PencilToolConstants,
    PolygoneToolConstants,
    RectangleSelectionToolConstants,
    RectangleToolConstants,
    StampToolConstants,
} from '@app/classes/tool_ui_settings/tools.constants';
import { AerosolConfigComponent } from '@app/components/tool-config/aerosol-config/aerosol-config.component';
import { BucketConfigComponent } from '@app/components/tool-config/bucket-config/bucket-config.component';
import { EllipseConfigComponent } from '@app/components/tool-config/ellipse-config/ellipse-config.component';
import { EllipseSelectionConfigComponent } from '@app/components/tool-config/ellipse-selection-config/ellipse-selection-config.component';
import { EraserConfigComponent } from '@app/components/tool-config/eraser-config/eraser-config.component';
import { EyeDropperConfigComponent } from '@app/components/tool-config/eye-dropper-config/eye-dropper-config.component';
import { LassoSelectionConfigComponent } from '@app/components/tool-config/lasso-selection-config/lasso-selection-config.component';
import { LineConfigComponent } from '@app/components/tool-config/line-config/line-config.component';
import { PencilConfigComponent } from '@app/components/tool-config/pencil-config/pencil-config.component';
import { PolygoneConfigComponent } from '@app/components/tool-config/polygone-config/polygone-config.component';
import { RectangleConfigComponent } from '@app/components/tool-config/rectangle-config/rectangle-config.component';
import { RectangleSelectionConfigComponent } from '@app/components/tool-config/rectangle-selection-config/rectangle-selection-config.component';
import { StampConfigComponent } from '@app/components/tool-config/stamp-config/stamp-config.component';
import { ToolConfig } from '@app/components/tool-config/tool-config';
import { ToolHandlerService } from '@app/services/tools/tool-handler.service';

@Component({
    selector: 'app-settings-handler',
    templateUrl: './settings-handler.component.html',
    styleUrls: ['./settings-handler.component.scss'],
})
export class SettingsHandlerComponent {
    readonly TAB_HANDLER: TabHandler<ToolConfig>;

    constructor(toolHandler: ToolHandlerService) {
        this.TAB_HANDLER = new TabHandler<ToolConfig>(toolHandler);
        this.TAB_HANDLER.setTab(PencilToolConstants.TOOL_ID, PencilConfigComponent);
        this.TAB_HANDLER.setTab(EraserToolConstants.TOOL_ID, EraserConfigComponent);
        this.TAB_HANDLER.setTab(LineToolConstants.TOOL_ID, LineConfigComponent);
        this.TAB_HANDLER.setTab(RectangleToolConstants.TOOL_ID, RectangleConfigComponent);
        this.TAB_HANDLER.setTab(EllipseToolConstants.TOOL_ID, EllipseConfigComponent);
        this.TAB_HANDLER.setTab(PolygoneToolConstants.TOOL_ID, PolygoneConfigComponent);
        this.TAB_HANDLER.setTab(AerosolToolConstants.TOOL_ID, AerosolConfigComponent);
        this.TAB_HANDLER.setTab(EyeDropperToolConstants.TOOL_ID, EyeDropperConfigComponent);
        this.TAB_HANDLER.setTab(StampToolConstants.TOOL_ID, StampConfigComponent);
        this.TAB_HANDLER.setTab(BucketToolConstants.TOOL_ID, BucketConfigComponent);
        this.TAB_HANDLER.setTab(RectangleSelectionToolConstants.TOOL_ID, RectangleSelectionConfigComponent);
        this.TAB_HANDLER.setTab(EllipseSelectionToolConstants.TOOL_ID, EllipseSelectionConfigComponent);
        this.TAB_HANDLER.setTab(LassoToolConstants.TOOL_ID, LassoSelectionConfigComponent);
    }
}
