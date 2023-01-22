export class NumberUtil {
    public static tryParseFloat(string: string | null): number {
        return NumberUtil.tryParseNumber(
            string,
            `The string "${String(string)}" is not a float number.`,
        );
    }

    public static tryParseInteger(string: string | null): number {
        const message = `The string "${String(
            string,
        )}" is not an integer number.`;

        const result = NumberUtil.tryParseNumber(string, message);

        if (!Number.isInteger(result)) {
            throw new Error(message);
        }

        return result;
    }

    private static tryParseNumber(
        string: string | null,
        message: string,
    ): number {
        if (!string) {
            throw new Error(message);
        }

        const result = Number(string);
        if (Number.isNaN(result) || !Number.isFinite(result)) {
            throw new Error(message);
        }

        return result;
    }
}
