import { Component, OnInit } from '@angular/core';
import * as CommonToolSettingsBottom from '@app/classes/tool_settings/index-bottom';
import * as CommonToolSettingsTop from '@app/classes/tool_settings/index-top';
import { Pencilsettings } from '@app/classes/tool_settings/pencil-settings';
import { ToolSettings } from '@app/classes/tool_settings/tool-settings';
import { ToolHandlerService } from '@app/services/tools/tool-handler-service';
@Component({ selector: 'app-sidebar', templateUrl: './sidebar.component.html', styleUrls: ['./sidebar.component.scss'] })
export class SidebarComponent implements OnInit {
    topToolsSettings: ToolSettings[] = [];
    bottomToolsSettings: ToolSettings[] = [];
    toolHandlerService: ToolHandlerService;

    constructor(toolHandlerService: ToolHandlerService) {
        this.toolHandlerService = toolHandlerService;
    }

    ngOnInit(): void {
        Object.values(CommonToolSettingsTop).forEach((setting) => {
            this.topToolsSettings.push(new setting());
        });
        Object.values(CommonToolSettingsBottom).forEach((setting) => {
            this.bottomToolsSettings.push(new setting());
        });
    }

    toolIconClicked(toolSettings: Pencilsettings): void {
        console.log(toolSettings.toolId);
        this.toolHandlerService.setTool(toolSettings.toolId);
        console.log(this.toolHandlerService.currentTool);
    }
}
