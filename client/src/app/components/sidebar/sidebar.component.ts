import { Component, EventEmitter, NgZone, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Tool } from '@app/classes/tool';
import { BOTTOM_TOOLS } from '@app/classes/tool_ui_settings/index-bottom';
import { TOP_TOOLS } from '@app/classes/tool_ui_settings/index-top';
import { ToolSettings } from '@app/classes/tool_ui_settings/tool-settings';
import { HIGHLIGHTED_COLOR } from '@app/classes/tool_ui_settings/tools.constants';
import { ToolHandlerService } from '@app/services/tools/tool-handler.service';

@Component({ selector: 'app-sidebar', templateUrl: './sidebar.component.html', styleUrls: ['./sidebar.component.scss'] })
export class SidebarComponent implements OnInit {
    topToolsSettings: ToolSettings[] = [];
    bottomToolsSettings: ToolSettings[] = [];
    toolHandlerService: ToolHandlerService;
    selectedTool: Tool;
    readonly HIGHLIGHTED_COLOR: string = HIGHLIGHTED_COLOR;
    @Output() settingClicked: EventEmitter<string> = new EventEmitter<string>();

    constructor(toolHandlerService: ToolHandlerService, private router: Router, private zone: NgZone) {
        this.toolHandlerService = toolHandlerService;
        this.selectedTool = this.toolHandlerService.getCurrentTool();
        this.toolHandlerService.currentToolSubject.subscribe((newTool) => {
            this.selectedTool = newTool;
        });
    }

    backToMenu(): void {
        this.zone.run(() => this.router.navigateByUrl('home'));
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
    }

    emitClickEvent(toolSettings: ToolSettings): void {
        this.settingClicked.emit(toolSettings.toolId);
    }
}
