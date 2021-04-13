import { Vec2 } from '@app/classes/vec2';
import { ToolSettingsConst } from '@app/constants/tool-settings';

export class TextConfig {
    startCoords: Vec2;
    textData: string[];
    fontSize: number;
    textFont: string;
    italic: boolean;
    bold: boolean;
    alignmentSetting: string;
    index: Vec2;
    hasInput: boolean;
    newAlignment: boolean;
    lastAlignment: string;

    constructor() {
        this.startCoords = new Vec2(0, 0);
        this.textFont = 'Arial';
        this.fontSize = ToolSettingsConst.DEFAULT_SIZE;
        this.textData = [''];
        this.bold = false;
        this.italic = false;
        this.alignmentSetting = 'left';
        this.index = new Vec2(0, 0);
        this.hasInput = false;
        this.newAlignment = false;
        this.lastAlignment = 'left';
    }

    clone(): TextConfig {
        const config = new TextConfig();
        config.startCoords = this.startCoords.clone();
        config.textFont = this.textFont;
        config.textData = this.textData;
        config.fontSize = this.fontSize;
        config.bold = this.bold;
        config.italic = this.italic;
        config.alignmentSetting = this.alignmentSetting;
        config.index = this.index.clone();
        config.hasInput = this.hasInput;
        config.newAlignment = this.newAlignment;
        config.lastAlignment = this.lastAlignment;

        return config;
    }
}
