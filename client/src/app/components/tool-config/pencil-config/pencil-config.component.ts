import { Component } from '@angular/core';
//import { ToolConfig } from '@app/components/tool-config/tool-config';
import { ToolConfig } from '@app/classes/tool-config';
//import { DrawingService } from '@app/services/drawing/drawing.service';
import { PencilService } from '@app/services/tools/pencil-service';
// import { FormControl, Validators } from '@angular/forms';
//import { PencilService } from '@app/services/tools/pencil-service';


@Component({
  selector: 'app-pencil-config',
  templateUrl: './pencil-config.component.html',
  styleUrls: ['./pencil-config.component.scss'],
})

export class PencilConfigComponent extends ToolConfig {
  //width = new FormControl('', [Validators.min(1), Validators.max(100)]);
  public lineWidth: number; 

  constructor(public pencilService: PencilService) {
    super();
  }

    /*
  getErrorMessage() {
    if (this.width.hasError('min(1)')) {
      return 'You must enter a value';
    }

    return this.width.hasError('email') ? 'Not a valid email' : '';
  }*/

  colorSliderLabel(value: number): string {
    return value + 'px';
  }
}
