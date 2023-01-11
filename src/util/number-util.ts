export class NumberUtil {
    public static tryParseFloat(string: string | null): number {
        return NumberUtil.tryParseNumber(
            string,
            parseFloat,
            `The string "${String(string)}" is not a float number.`,
        );
    }

    public static tryParseInteger(string: string | null): number {
        const message = `The string "${String(
            string,
        )}" is not an integer number.`;

        const result = NumberUtil.tryParseNumber(string, parseFloat, message);

        if (!Number.isInteger(result)) {
            throw new Error(message);
        }

        return result;
    }

    private static tryParseNumber(
        string: string | null,
        parseFn: (string: string) => number,
        message: string,
    ): number {
        if (string === null) {
            throw new Error(message);
        }

        const result = parseFn(string);
        if (Number.isNaN(result) || !Number.isFinite(result)) {
            throw new Error(message);
        }

        return result;
    }
}
