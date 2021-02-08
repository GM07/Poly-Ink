import { Component, OnInit } from '@angular/core';
import { BOTTOM_TOOLS } from '@app/classes/tool_settings/index-bottom';
import { TOP_TOOLS } from '@app/classes/tool_settings/index-top';
import { ToolSettings } from '@app/classes/tool_settings/tool-settings';
import { HIGHLIGHTED_COLOR, PencilToolConstants } from '@app/classes/tool_settings/tools.constants';
import { ToolHandlerService } from '@app/services/tools/tool-handler-service';

@Component({ selector: 'app-sidebar', templateUrl: './sidebar.component.html', styleUrls: ['./sidebar.component.scss'] })
export class SidebarComponent implements OnInit {
    topToolsSettings: ToolSettings[] = [];
    bottomToolsSettings: ToolSettings[] = [];
    toolHandlerService: ToolHandlerService;
    selectedToolId: string = PencilToolConstants.TOOL_ID;
    readonly HIGHLIGHTED_COLOR: string = HIGHLIGHTED_COLOR;

    constructor(toolHandlerService: ToolHandlerService) {
        this.toolHandlerService = toolHandlerService;
    }

    ngOnInit(): void {
        Object.values(TOP_TOOLS).forEach((setting) => {
            this.topToolsSettings.push(setting);
        });
        Object.values(BOTTOM_TOOLS).forEach((setting) => {
            this.bottomToolsSettings.push(setting);
        });
    }

    toolIconClicked(toolSettings: ToolSettings): void {
        this.toolHandlerService.setTool(toolSettings.toolId);
        this.selectedToolId = toolSettings.toolId;
    }
}
