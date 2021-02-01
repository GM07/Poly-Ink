import { Component, OnInit } from '@angular/core';
import * as CommonFileSettings from '@app/classes/tool_settings/index-bottom';
import * as CommonToolSettings from '@app/classes/tool_settings/index-top';
import { PencilSettings } from '@app/classes/tool_settings/pencil-settings';
import { ToolSettings } from '@app/classes/tool_settings/tool-settings';
import { PencilToolConstants } from '@app/classes/tool_settings/tools.constants';
import { ToolHandlerService } from '@app/services/tools/tool-handler-service';

@Component({ selector: 'app-sidebar', templateUrl: './sidebar.component.html', styleUrls: ['./sidebar.component.scss'] })
export class SidebarComponent implements OnInit {
    topToolsSettings: ToolSettings[] = [];
    bottomToolsSettings: ToolSettings[] = [];
    toolHandlerService: ToolHandlerService;
    selectedToolId: string = PencilToolConstants.TOOL_ID;

    constructor(toolHandlerService: ToolHandlerService) {
        this.toolHandlerService = toolHandlerService;
    }

    ngOnInit(): void {
        Object.values(CommonToolSettings).forEach((setting) => {
            this.topToolsSettings.push(new setting());
        });
        Object.values(CommonFileSettings).forEach((setting) => {
            this.bottomToolsSettings.push(new setting());
        });
    }

    toolIconClicked(toolSettings: PencilSettings): void {
        console.log(toolSettings.toolId);
        this.toolHandlerService.setTool(toolSettings.toolId);
        this.selectedToolId = toolSettings.toolId;
        console.log(this.toolHandlerService.currentTool);
    }
}
