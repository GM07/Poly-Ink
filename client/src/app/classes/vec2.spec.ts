import { Vec2 } from './vec2';

// tslint:disable:no-magic-numbers

describe('Vec2', () => {
    it('should be equal', () => {
        const v1: Vec2 = new Vec2(2, 2);
        expect(v1.equals(new Vec2(2, 2))).toBe(true);
    });

    it('should not be equal', () => {
        const v1: Vec2 = new Vec2(2, 2);
        expect(v1.equals(new Vec2(1, 2))).toBe(false);
    });

    it('should add', () => {
        const v1: Vec2 = new Vec2(1, 3);
        expect(v1.add(new Vec2(4, 5))).toEqual(new Vec2(5, 8));
    });

    it('should add value', () => {
        const v1: Vec2 = new Vec2(1, 3);
        expect(v1.addValue(4)).toEqual(new Vec2(5, 7));
    });

    it('should substract', () => {
        const v1: Vec2 = new Vec2(1, 3);
        expect(v1.substract(new Vec2(3, 1))).toEqual(new Vec2(-2, 2));
    });

    it('should substract value', () => {
        const v1: Vec2 = new Vec2(1, 3);
        expect(v1.substractValue(1)).toEqual(new Vec2(0, 2));
    });

    it('should multiply scalar', () => {
        const v1: Vec2 = new Vec2(1, 3);
        expect(v1.scalar(2)).toEqual(new Vec2(2, 6));
    });

    it('should apply function', () => {
        const v1: Vec2 = new Vec2(-1, -3);
        expect(v1.apply(Math.abs)).toEqual(new Vec2(1, 3));
    });
});
