export class MathUtil {
    public static average(values: readonly number[]): number | undefined {
        return values.length > 0
            ? MathUtil.sum(values) / values.length
            : undefined;
    }

    public static round(value: number, digits: number): number {
        if (!Number.isFinite(value)) {
            throw new Error('Invalid "value" argument.');
        }
        if (digits < 0 || !Number.isSafeInteger(digits)) {
            throw new Error('Invalid "digits" argument.');
        }

        const multiplier = 10 ** digits;

        return Math.round(value * multiplier) / multiplier;
    }

    public static sum(values: readonly number[]): number {
        return values.reduce(
            (previousValue, currentValue) => previousValue + currentValue,
            0,
        );
    }
}
