export class Type {
    public static assert<T>(expression: T): asserts expression {
        if (!expression) {
            throw Type.getAssertionError();
        }
    }

    public static defined<T>(expression: T): NonNullable<T> {
        if (expression === null || expression === undefined) {
            throw Type.getAssertionError();
        }

        return expression;
    }

    public static notNan(num: number): number {
        if (Number.isNaN(num)) {
            throw Type.getAssertionError();
        }

        return num;
    }

    private static getAssertionError(): Error {
        return new Error('Assertion error');
    }
}
