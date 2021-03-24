import { Component } from '@angular/core';
import { Stamp } from '@app/classes/tool-config/stamp-config';
import { StampService } from '@app/services/tools/stamp.service';

@Component({
  selector: 'app-stamp-config',
  templateUrl: './stamp-config.component.html',
  styleUrls: ['./stamp-config.component.scss']
})

export class StampConfigComponent {
  readonly MAX_SCALE = 5;
  readonly MIN_SCALE = 0.1;
  readonly MIN_ROTATION = 0;
  readonly MAX_ROTATION = 360;
  StampMode: typeof Stamp = Stamp;


  constructor(public stampService: StampService) {
    window.addEventListener('mousewheel', (event: WheelEvent)=>{
      if(this.stampService.isActive())
        event.preventDefault();
      this.stampService.angleValue = this.stampService.angleValue+Math.sign(event.deltaY)*(this.stampService.alt.isDown ? 1 : 15);
      this.stampService.drawPreview()
    },
    {passive: false},
    );
   }

  colorSliderLabel(value: number): string {
    return value + 'x';
  }

  toggleStamp(stamp: Stamp){
    this.stampService.config.etampe = stamp;
    this.stampService.updateStampValue();
  }

}
