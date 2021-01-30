import { Component, OnInit } from '@angular/core';
import * as CommonToolSettingsBottom from '@app/classes/tool_settings/index-bottom';
import * as CommonToolSettingsTop from '@app/classes/tool_settings/index-top';
import { ToolSettings } from '@app/classes/tool_settings/tool-settings';

@Component({ selector: 'app-sidebar', templateUrl: './sidebar.component.html', styleUrls: ['./sidebar.component.scss'] })
export class SidebarComponent implements OnInit {
    topToolsSettings: ToolSettings[] = [];
    bottomToolsSettings: ToolSettings[] = [];

    ngOnInit(): void {
        Object.values(CommonToolSettingsTop).forEach((setting) => {
            this.topToolsSettings.push(new setting());
        });
        Object.values(CommonToolSettingsBottom).forEach((setting) => {
            this.bottomToolsSettings.push(new setting());
        });
    }
}
