import { Vec2 } from '@app/classes/vec2';

export enum TextAlignment {
    Left = 'left',
    Center = 'center',
    Right = 'right',
}

export class TextConfig {
    startCoords: Vec2;
    textData: string[];
    fontSize: number;
    textFont: string;
    italic: boolean;
    bold: boolean;
    alignmentSetting: string;
    //color: Color;

    constructor() {
        this.startCoords = new Vec2(0, 0);
        this.textFont = 'Arial';
        this.fontSize = 14;
        this.textData = [];
        this.bold = false;
        this.italic = false;
        this.alignmentSetting = '';
    }

    clone(): TextConfig {
        const config = new TextConfig();
        config.startCoords = new Vec2(this.startCoords.x, this.startCoords.y);
        config.textFont = this.textFont;
        config.textData = this.textData;
        config.fontSize = this.fontSize;
        config.bold = this.bold;
        config.italic = this.italic;
        //config.color = this.color;
        config.alignmentSetting = this.alignmentSetting;
        
        return config;
    }
}
