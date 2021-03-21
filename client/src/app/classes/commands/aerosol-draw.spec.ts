import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Prng } from '@app/classes/math/prng';
import { AerosolConfig } from '@app/classes/tool-config/aerosol-config';
import { Vec2 } from '@app/classes/vec2';
import * as seedrandom from 'seedrandom';
import { Colors } from 'src/color-picker/constants/colors';
import { ColorService } from 'src/color-picker/services/color.service';
import { AerosolDraw } from './aerosol-draw';

// tslint:disable:no-string-literal
// tslint:disable:no-any

describe('AerosolDraw', () => {
    let aerosolDraw: AerosolDraw;
    let colorService: ColorService;
    let canvasTestHelper: CanvasTestHelper;
    let ctxStub: CanvasRenderingContext2D;
    const ALPHA = 3;

    beforeEach(() => {
        colorService = { primaryRgba: Colors.RED.rgbString, secondaryRgba: Colors.BLUE.rgbString } as ColorService;
        aerosolDraw = new AerosolDraw(colorService, new AerosolConfig());
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        ctxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
    });

    it('should draw the right amount of droplets', () => {
        aerosolDraw['config'].seeds = ['test'];
        aerosolDraw['config'].points = [{ x: 1, y: 1 } as Vec2];
        const dropletDrawSpy = spyOn<any>(aerosolDraw, 'drawDroplet');
        aerosolDraw.execute(ctxStub);
        expect(dropletDrawSpy).toHaveBeenCalledTimes(aerosolDraw['config'].nDropletsPerSpray);
    });

    it('should generate predictable droplet position with seed', () => {
        const point: Vec2 = { x: 25, y: 25 };
        const iteration = 30;

        const firstPoints: Vec2[] = [];
        const secondPoints: Vec2[] = [];

        let prng: Prng = seedrandom('test');
        for (let i = 0; i < iteration; i++) {
            firstPoints.push(aerosolDraw['getRandomPoint'](prng, point));
        }

        prng = seedrandom('test');
        for (let i = 0; i < iteration; i++) {
            secondPoints.push(aerosolDraw['getRandomPoint'](prng, point));
        }

        expect(firstPoints).toEqual(secondPoints);
    });

    it('should draw droplet properly', () => {
        const point: Vec2 = { x: 25, y: 25 };
        aerosolDraw['drawDroplet'](ctxStub, point);

        const imageData: ImageData = ctxStub.getImageData(point.x, point.y, 1, 1);
        expect(imageData.data[ALPHA]).not.toEqual(0);
    });
});
