import { Injectable } from '@angular/core';
import { ShortcutKey } from '@app/classes/shortcut/shortcut-key';
import { Vec2 } from '@app/classes/vec2';
import { GridService } from './grid.service';

@Injectable({
  providedIn: 'root'
})
export class MagnetismService {
  magnetismShortcut: ShortcutKey;
  isEnabled: boolean;
  distance: Vec2;



  constructor(public gridService: GridService) {
    this.magnetismShortcut = new ShortcutKey('m');
    this.isEnabled = false;
  }

  onKeyDown(event: KeyboardEvent){
    if(this.magnetismShortcut.equals(event))
      this.isEnabled = !this.isEnabled;
  }

  getGridPosition(currentPos: Vec2, size: Vec2) : Vec2 {
      if(this.isEnabled){
          currentPos = this.getClosestIntersection(currentPos, size);
          currentPos = this.getAjustement(currentPos, size);

          return new Vec2(currentPos.x, currentPos.y);
      } else {
        return currentPos;
      }
  }

  getClosestIntersection(position: Vec2, size: Vec2): Vec2{
      const xMod = position.x%this.gridService.size;
      const yMod = position.y%this.gridService.size;
      let xPos = xMod > this.gridService.size/2 ? position.x + (this.gridService.size-xMod) : (xMod === 0 ? position.x : position.x - xMod);
      let yPos = yMod > this.gridService.size/2 ? position.y + (this.gridService.size-yMod) : (yMod === 0 ? position.y : position.y - yMod);
      return new Vec2(xPos, yPos);
    }

  getAjustement(currentPos: Vec2, size: Vec2): Vec2{
    const newEndCoords = new Vec2(currentPos.x + this.distance.x, currentPos.y + this.distance.y);
    currentPos.x += (newEndCoords.x%this.gridService.size > this.gridService.size/2 ?
      newEndCoords.x%this.gridService.size : (newEndCoords.x%this.gridService.size === 0 ? 0 : -(this.gridService.size - newEndCoords.x%this.gridService.size)));
    currentPos.y += (newEndCoords.y%this.gridService.size > this.gridService.size/2 ?
        newEndCoords.y%this.gridService.size : (newEndCoords.y%this.gridService.size === 0 ? 0 : -(this.gridService.size - newEndCoords.y%this.gridService.size)));
      return currentPos;
  }

}
