import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Tool } from '@app/classes/tool';
import { ToolHandlerService } from '@app/services/tools/tool-handler-service.ts';
//import { IThicknessComponent } from '@app/components/tool-config/thickness/thickness.component';

@Component({
    selector: 'app-tool-config',
    templateUrl: './tool-config.component.html',
    styleUrls: ['./tool-config.component.scss'],
})
export class ToolConfigComponent {

    constructor(public dialogRef: MatDialogRef<ToolConfigComponent>, @Inject(MAT_DIALOG_DATA) public data: string, private service: ToolHandlerService) {}

    currentTool: Tool = this.service.getTool();
}
