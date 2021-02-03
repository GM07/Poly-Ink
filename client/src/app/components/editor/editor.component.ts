import { Component, ViewChild } from '@angular/core';
import { NewDrawingComponent } from '../new-drawing/new-drawing.component';

@Component({
    selector: 'app-editor',
    templateUrl: './editor.component.html',
    styleUrls: ['./editor.component.scss'],
})
export class EditorComponent {

  @ViewChild('newCanvasMenu') newDrawingMenu: NewDrawingComponent;

  public constructor(){}

    executeAction(action : string){
      if(action === "Nouveau Dessin"){
        this.newDrawingMenu.createNewDrawing(false);
      }
    }
}
