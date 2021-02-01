import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-diameter-junction-point',
  templateUrl: './diameter-junction-point.component.html',
  styleUrls: ['./diameter-junction-point.component.scss']
})
export class DiameterJunctionPointComponent implements OnInit {

  diameterJunctionPoints: number;

  constructor() { }

  colorSliderLabel(value: number): string {
    return value + 'px';
  }

  ngOnInit(): void {
  }

}
