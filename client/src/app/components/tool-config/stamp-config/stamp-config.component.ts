import { Component, HostListener, OnInit } from '@angular/core';
import { StampService } from '@app/services/tools/stamp.service';

@Component({
  selector: 'app-stamp-config',
  templateUrl: './stamp-config.component.html',
  styleUrls: ['./stamp-config.component.scss']
})
export class StampConfigComponent implements OnInit {
  readonly MAX_SCALE = 5;
  readonly MIN_SCALE = 0.1;
  readonly MIN_ROTATION = 0;
  readonly MAX_ROTATION = 360;


  constructor(public stampService: StampService) { }

  ngOnInit(): void {
  }

  colorSliderLabel(value: number): string {
    return value + 'x';
  }

@HostListener('document:mousewheel', ['$event'])
onWheelEvent(event: WheelEvent){
  event.preventDefault();
  this.stampService.angleValue = this.stampService.angleValue+Math.sign(event.deltaY)*(this.stampService.alt ? 1 : 15);
  this.stampService.updateStampPreview()
}

}
