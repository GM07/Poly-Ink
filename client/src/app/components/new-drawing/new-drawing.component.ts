import { Component, OnInit, HostListener} from '@angular/core';
import { NewDrawingService } from '@app/services/drawing/new-drawing.service';

@Component({
  selector: 'app-new-drawing',
  templateUrl: './new-drawing.component.html',
  styleUrls: ['./new-drawing.component.scss'],
})
export class NewDrawingComponent implements OnInit {

  constructor(private newDrawing: NewDrawingService) {}

  ngOnInit(): void {
  }

  fadeOut(): void {
    this.newDrawing.showWarning = false;
  }

  showWarning() : boolean{
    return this.newDrawing.showWarning;
  }

  createNewDrawing(confirm: boolean){
    this.fadeOut();
    this.newDrawing.newCanvas(confirm);
  }

  @HostListener('document:keydown', ['$event'])
    onKeyPressed(event: KeyboardEvent): void {
      if(event.ctrlKey && event.key != "Control"){
        if(event.key.toLocaleLowerCase() === "o"){
          event.preventDefault();
          this.newDrawing.newCanvas();
        }
      }
    }

}

