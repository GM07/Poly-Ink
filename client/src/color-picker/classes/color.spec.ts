import { Colors } from 'src/color-picker/constants/colors';
import { HexColors } from 'src/color-picker/constants/hex-colors';
import { Color } from './color';

describe('Color', () => {
    it('should construct properly', () => {
        const r = 255;
        const g = 200;
        const b = 125;
        const color: Color = new Color(r, g, b);
        expect(color.r).toEqual(r);
        expect(color.g).toEqual(g);
        expect(color.b).toEqual(b);
    });

    it('should construct proper rgba string', () => {
        const color: Color = Colors.RED;
        const expectedRgba = 'rgba(255, 0, 0, 1)';
        const answerRgba: string = color.toRgbaString(1);
        expect(answerRgba).toEqual(expectedRgba);
    });

    it('should return true for when colors are equal', () => {
        const r = 255;
        const g = 200;
        const b = 125;
        const color1: Color = new Color(r, g, b);
        const color2: Color = new Color(r, g, b);
        expect(color1.equals(color2)).toBeTrue();
    });

    it('should return false when colors are not equal', () => {
        const r = 255;
        const g = 200;
        const b = 125;
        const color1: Color = new Color(r, g, b);
        const color2: Color = new Color(r, g + 1, b);
        expect(color1.equals(color2)).toBeFalse();
    });

    it('rgbString property should return good string', () => {
        const color: Color = Colors.RED;
        const expectedRgb = 'rgb(255, 0, 0)';
        expect(color.rgbString).toEqual(expectedRgb);
    });

    it('hexString property should return properly formated hex', () => {
        let color: Color = Colors.RED;
        let expectedHex: string = HexColors.RED;
        expect(color.hexString).toEqual(expectedHex);
        color = Colors.BLUE;
        expectedHex = HexColors.BLUE;
        expect(color.hexString).toEqual(expectedHex);
        color = Colors.GREEN;
        expectedHex = HexColors.GREEN;
        expect(color.hexString).toEqual(expectedHex);
        color = Colors.GRAY;
        expectedHex = HexColors.GRAY;
        expect(color.hexString).toEqual(expectedHex);
    });

    it('should create new color on clone', () => {
        const color1: Color = Colors.GREEN;
        const color2: Color = color1.clone();
        expect(color1).not.toBe(color2);
    });

    it('should calculate proper hue for color', () => {
        const redHue = 0;
        const yellowHue = 60;
        const greenHue = 120;
        const cyanHue = 180;
        const blueHue = 240;
        const purpleHue = 300;
        expect(Colors.RED.hue).toEqual(redHue);
        expect(Colors.GREEN.hue).toEqual(greenHue);
        expect(Colors.YELLOW.hue).toEqual(yellowHue);
        expect(Colors.CYAN.hue).toEqual(cyanHue);
        expect(Colors.BLUE.hue).toEqual(blueHue);
        expect(Colors.PURPLE.hue).toEqual(purpleHue);
    });

    it('should calculate properRgb from hue', () => {
        const redHue = 0;
        const yellowHue = 60;
        const greenHue = 120;
        const cyanHue = 180;
        const blueHue = 240;
        const purpleHue = 300;
        const blackHue = 360;
        expect(Color.hueToRgb(redHue)).toEqual(Colors.RED);
        expect(Color.hueToRgb(yellowHue)).toEqual(Colors.YELLOW);
        expect(Color.hueToRgb(greenHue)).toEqual(Colors.GREEN);
        expect(Color.hueToRgb(cyanHue)).toEqual(Colors.CYAN);
        expect(Color.hueToRgb(blueHue)).toEqual(Colors.BLUE);
        expect(Color.hueToRgb(purpleHue)).toEqual(Colors.PURPLE);
        expect(Color.hueToRgb(blackHue)).toEqual(Colors.BLACK);
    });

    it('should create proper color from valid hex', () => {
        expect(Color.hexToRgb(HexColors.GREEN)).toEqual(Colors.GREEN);
        expect(Color.hexToRgb(HexColors.BLUE)).toEqual(Colors.BLUE);
        expect(Color.hexToRgb(HexColors.RED)).toEqual(Colors.RED);
        expect(Color.hexToRgb(HexColors.BLACK)).toEqual(Colors.BLACK);
        expect(Color.hexToRgb(HexColors.WHITE)).toEqual(Colors.WHITE);
        expect(Color.hexToRgb(HexColors.GRAY)).toEqual(Colors.GRAY);
    });
});
