import { Type } from './type';

describe('Type', () => {
    describe('assert', () => {
        test('should throw on falsy statement', () => {
            expect(() => {
                Type.assert(false);
            }).toThrow('Assertion error');
            expect(() => {
                Type.assert(null);
            }).toThrow('Assertion error');
            expect(() => {
                Type.assert(undefined);
            }).toThrow('Assertion error');
            expect(() => {
                Type.assert(0);
            }).toThrow('Assertion error');
            expect(() => {
                Type.assert(NaN);
            }).toThrow('Assertion error');
        });

        test('should not throw on truthy statement', () => {
            Type.assert(1);
            Type.assert(Infinity);
            Type.assert(-Infinity);
            Type.assert(true);
            Type.assert([]);
            Type.assert([0]);
        });

        test('should assert that the type of the value became defined', () => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const functionThatAcceptsNumber = (value: number): void => {};

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const value: number | null | undefined = 1 as any;
            Type.assert(value);
            functionThatAcceptsNumber(value);
        });

        test('should assert that the type of the boolean value became only `true`', () => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const functionThatAcceptsTrue = (value: true): void => {};

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const value: boolean = true as any;
            Type.assert(value);
            functionThatAcceptsTrue(value);
        });
    });

    describe('defined', () => {
        test('should throw on `null` or `undefined`', () => {
            expect(() => {
                Type.defined(null);
            }).toThrow('Assertion error');
            expect(() => {
                Type.defined(undefined);
            }).toThrow('Assertion error');
        });

        test('should return the passed defined value', () => {
            expect(Type.defined(false)).toBe(false);
            expect(Type.defined(NaN)).toBe(NaN);
            expect(Type.defined(Infinity)).toBe(Infinity);
            expect(Type.defined(-Infinity)).toBe(-Infinity);
            expect(Type.defined(0)).toBe(0);
            expect(Type.defined(1)).toBe(1);
            expect(Type.defined([])).toEqual([]);
            expect(Type.defined([0])).toEqual([0]);
        });
    });

    describe('notNan', () => {
        test('should throw on `NaN`', () => {
            expect(() => {
                Type.notNan(NaN);
            }).toThrow('Assertion error');
        });

        test('should not throw on not NaN value', () => {
            expect(Type.notNan(Infinity)).toBe(Infinity);
            expect(Type.notNan(-Infinity)).toBe(-Infinity);
            expect(Type.notNan(0)).toBe(0);
            expect(Type.notNan(1)).toBe(1);
            expect(Type.notNan(-1)).toBe(-1);
        });
    });
});
