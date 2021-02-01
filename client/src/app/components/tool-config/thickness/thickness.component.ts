import { Component, OnInit } from '@angular/core';

export interface IThicknessComponent {
  //sizeValue: number;
  //colorSliderLabel(value: number): string;
}

@Component({
  selector: 'app-thickness',
  templateUrl: './thickness.component.html',
  styleUrls: ['./thickness.component.scss']
})
export class ThicknessComponent implements OnInit, IThicknessComponent {

  sizeValue: number;

  constructor() { }

  colorSliderLabel(value: number): string {
    return value + 'px';
  }

  ngOnInit(): void {
  }

}
