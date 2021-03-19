import { Vec2 } from '@app/classes/vec2';

export class SelectionConfig {
    startCoords: Vec2 = { x: 0, y: 0 };
    endCoords: Vec2 = { x: 0, y: 0 };
    height: number = 0;
    width: number = 0;
    shiftDown: boolean = false;

    clone(): SelectionConfig {
        const config = new SelectionConfig();
        config.startCoords = { x: this.startCoords.x, y: this.startCoords.y };
        config.endCoords = { x: this.endCoords.x, y: this.endCoords.y };
        config.shiftDown = this.shiftDown;
        config.height = this.height;
        config.width = this.width;

        return config;
    }
}
