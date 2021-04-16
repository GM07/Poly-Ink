export class Color {
    static readonly MAX: number = 255;
    static readonly MIN: number = 0;

    readonly r: number;
    readonly g: number;
    readonly b: number;

    constructor(r: number, g: number, b: number) {
        this.r = r;
        this.g = g;
        this.b = b;
    }

    static hueToRgb(hue: number): Color {
        const s = 1;
        const l = 0.5;

        // Formula for rgb to hue contains magic numbers so we disable lint for this section
        /* tslint:disable:no-magic-numbers */
        const c = (1 - Math.abs(2 * l - 1)) * s;
        const x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
        const m = l - c / 2;
        let r = 0;
        let g = 0;
        let b = 0;

        if (0 <= hue && hue < 60) {
            r = c;
            g = x;
            b = 0;
        } else if (60 <= hue && hue < 120) {
            r = x;
            g = c;
            b = 0;
        } else if (120 <= hue && hue < 180) {
            r = 0;
            g = c;
            b = x;
        } else if (180 <= hue && hue < 240) {
            r = 0;
            g = x;
            b = c;
        } else if (240 <= hue && hue < 300) {
            r = x;
            g = 0;
            b = c;
        } else if (300 <= hue && hue < 360) {
            r = c;
            g = 0;
            b = x;
        }
        /* tslint:enable:no-magic-numbers */

        r = Math.round((r + m) * Color.MAX);
        g = Math.round((g + m) * Color.MAX);
        b = Math.round((b + m) * Color.MAX);

        return new Color(r, g, b);
    }

    static hexToRgb(hex: string): Color {
        const rStart = 0;
        const rEnd = 2;
        const gStart = 2;
        const gEnd = 4;
        const bStart = 4;
        const bEnd = 6;
        const r: number = parseInt(hex.substring(rStart, rEnd), 16);
        const g: number = parseInt(hex.substring(gStart, gEnd), 16);
        const b: number = parseInt(hex.substring(bStart, bEnd), 16);

        return new Color(r, g, b);
    }

    get rgbString(): string {
        return `rgb(${this.r}, ${this.g}, ${this.b})`;
    }

    get hexString(): string {
        return `${this.r.toString(16).padStart(2, '0')}${this.g.toString(16).padStart(2, '0')}${this.b.toString(16).padStart(2, '0')}`.toUpperCase();
    }

    get hue(): number {
        const degreeInCircle = 360;
        const R: number = this.r / Color.MAX;
        const G: number = this.g / Color.MAX;
        const B: number = this.b / Color.MAX;

        const cmin = Math.min(R, G, B);
        const cmax = Math.max(R, G, B);
        const delta = cmax - cmin;

        let hue = 0;

        // Formula for hue to rgb contains magic numbers so we disable lint for this section
        /* tslint:disable:no-magic-numbers */
        if (delta === 0) hue = 0;
        else if (R === cmax) {
            hue = (((G - B) / delta) % 6) * 60;
        } else if (G === cmax) {
            hue = (2.0 + (B - R) / delta) * 60;
        } else {
            hue = (4.0 + (R - G) / delta) * 60;
        }
        /* tslint:enable:no-magic-numbers */

        // Add 360 until positiove since hue is on circle
        while (hue < 0) hue += degreeInCircle;

        return hue;
    }

    toRgbaString(alpha: number): string {
        return `rgba(${this.r}, ${this.g}, ${this.b}, ${alpha})`;
    }
    equals(color: Color): boolean {
        return this.r === color.r && this.g === color.g && this.b === color.b;
    }

    clone(): Color {
        return new Color(this.r, this.g, this.b);
    }
}
