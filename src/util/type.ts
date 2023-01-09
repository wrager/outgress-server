export class Type {
    public static assertDefined<T>(expression: T): NonNullable<T> {
        if (expression === null || expression === undefined) {
            throw new Error('Assert defined: error');
        }

        return expression;
    }

    public static assertNotNan(num: number): number {
        if (Number.isNaN(num)) {
            throw new Error('Assert not NaN: error');
        }

        return num;
    }
}
