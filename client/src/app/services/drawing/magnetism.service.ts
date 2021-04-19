import { Injectable } from '@angular/core';
import { ShortcutKey } from '@app/classes/shortcut/shortcut-key';
import { Vec2 } from '@app/classes/vec2';
import { GridService } from './grid.service';

export enum MagnetismSelection {
    TopLeft,
    Top,
    TopRight,
    Right,
    Center,
    Left,
    BottomRight,
    Bottom,
    BottomLeft,
}

@Injectable({
    providedIn: 'root',
})
export class MagnetismService {
    readonly MAGNETISM_SHORTCUT: ShortcutKey;
    isEnabled: boolean;
    distance: Vec2;
    selection: MagnetismSelection;

    constructor(public gridService: GridService) {
        this.MAGNETISM_SHORTCUT = new ShortcutKey('m');
        this.isEnabled = false;
        this.selection = MagnetismSelection.TopLeft;
    }

    onKeyDown(event: KeyboardEvent): void {
        if (this.MAGNETISM_SHORTCUT.equals(event)) this.isEnabled = !this.isEnabled;
    }

    setDistanceVector(mousePosition: Vec2, endCoords: Vec2, size: Vec2): void {
        this.distance = new Vec2(0, 0);
        switch (this.selection) {
            case MagnetismSelection.TopLeft:
                this.distance.x = mousePosition.x - endCoords.x;
                this.distance.y = mousePosition.y - endCoords.y;
                break;
            case MagnetismSelection.Left:
                this.distance.x = mousePosition.x - endCoords.x;
                this.distance.y = mousePosition.y - (endCoords.y + size.y / 2);
                break;
            case MagnetismSelection.BottomLeft:
                this.distance.x = mousePosition.x - endCoords.x;
                this.distance.y = mousePosition.y - (endCoords.y + size.y);
                break;
            case MagnetismSelection.Top:
                this.distance.x = mousePosition.x - (endCoords.x + size.x / 2);
                this.distance.y = mousePosition.y - endCoords.y;
                break;
            case MagnetismSelection.Center:
                this.distance.x = mousePosition.x - (endCoords.x + size.x / 2);
                this.distance.y = mousePosition.y - (endCoords.y + size.y / 2);
                break;
            case MagnetismSelection.Bottom:
                this.distance.x = mousePosition.x - (endCoords.x + size.x / 2);
                this.distance.y = mousePosition.y - (endCoords.y + size.y);
                break;
            case MagnetismSelection.TopRight:
                this.distance.x = mousePosition.x - (endCoords.x + size.x);
                this.distance.y = mousePosition.y - endCoords.y;
                break;
            case MagnetismSelection.Right:
                this.distance.x = mousePosition.x - (endCoords.x + size.x);
                this.distance.y = mousePosition.y - (endCoords.y + size.y / 2);
                break;
            case MagnetismSelection.BottomRight:
                this.distance.x = mousePosition.x - (endCoords.x + size.x);
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
        const xPos = xMod > this.gridService.size / 2 ? position.x + (this.gridService.size - xMod) : position.x - xMod;
        const yPos = yMod > this.gridService.size / 2 ? position.y + (this.gridService.size - yMod) : position.y - yMod;
        return new Vec2(xPos, yPos);
    }

    getAjustement(currentPos: Vec2): Vec2 {
        const newEndCoords = currentPos.add(this.distance);
        const newCoordsMod = new Vec2(newEndCoords.x % this.gridService.size, newEndCoords.y % this.gridService.size);
        currentPos.x +=
            newCoordsMod.x > this.gridService.size / 2 ? newCoordsMod.x : newCoordsMod.x === 0 ? 0 : -(this.gridService.size - newCoordsMod.x);
        currentPos.y +=
            newCoordsMod.y > this.gridService.size / 2 ? newCoordsMod.y : newCoordsMod.y === 0 ? 0 : -(this.gridService.size - newCoordsMod.y);
        return currentPos;
    }

    getXKeyAjustement(endCoords: number, size: number): number {
        switch (this.selection) {
            case MagnetismSelection.TopLeft:
            case MagnetismSelection.Left:
            case MagnetismSelection.BottomLeft:
                return this.gridService.size - (endCoords % this.gridService.size) - this.gridService.size;
            case MagnetismSelection.Top:
            case MagnetismSelection.Center:
            case MagnetismSelection.Bottom:
                return this.gridService.size - ((endCoords + size / 2) % this.gridService.size) - this.gridService.size;
            default:
                return this.gridService.size - ((endCoords + size) % this.gridService.size) - this.gridService.size;
        }
    }

    getYKeyAjustement(endCoords: number, size: number): number {
        switch (this.selection) {
            case MagnetismSelection.TopLeft:
            case MagnetismSelection.Top:
            case MagnetismSelection.TopRight:
                return this.gridService.size - (endCoords % this.gridService.size) - this.gridService.size;
            case MagnetismSelection.Left:
            case MagnetismSelection.Center:
            case MagnetismSelection.Right:
                return this.gridService.size - ((endCoords + size / 2) % this.gridService.size) - this.gridService.size;
            default:
                return this.gridService.size - ((endCoords + size) % this.gridService.size) - this.gridService.size;
        }
    }
}
