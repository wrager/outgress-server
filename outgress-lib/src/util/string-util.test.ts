import { StringUtil } from './string-util';

describe('StringUtil', () => {
    test('capitalize', () => {
        expect(StringUtil.capitalize('')).toBe('');
        expect(StringUtil.capitalize(' ')).toBe(' ');
        expect(StringUtil.capitalize('1')).toBe('1');

        expect(StringUtil.capitalize('a')).toBe('A');
        expect(StringUtil.capitalize('a b c')).toBe('A b c');
        expect(StringUtil.capitalize('a b c')).toBe('A b c');
        expect(StringUtil.capitalize('где')).toBe('Где');
    });
});
