import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Tool } from '@app/classes/tool';
import { ToolHandlerService } from '@app/services/tools/tool-handler-service.ts';
import { AbstractThicknessComponent } from './thickness/thickness.component';

@Component({
    selector: 'app-tool-config',
    templateUrl: './tool-config.component.html',
    styleUrls: ['./tool-config.component.scss'],
})
export class ToolConfigComponent implements OnInit{
    currentTool: Tool = this.service.getTool();

    hasThickness: boolean = 'lineWidthIn' in this.currentTool;
    hasTraceType: boolean = 'traceType' in this.currentTool;
    hasJunctionType: boolean = 'junctionType' in this.currentTool;

    constructor(
        public dialogRef: MatDialogRef<ToolConfigComponent>,
        @Inject(MAT_DIALOG_DATA) public data: string,
        private service: ToolHandlerService,
    ) {
        console.log(Object.getOwnPropertyNames(this));
    }

    ngOnInit() {
        console.log(this.currentTool);
        console.log('lineWidthIn' in this.currentTool );
        console.log(this.currentTool instanceof AbstractThicknessComponent);
    }
}
