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
    bottomLeft,
}

@Injectable({
    providedIn: 'root',
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

    onKeyDown(event: KeyboardEvent): void {
        if (this.magnetismShortcut.equals(event)) this.isEnabled = !this.isEnabled;
    }

    setDistanceVector(mousePosition: Vec2, endCoords: Vec2, size: Vec2): void {
        this.distance = new Vec2(0, 0);
        switch (this.selection) {
            case MagnetismSelection.topLeft:
            case MagnetismSelection.left:
            case MagnetismSelection.bottomLeft:
                this.distance.x = mousePosition.x - endCoords.x;
                break;
            case MagnetismSelection.top:
            case MagnetismSelection.center:
            case MagnetismSelection.bottomLeft:
                this.distance.x = mousePosition.x - (endCoords.x + size.x / 2);
                break;
            default:
                this.distance.x = mousePosition.x - (endCoords.x + size.x);
                break;
        }

        switch (this.selection) {
            case MagnetismSelection.topLeft:
            case MagnetismSelection.top:
            case MagnetismSelection.topRight:
                this.distance.y = mousePosition.y - endCoords.y;
                break;
            case MagnetismSelection.left:
            case MagnetismSelection.center:
            case MagnetismSelection.right:
                this.distance.y = mousePosition.y - (endCoords.y + size.y / 2);
                break;
            default:
                this.distance.y = mousePosition.y - (endCoords.y + size.y);
                break;
        }
    }

    getGridPosition(currentPos: Vec2): Vec2 {
        if (this.isEnabled) currentPos = this.getAjustement(this.getClosestIntersection(currentPos));
        return currentPos;
    }

    getClosestIntersection(position: Vec2): Vec2 {
        const xMod = position.x % this.gridService.size;
        const yMod = position.y % this.gridService.size;
        const xPos = xMod > this.gridService.size / 2 ? position.x + (this.gridService.size - xMod) : xMod === 0 ? position.x : position.x - xMod;
        const yPos = yMod > this.gridService.size / 2 ? position.y + (this.gridService.size - yMod) : yMod === 0 ? position.y : position.y - yMod;
        return new Vec2(xPos, yPos);
    }

    getAjustement(currentPos: Vec2): Vec2 {
        const newEndCoords = new Vec2(currentPos.x + this.distance.x, currentPos.y + this.distance.y);
        const newCoordsXMod = newEndCoords.x % this.gridService.size;
        const newCoordsYMod = newEndCoords.y % this.gridService.size;
        currentPos.x +=
            newCoordsXMod > this.gridService.size / 2 ? newCoordsXMod : newCoordsXMod === 0 ? 0 : -(this.gridService.size - newCoordsXMod);
        currentPos.y +=
            newCoordsYMod > this.gridService.size / 2 ? newCoordsYMod : newCoordsYMod === 0 ? 0 : -(this.gridService.size - newCoordsYMod);
        return currentPos;
    }

    getXKeyAjustement(endCoords: number, size: number): number {
        switch (this.selection) {
            case MagnetismSelection.topLeft:
            case MagnetismSelection.left:
            case MagnetismSelection.bottomLeft:
                return this.gridService.size - (endCoords % this.gridService.size) - this.gridService.size;
            case MagnetismSelection.top:
            case MagnetismSelection.center:
            case MagnetismSelection.bottom:
                return this.gridService.size - ((endCoords + size / 2) % this.gridService.size) - this.gridService.size;
            default:
                return this.gridService.size - ((endCoords + size) % this.gridService.size) - this.gridService.size;
        }
    }

    getYKeyAjustement(endCoords: number, size: number): number {
        switch (this.selection) {
            case MagnetismSelection.topLeft:
            case MagnetismSelection.top:
            case MagnetismSelection.topRight:
                return this.gridService.size - (endCoords % this.gridService.size) - this.gridService.size;
            case MagnetismSelection.left:
            case MagnetismSelection.center:
            case MagnetismSelection.right:
                return this.gridService.size - ((endCoords + size / 2) % this.gridService.size) - this.gridService.size;
            default:
                return this.gridService.size - ((endCoords + size) % this.gridService.size) - this.gridService.size;
        }
    }
}
