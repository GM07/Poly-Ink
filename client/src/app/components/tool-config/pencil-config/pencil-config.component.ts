import { Component } from '@angular/core';
import { PencilService } from '@app/services/tools/pencil-service';
import { ToolConfig } from '../tool-config';

@Component({
  selector: 'app-pencil-config',
  templateUrl: './pencil-config.component.html',
  styleUrls: ['./pencil-config.component.scss']
})
export class PencilConfigComponent extends ToolConfig {

  constructor(public pencilService: PencilService) { 
    super();
  }

  colorSliderLabel(value: number): string {
    return value + 'px';
}
}
