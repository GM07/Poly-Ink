import { Component } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { AerosolConfigComponent } from '@app/components/tool-config/aerosol-config/aerosol-config.component';
import { BucketConfigComponent } from '@app/components/tool-config/bucket-config/bucket-config.component';
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
import { AerosolService } from '@app/services/tools/aerosol.service';
import { BucketService } from '@app/services/tools/bucket.service';
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
@Component({
    selector: 'app-settings-handler',
    templateUrl: './settings-handler.component.html',
    styleUrls: ['./settings-handler.component.scss'],
})
export class SettingsHandlerComponent {
    settingsList: Map<typeof Tool, ToolConfig> = new Map();
    lastTool: Tool;
    lastTab: ToolConfig = PencilConfigComponent;

    constructor(private toolHandler: ToolHandlerService) {
        this.settingsList.set(EraserService, EraserConfigComponent);
        this.settingsList.set(PencilService, PencilConfigComponent);
        this.settingsList.set(LineService, LineConfigComponent);
        this.settingsList.set(RectangleService, RectangleConfigComponent);
        this.settingsList.set(EllipseService, EllipseConfigComponent);
        this.settingsList.set(PolygoneService, PolygoneConfigComponent);
        this.settingsList.set(RectangleSelectionService, RectangleSelectionConfigComponent);
        this.settingsList.set(EllipseSelectionService, EllipseSelectionConfigComponent);
        this.settingsList.set(AerosolService, AerosolConfigComponent);
        this.settingsList.set(EyeDropperService, EyeDropperConfigComponent);
        this.settingsList.set(BucketService, BucketConfigComponent);
        this.applyNewTab();
    }

    get activeTab(): ToolConfig {
        if (this.toolHandler.getCurrentTool() === this.lastTool) return this.lastTab;
        this.applyNewTab();
        return this.lastTab;
    }

    applyNewTab(): void {
        for (const [tool, toolConfig] of this.settingsList) {
            if (this.toolHandler.getCurrentTool() instanceof tool) {
                this.lastTool = this.toolHandler.getCurrentTool();
                this.lastTab = toolConfig;
                break;
            }
        }
    }
}
