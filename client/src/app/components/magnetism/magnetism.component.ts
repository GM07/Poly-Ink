import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-magnetism',
  templateUrl: './magnetism.component.html',
  styleUrls: ['./magnetism.component.scss']
})
export class MagnetismComponent implements AfterViewInit {

  @ViewChild('topLeft', { static: false }) topLeft: ElementRef<HTMLDivElement>;
  @ViewChild('top', { static: false }) top: ElementRef<HTMLDivElement>;
  @ViewChild('topRight', { static: false }) topRight: ElementRef<HTMLDivElement>;
  @ViewChild('left', { static: false }) left: ElementRef<HTMLDivElement>;
  @ViewChild('center', { static: false }) center: ElementRef<HTMLDivElement>;
  @ViewChild('right', { static: false }) right: ElementRef<HTMLDivElement>;
  @ViewChild('bottomLeft', { static: false }) bottomLeft: ElementRef<HTMLDivElement>;
  @ViewChild('bottom', { static: false }) bottom: ElementRef<HTMLDivElement>;
  @ViewChild('bottomRight', { static: false }) bottomRight: ElementRef<HTMLDivElement>;


  constructor() {}

  ngAfterViewInit(): void {
    this.center.nativeElement.style.backgroundColor = 'gray';
  }
}
