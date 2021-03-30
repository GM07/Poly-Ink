import { Component } from '@angular/core';
import { Tool } from '@app/classes/tool';
import {
    AerosolToolConstants,
    EllipseSelectionToolConstants,
    EllipseToolConstants,
    EraserToolConstants,
    EyeDropperToolConstants,
    LineToolConstants,
    PencilToolConstants,
    PolygoneToolConstants,
    RectangleSelectionToolConstants,
    RectangleToolConstants,
} from '@app/classes/tool_ui_settings/tools.constants';
import { AerosolConfigComponent } from '@app/components/tool-config/aerosol-config/aerosol-config.component';
import { EllipseConfigComponent } from '@app/components/tool-config/ellipse-config/ellipse-config.component';
import { EllipseSelectionConfigComponent } from '@app/components/tool-config/ellipse-selection-config/ellipse-selection-config.component';
import { EraserConfigComponent } from '@app/components/tool-config/eraser-config/eraser-config.component';
import { EyeDropperConfigComponent } from '@app/components/tool-config/eye-dropper-config/eye-dropper-config.component';
import { LineConfigComponent } from '@app/components/tool-config/line-config/line-config.component';
import { PencilConfigComponent } from '@app/components/tool-config/pencil-config/pencil-config.component';
import { PolygoneConfigComponent } from '@app/components/tool-config/polygone-config/polygone-config.component';
import { RectangleConfigComponent } from '@app/components/tool-config/rectangle-config/rectangle-config.component';
import { RectangleSelectionConfigComponent } from '@app/components/tool-config/rectangle-selection-config/rectangle-selection-config.component';
import { ToolConfig } from '@app/components/tool-config/tool-config';
import { ToolHandlerService } from '@app/services/tools/tool-handler.service';
@Component({
    selector: 'app-settings-handler',
    templateUrl: './settings-handler.component.html',
    styleUrls: ['./settings-handler.component.scss'],
})
export class SettingsHandlerComponent {
    settingsList: Map<string, ToolConfig> = new Map();
    lastTool: Tool;
    lastTab: ToolConfig = PencilConfigComponent;

    constructor(private toolHandler: ToolHandlerService) {
        this.settingsList.set(EraserToolConstants.TOOL_ID, EraserConfigComponent);
        this.settingsList.set(PencilToolConstants.TOOL_ID, PencilConfigComponent);
        this.settingsList.set(LineToolConstants.TOOL_ID, LineConfigComponent);
        this.settingsList.set(RectangleToolConstants.TOOL_ID, RectangleConfigComponent);
        this.settingsList.set(EllipseToolConstants.TOOL_ID, EllipseConfigComponent);
        this.settingsList.set(PolygoneToolConstants.TOOL_ID, PolygoneConfigComponent);
        this.settingsList.set(RectangleSelectionToolConstants.TOOL_ID, RectangleSelectionConfigComponent);
        this.settingsList.set(EllipseSelectionToolConstants.TOOL_ID, EllipseSelectionConfigComponent);
        this.settingsList.set(AerosolToolConstants.TOOL_ID, AerosolConfigComponent);
        this.settingsList.set(EyeDropperToolConstants.TOOL_ID, EyeDropperConfigComponent);
        this.applyNewTab();
    }

    get activeTab(): ToolConfig {
        if (this.toolHandler.getCurrentTool() === this.lastTool) return this.lastTab;
        this.applyNewTab();
        return this.lastTab;
    }

    applyNewTab(): void {
        for (const [toolID, toolConfig] of this.settingsList) {
            if (this.toolHandler.getCurrentTool().toolID === toolID) {
                this.lastTool = this.toolHandler.getCurrentTool();
                this.lastTab = toolConfig;
                break;
            }
        }
    }
}
