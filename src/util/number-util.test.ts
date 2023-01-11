import { NumberUtil } from './number-util';

describe('NumberUtil', () => {
    describe('tryParseFloat', () => {
        test('should throw on invalid float number', () => {
            expect(() => NumberUtil.tryParseFloat('')).toThrow(
                'The string "" is not a float number.',
            );
            expect(() => NumberUtil.tryParseFloat('.')).toThrow(
                'The string "." is not a float number.',
            );
            expect(() => NumberUtil.tryParseFloat('a')).toThrow(
                'The string "a" is not a float number.',
            );
            expect(() => NumberUtil.tryParseFloat('-')).toThrow(
                'The string "-" is not a float number.',
            );
            expect(() => NumberUtil.tryParseFloat('Infinity')).toThrow(
                'The string "Infinity" is not a float number.',
            );
            expect(() => NumberUtil.tryParseFloat('-Infinity')).toThrow(
                'The string "-Infinity" is not a float number.',
            );
            expect(() => NumberUtil.tryParseFloat('NaN')).toThrow(
                'The string "NaN" is not a float number.',
            );
            expect(() => NumberUtil.tryParseFloat('undefined')).toThrow(
                'The string "undefined" is not a float number.',
            );
        });

        test('should parse the valid float number', () => {
            expect(NumberUtil.tryParseFloat('0')).toBe(0);
            expect(NumberUtil.tryParseFloat('1')).toBe(1);
            expect(NumberUtil.tryParseFloat('-1')).toBe(-1);
            expect(NumberUtil.tryParseFloat('0.1')).toBe(0.1);
            expect(NumberUtil.tryParseFloat('-0.1')).toBe(-0.1);
            expect(NumberUtil.tryParseFloat('.1')).toBe(0.1);
            expect(NumberUtil.tryParseFloat('-.1')).toBe(-0.1);
            expect(NumberUtil.tryParseFloat('1.23456789')).toBe(1.23456789);
            expect(NumberUtil.tryParseFloat('-1.23456789')).toBe(-1.23456789);
        });
    });

    describe('tryParseInteger', () => {
        test('should throw on invalid integer number', () => {
            expect(() => NumberUtil.tryParseInteger('')).toThrow(
                'The string "" is not an integer number.',
            );
            expect(() => NumberUtil.tryParseInteger('.')).toThrow(
                'The string "." is not an integer number.',
            );
            expect(() => NumberUtil.tryParseInteger('a')).toThrow(
                'The string "a" is not an integer number.',
            );
            expect(() => NumberUtil.tryParseInteger('-')).toThrow(
                'The string "-" is not an integer number.',
            );
            expect(() => NumberUtil.tryParseInteger('1.1')).toThrow(
                'The string "1.1" is not an integer number.',
            );
            expect(() => NumberUtil.tryParseInteger('-1.1')).toThrow(
                'The string "-1.1" is not an integer number.',
            );
            expect(() => NumberUtil.tryParseInteger('.1')).toThrow(
                'The string ".1" is not an integer number.',
            );
            expect(() => NumberUtil.tryParseInteger('-.1')).toThrow(
                'The string "-.1" is not an integer number.',
            );
            expect(() => NumberUtil.tryParseInteger('Infinity')).toThrow(
                'The string "Infinity" is not an integer number.',
            );
            expect(() => NumberUtil.tryParseInteger('-Infinity')).toThrow(
                'The string "-Infinity" is not an integer number.',
            );
            expect(() => NumberUtil.tryParseInteger('NaN')).toThrow(
                'The string "NaN" is not an integer number.',
            );
            expect(() => NumberUtil.tryParseInteger('undefined')).toThrow(
                'The string "undefined" is not an integer number.',
            );
        });

        test('should parse the valid integer number', () => {
            expect(NumberUtil.tryParseInteger('0')).toBe(0);
            expect(NumberUtil.tryParseInteger('1')).toBe(1);
            expect(NumberUtil.tryParseInteger('-1')).toBe(-1);
            expect(NumberUtil.tryParseInteger('123456789')).toBe(123456789);
            expect(NumberUtil.tryParseInteger('-123456789')).toBe(-123456789);
        });
    });
});
