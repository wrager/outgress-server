import { ArrayUtil } from './array-util';

describe('ArrayUtil', () => {
    test('defined', () => {
        expect(ArrayUtil.defined([])).toEqual([]);
        expect(ArrayUtil.defined([undefined])).toEqual([]);
        expect(ArrayUtil.defined([0])).toEqual([0]);
        expect(ArrayUtil.defined([0, undefined, false, null])).toEqual([
            0,
            false,
            null,
        ]);
    });
});
