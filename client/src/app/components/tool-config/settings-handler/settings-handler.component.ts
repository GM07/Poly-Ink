import { Component } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { PencilConfigComponent } from '@app/components/tool-config/pencil-config/pencil-config.component';
import { LineService } from '@app/services/tools/line-service';
import { PencilService } from '@app/services/tools/pencil-service';
import { ToolHandlerService } from '@app/services/tools/tool-handler-service';
import { LineConfigComponent } from '../line-config/line-config.component';
import { ToolConfig } from '../tool-config';

@Component({
  selector: 'app-settings-handler',
  templateUrl: './settings-handler.component.html',
  styleUrls: ['./settings-handler.component.scss']
})
export class SettingsHandlerComponent {
  settingsList: Map<typeof Tool, ToolConfig> = new Map();
  private lastTool: Tool;
  private lastTab: ToolConfig = PencilConfigComponent;


  constructor(private toolHandler: ToolHandlerService) {
    this.settingsList.set(PencilService, PencilConfigComponent);
    this.settingsList.set(LineService, LineConfigComponent);
    this.lastTool = toolHandler.getTool();
  }

  get activeTab() {
    if (this.toolHandler.getTool() == this.lastTool)
      return this.lastTab;

    for (const [tool, toolConfig] of this.settingsList) {
      if (this.toolHandler.getTool() instanceof tool) {
        this.lastTool = this.toolHandler.getTool();
        this.lastTab = toolConfig;
        break;
      }
    }
    return this.lastTab;
  }
}
