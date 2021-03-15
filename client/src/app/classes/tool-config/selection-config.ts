import { Vec2 } from '@app/classes/vec2';

export class SelectionConfig {
    startCoords: Vec2;
    endCoords: Vec2;
    height: number;
    width: number;
    shiftDown: boolean;

    clone(): SelectionConfig {
        let config = new SelectionConfig();
        config.startCoords = { x: this.startCoords.x, y: this.startCoords.y };
        config.endCoords = { x: this.endCoords.x, y: this.endCoords.y };
        config.shiftDown = this.shiftDown;
        config.height = this.height;
        config.width = this.width;

        return config;
    }
}
