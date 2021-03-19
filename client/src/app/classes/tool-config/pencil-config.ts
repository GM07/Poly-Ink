import { Vec2 } from '@app/classes/vec2';
import { ToolSettingsConst } from '@app/constants/tool-settings';
export class PencilConfig {
    pathData: Vec2[][];
    lineWidth: number;

    constructor() {
        this.pathData = [[]];
        this.lineWidth = ToolSettingsConst.DEFAULT_PENCIL_WIDTH;
    }

    clone(): PencilConfig {
        const config = new PencilConfig();
        this.pathData.forEach((path, index) => {
            config.pathData.push([]);
            path.forEach((point) => {
                config.pathData[index].push({ x: point.x, y: point.y });
            });
        });

        config.lineWidth = this.lineWidth;
        return config;
    }
}
