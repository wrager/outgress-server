export class MathUtil {
    public static average(values: readonly number[]): number | undefined {
        return values.length > 0
            ? MathUtil.sum(values) / values.length
            : undefined;
    }

    public static round(value: number, digits: number): number {
        const multiplier = 10 ** digits;

        return Math.round(value * multiplier) / multiplier;
    }

    private static sum(values: readonly number[]): number {
        return values.reduce(
            (previousValue, currentValue) => previousValue + currentValue,
            0,
        );
    }
}
