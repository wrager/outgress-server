import { MathUtil } from './math-util';

describe('MathUtil', () => {
    test('average', () => {
        expect(MathUtil.average(0)).toBe(0);
        expect(MathUtil.average(-1, 0)).toBe(-0.5);
        expect(MathUtil.average(1, 1, 1)).toBe(1);
        expect(MathUtil.average(1.23, 4.567, 8)).toBe(4.599);
    });

    describe('round', () => {
        test('should return `value` if it could not be rounded', () => {
            expect(MathUtil.round(NaN, 2)).toBe(NaN);
            expect(MathUtil.round(Infinity, 2)).toBe(Infinity);
            expect(MathUtil.round(-Infinity, 2)).toBe(-Infinity);
        });

        test('should throw on invalid `digits` argument', () => {
            [-1, 0.1, -0.1].forEach((invalidDigitsArgument) => {
                expect(() =>
                    MathUtil.round(1.2345678, invalidDigitsArgument),
                ).toThrow('Invalid "digits" argument.');
            });
        });

        test('should round the passed value with the `digits` precision', () => {
            expect(MathUtil.round(1.2345678, 0)).toBe(1);
            expect(MathUtil.round(1.234567, 3)).toBe(1.235);
            expect(MathUtil.round(1234.5, 0)).toBe(1235);
            expect(MathUtil.round(-1234.5, 0)).toBe(-1234);
            expect(MathUtil.round(1234.565, 2)).toBe(1234.57);
            expect(MathUtil.round(-1234.565, 2)).toBe(-1234.56);
            expect(MathUtil.round(1234.567, 2)).toBe(1234.57);
            expect(MathUtil.round(-1234.567, 2)).toBe(-1234.57);
        });
    });

    test('sum', () => {
        expect(MathUtil.sum()).toBe(0);
        expect(MathUtil.sum(0, 0, 0)).toBe(0);
        expect(MathUtil.sum(-100, 100)).toBe(0);
        expect(MathUtil.sum(-100, -100, -100, -100, 100)).toBe(-300);
        expect(MathUtil.sum(1.23, 4.56, 7)).toBe(12.79);
    });
});
