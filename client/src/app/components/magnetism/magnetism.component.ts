import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { MagnetismSelection, MagnetismService } from '@app/services/drawing/magnetism.service';



@Component({
  selector: 'app-magnetism',
  templateUrl: './magnetism.component.html',
  styleUrls: ['./magnetism.component.scss']
})

export class MagnetismComponent implements AfterViewInit {

  magnetismSelection : typeof MagnetismSelection;

  @ViewChild('topLeft', { static: false }) topLeft: ElementRef<HTMLDivElement>;
  @ViewChild('top', { static: false }) top: ElementRef<HTMLDivElement>;
  @ViewChild('topRight', { static: false }) topRight: ElementRef<HTMLDivElement>;
  @ViewChild('left', { static: false }) left: ElementRef<HTMLDivElement>;
  @ViewChild('center', { static: false }) center: ElementRef<HTMLDivElement>;
  @ViewChild('right', { static: false }) right: ElementRef<HTMLDivElement>;
  @ViewChild('bottomLeft', { static: false }) bottomLeft: ElementRef<HTMLDivElement>;
  @ViewChild('bottom', { static: false }) bottom: ElementRef<HTMLDivElement>;
  @ViewChild('bottomRight', { static: false }) bottomRight: ElementRef<HTMLDivElement>;

  constructor(private magnetismService: MagnetismService) {
    this.magnetismSelection = MagnetismSelection;
  }

  ngAfterViewInit(): void {
    this.topLeft.nativeElement.style.backgroundColor = 'gray';
  }

  setSelected(position: MagnetismSelection){
    this.magnetismService.selection = position;
    this.topLeft.nativeElement.style.background = position === MagnetismSelection.topLeft ? 'gray' : 'white';
    this.top.nativeElement.style.background = position === MagnetismSelection.top ? 'gray' : 'white';
    this.topRight.nativeElement.style.background = position === MagnetismSelection.topRight ? 'gray' : 'white';
    this.left.nativeElement.style.background = position === MagnetismSelection.left ? 'gray' : 'white';
    this.center.nativeElement.style.background = position === MagnetismSelection.center ? 'gray' : 'white';
    this.right.nativeElement.style.background = position === MagnetismSelection.right ? 'gray' : 'white';
    this.bottomLeft.nativeElement.style.background = position === MagnetismSelection.bottomLeft ? 'gray' : 'white';
    this.bottom.nativeElement.style.background = position === MagnetismSelection.bottom ? 'gray' : 'white';
    this.bottomRight.nativeElement.style.background = position === MagnetismSelection.bottomRight ? 'gray' : 'white';

  }
}
