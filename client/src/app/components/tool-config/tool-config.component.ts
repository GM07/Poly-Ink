import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-tool-config',
    templateUrl: './tool-config.component.html',
    styleUrls: ['./tool-config.component.scss'],
})
export class ToolConfigComponent {

    constructor(public dialogRef: MatDialogRef<ToolConfigComponent>, @Inject(MAT_DIALOG_DATA) public data: string) {}
}
