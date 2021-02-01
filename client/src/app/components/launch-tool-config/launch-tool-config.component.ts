import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToolConfigComponent } from '@app/components/tool-config/tool-config.component';

@Component({
    selector: 'app-launch-tool-config',
    templateUrl: './launch-tool-config.component.html',
    styleUrls: ['./launch-tool-config.component.scss'],
})
export class LaunchToolConfigComponent {
    toolName: string = 'Ligne';

    constructor(public dialog: MatDialog) {}

    openDialog(): void {
        this.dialog.open(ToolConfigComponent, { data: this.toolName }); 
    }

    getComponentname(): string {
        return this.toolName + 'ConfigComponent';
    }
}
