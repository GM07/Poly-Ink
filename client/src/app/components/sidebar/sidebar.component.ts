import { Component, OnInit } from '@angular/core';
import * as CommonToolSettings from '@app/classes/tool_settings/index';
import { ToolSettings } from '@app/classes/tool_settings/tool-settings';

@Component({ selector: 'app-sidebar', templateUrl: './sidebar.component.html', styleUrls: ['./sidebar.component.scss'] })
export class SidebarComponent implements OnInit {
    topToolsSettings: ToolSettings[] = [];
    bottomToolsSettings: ToolSettings[] = [];

    ngOnInit(): void {
        
        Object.values(CommonToolSettings).forEach((setting) => {
            this.topToolsSettings.push(new setting());
        });
    }
}
