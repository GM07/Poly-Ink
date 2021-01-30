import { Component, OnInit } from '@angular/core';
import * as CommonToolSettings from '@app/classes/tool_settings/index';
import { ToolSettings } from '@app/classes/tool_settings/tool-settings';

@Component({ selector: 'app-sidebar', templateUrl: './sidebar.component.html', styleUrls: ['./sidebar.component.scss'] })
export class SidebarComponent implements OnInit {
    topToolsSettings: ToolSettings[] = [];
    bottomToolsSettings: ToolSettings[] = [];

    ngOnInit(): void {
        // Tool icons at the top of the side bar
        this.topToolsSettings.push(new CommonToolSettings.ColorSettings());
        this.topToolsSettings.push(new CommonToolSettings.Pencilsettings());
        this.topToolsSettings.push(new CommonToolSettings.AerosolSettings());
        this.topToolsSettings.push(new CommonToolSettings.RectangleSettings());
        this.topToolsSettings.push(new CommonToolSettings.EllipseSettings());
        this.topToolsSettings.push(new CommonToolSettings.PolygoneSettings());
        this.topToolsSettings.push(new CommonToolSettings.LineSettings());
        this.topToolsSettings.push(new CommonToolSettings.TextSettings());
        this.topToolsSettings.push(new CommonToolSettings.FillSettings());
        this.topToolsSettings.push(new CommonToolSettings.EraserSettings());
        this.topToolsSettings.push(new CommonToolSettings.StampSettings());
        this.topToolsSettings.push(new CommonToolSettings.EyeDropperSettings());
        this.topToolsSettings.push(new CommonToolSettings.EllipseSelectionSettings());
        this.topToolsSettings.push(new CommonToolSettings.RectangleSelectionSettings());

        // Tool icons at the bottom of the side bar
        this.bottomToolsSettings.push(new CommonToolSettings.SaveSettings());
        this.bottomToolsSettings.push(new CommonToolSettings.ExportSettings());
    }
}
