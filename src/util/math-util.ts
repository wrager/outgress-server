export class MathUtil {
    public static average(value1: number, ...rest: readonly number[]): number {
        return MathUtil.sum(value1, ...rest) / (rest.length + 1);
    }

    public static round(value: number, digits: number): number {
        if (!Number.isFinite(value)) {
            return value;
        }
        if (digits < 0 || !Number.isSafeInteger(digits)) {
            throw new Error('Invalid "digits" argument.');
        }

        const multiplier = 10 ** digits;

        return Math.round(value * multiplier) / multiplier;
    }

    public static sum(...values: readonly number[]): number {
        return values.reduce(
            (previousValue, currentValue) => previousValue + currentValue,
            0,
        );
    }
}
