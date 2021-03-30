import { DrawingService } from '@app/services/drawing/drawing.service';
import { LineDrawer } from './line-drawer';
import { AbstractLineConfig } from './tool-config/abstract-line-config';
import { Vec2 } from './vec2';

/* tslint:disable:no-magic-numbers */
/* tslint:disable:no-string-literal */
/* tslint:disable:no-any */
/* tslint:disable:no-empty */

class MockConfig implements AbstractLineConfig {
    points: Vec2[];
}

describe('Line Drawer', () => {
    let lineDrawer: LineDrawer;
    let config: AbstractLineConfig;
    let spyDrawing: jasmine.SpyObj<DrawingService>;
    let mousePos: Vec2 = new Vec2(50, 40);

    beforeEach(() => {
        spyDrawing = jasmine.createSpyObj('DrawingService', ['clearCanvas', 'drawPreview', 'draw', 'unblockUndoRedo', 'getBoundingClientRect']);
        config = new MockConfig();
        lineDrawer = new LineDrawer(config, spyDrawing);
        lineDrawer['pointToAdd'] = new Vec2(0, 0);
        lineDrawer['mousePosition'] = new Vec2(0, 0);
        lineDrawer['getPositionFromMouse'] = (event: MouseEvent) => {
            return mousePos;
        };
    });

    it('should add new point', () => {
        lineDrawer.addNewPoint({} as MouseEvent);
        expect(config.points.length).toBe(1);
        expect(config.points[0]).toEqual(mousePos);
    });

    it('should follow cursor when shift not pressed', () => {
        spyOn<any>(lineDrawer, 'renderLinePreview').and.callFake(() => {});
        lineDrawer.followCursor({} as MouseEvent);
        expect(lineDrawer.pointToAdd).toEqual(mousePos);
        expect(lineDrawer['renderLinePreview']).toHaveBeenCalled();
    });

    it('should follow cursor when shift not pressed', () => {
        const rendSpy = spyOn<any>(lineDrawer, 'renderLinePreview').and.callFake(() => {});
        const alignSpy = spyOn(lineDrawer, 'getAlignedPoint').and.callFake(() => {
            return mousePos;
        });
        lineDrawer.shift.isDown = true;
        config.points = [mousePos];
        lineDrawer.followCursor({} as MouseEvent);
        expect(alignSpy).toHaveBeenCalled();
        expect(rendSpy).toHaveBeenCalled();
    });

    it('should align points', () => {
        config.points = [new Vec2(500, 500), new Vec2(200, 300)];
        const result: Vec2 = lineDrawer['getAlignedPoint'](new Vec2(310, 405));
        expect(result).toEqual(new Vec2(310, 410));
    });

    it('should align points when vertical', () => {
        config.points = [new Vec2(500, 500), new Vec2(200, 300)];
        const result: Vec2 = lineDrawer['getAlignedPoint'](new Vec2(205, 500));
        expect(result).toEqual(new Vec2(200, 500));
    });

    it('should render', () => {
        const spy = spyOn<any>(lineDrawer.drawPreview, 'next').and.callFake(() => {});
        lineDrawer['renderLinePreview']();
        expect(spy).toHaveBeenCalled();
    });

    it('should remove last point if backspace is down', () => {
        lineDrawer.backspace.isDown = true;
        config.points = [mousePos, mousePos];
        lineDrawer.removeLastPoint();
        expect(config.points.length).toEqual(1);
    });

    it('should not remove last point if backspace is down', () => {
        lineDrawer.backspace.isDown = false;
        config.points = [mousePos, mousePos];
        lineDrawer.removeLastPoint();
        expect(config.points.length).toEqual(2);
    });

    it('should not align points when shift key is pressed when mouse is down', () => {
        lineDrawer['shift'].isDown = true;
        config.points.push(new Vec2(10, 10));
        lineDrawer['leftMouseDown'] = true;
        const alignFunc = spyOn<any>(lineDrawer, 'getAlignedPoint').and.returnValue(new Vec2(100, 100));
        lineDrawer['alignNextPoint']();
        expect(alignFunc).not.toHaveBeenCalled();
    });

    it('should align points when shift key is pressed', () => {
        lineDrawer['shift'].isDown = true;
        config.points.push(new Vec2(10, 10));
        const alignFunc = spyOn<any>(lineDrawer, 'getAlignedPoint').and.returnValue(new Vec2(100, 100));
        lineDrawer['alignNextPoint']();
        expect(alignFunc).toHaveBeenCalled();
        expect(lineDrawer['pointToAdd']).toEqual(new Vec2(100, 100));
    });

    it('should point to mouse position when shift key is released', () => {
        config.points.push(new Vec2(10, 10));
        lineDrawer['shift'].isDown = false;
        lineDrawer['alignNextPoint']();
        expect(lineDrawer['pointToAdd']).toEqual(new Vec2(0, 0));
    });

    it('should clear points when escape key is pressed', () => {
        config.points = [mousePos, mousePos];
        lineDrawer['escape'].isDown = true;
        lineDrawer['clearPoints']();
        expect(spyDrawing.unblockUndoRedo).toHaveBeenCalled();
        expect(config.points.length).toBe(0);
    });

    it('should not clear the canvas on other key', () => {
        lineDrawer['escape'].isDown = false;
        lineDrawer['clearPoints']();
        expect(spyDrawing.clearCanvas).not.toHaveBeenCalled();
    });

    it('should not handle any key when point array is empty', () => {
        const handleBackspace = spyOn<any>(lineDrawer, 'removeLastPoint');
        lineDrawer['handleKeys'](lineDrawer['backspace']);
        expect(handleBackspace).not.toHaveBeenCalled();
    });

    it('should call correct function when Backspace key is pressed', () => {
        config.points.push(new Vec2(100, 100));
        const handleBackspace = spyOn<any>(lineDrawer, 'removeLastPoint');
        lineDrawer['handleKeys'](lineDrawer['backspace']);
        expect(handleBackspace).toHaveBeenCalled();
    });

    it('should call correct function when Escape key is pressed', () => {
        config.points.push(new Vec2(100, 100));
        const handleEscape = spyOn<any>(lineDrawer, 'clearPoints');
        lineDrawer['handleKeys'](lineDrawer['escape']);
        expect(handleEscape).toHaveBeenCalled();
    });

    it('should call correct function when Shift key is pressed', () => {
        config.points.push(new Vec2(100, 100));
        const handleShift = spyOn<any>(lineDrawer, 'alignNextPoint');
        lineDrawer['handleKeys'](lineDrawer['shift']);
        expect(handleShift).toHaveBeenCalled();
    });

    it('should draw line path', () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
        const spy = spyOn(ctx, 'lineTo').and.callThrough();
        LineDrawer.drawLinePath(ctx, [mousePos, mousePos, mousePos]);
        expect(spy).toHaveBeenCalledTimes(2);
    });

    it('should draw filled line path', () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
        const spy = spyOn(LineDrawer, 'drawLinePath').and.callThrough();
        const actionSpy = spyOn(ctx, 'fill').and.callThrough();
        LineDrawer.drawFilledLinePath(ctx, [mousePos, mousePos]);
        expect(spy).toHaveBeenCalled();
        expect(actionSpy).toHaveBeenCalled();
    });

    it('should draw stroked line path', () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
        const spy = spyOn(LineDrawer, 'drawLinePath').and.callThrough();
        const actionSpy = spyOn(ctx, 'stroke').and.callThrough();
        LineDrawer.drawStrokedLinePath(ctx, [mousePos, mousePos]);
        expect(spy).toHaveBeenCalled();
        expect(actionSpy).toHaveBeenCalled();
    });

    it('should draw clipped line path', () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
        const spy = spyOn(LineDrawer, 'drawLinePath').and.callThrough();
        const actionSpy = spyOn(ctx, 'clip').and.callThrough();
        LineDrawer.drawClippedLinePath(ctx, [mousePos, mousePos]);
        expect(spy).toHaveBeenCalled();
        expect(actionSpy).toHaveBeenCalled();
    });

    it('should draw dashed line path', () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
        const spy = spyOn(LineDrawer, 'drawStrokedLinePath').and.callThrough();
        LineDrawer.drawDashedLinePath(ctx, [mousePos, mousePos]);
        expect(spy).toHaveBeenCalledTimes(2);
    });
});
