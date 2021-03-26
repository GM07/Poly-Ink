import { Injectable } from '@angular/core';
import { ShortcutKey } from '@app/classes/shortcut/shortcut-key';
import { Vec2 } from '@app/classes/vec2';
import { GridService } from './grid.service';

export enum MagnetismSelection {
  topLeft,
  top,
  topRight,
  right,
  center,
  left,
  bottomRight,
  bottom,
  bottomLeft
};

@Injectable({
  providedIn: 'root'
})
export class MagnetismService {
  magnetismShortcut: ShortcutKey;
  isEnabled: boolean;
  distance: Vec2;
  selection: MagnetismSelection;



  constructor(public gridService: GridService) {
    this.magnetismShortcut = new ShortcutKey('m');
    this.isEnabled = false;
    this.selection = MagnetismSelection.topLeft;
  }

  setDistanceVector(mousePosition: Vec2, endCoords: Vec2, size: Vec2): void{
    this.distance = new Vec2(0,0);
    if(this.selection === MagnetismSelection.topLeft || this.selection === MagnetismSelection.left || this.selection === MagnetismSelection.bottomLeft)
      this.distance.x = mousePosition.x - (endCoords.x);
    else if(this.selection === MagnetismSelection.top || this.selection === MagnetismSelection.center || this.selection === MagnetismSelection.bottom)
      this.distance.x = mousePosition.x - (endCoords.x + size.x/2);
    else
      this.distance.x = mousePosition.x - (endCoords.x + size.x);

    if(this.selection === MagnetismSelection.topLeft || this.selection === MagnetismSelection.top || this.selection === MagnetismSelection.topRight)
      this.distance.y = mousePosition.y - (endCoords.y);
    else if(this.selection === MagnetismSelection.left || this.selection === MagnetismSelection.center || this.selection === MagnetismSelection.right)
      this.distance.y = mousePosition.y - (endCoords.y + size.y/2);
    else
      this.distance.y = mousePosition.y - (endCoords.y + size.y);
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

  getXKeyAjustement(endCoords: number, size: number): number{
    if(this.selection === MagnetismSelection.topLeft || this.selection === MagnetismSelection.left || this.selection === MagnetismSelection.bottomLeft)
      return (this.gridService.size - (endCoords)%this.gridService.size - this.gridService.size)
    else if(this.selection === MagnetismSelection.top || this.selection === MagnetismSelection.center || this.selection === MagnetismSelection.bottom)
      return (this.gridService.size - (endCoords+size/2)%this.gridService.size - this.gridService.size)
    else
    return (this.gridService.size - (endCoords+size)%this.gridService.size - this.gridService.size)
  }

  getYKeyAjustement(endCoords: number, size: number): number{
  if(this.selection === MagnetismSelection.topLeft || this.selection === MagnetismSelection.top || this.selection === MagnetismSelection.topRight)
    return (this.gridService.size - (endCoords)%this.gridService.size - this.gridService.size)
  else if(this.selection === MagnetismSelection.left || this.selection === MagnetismSelection.center || this.selection === MagnetismSelection.right)
    return (this.gridService.size - (endCoords+size/2)%this.gridService.size - this.gridService.size)
  else
  return (this.gridService.size - (endCoords+size)%this.gridService.size - this.gridService.size)
  }

}
