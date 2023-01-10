import { Type } from './type';

export class NumberUtil {
    public static tryParseFloat(str: string | null): number {
        return NumberUtil.tryParseNumber(str, parseFloat);
    }

    public static tryParseInt(string: string | null): number {
        return NumberUtil.tryParseNumber(string, (str: string): number =>
            parseInt(str, 10),
        );
    }

    private static tryParseNumber(
        string: string | null,
        parseFn: (string: string) => number,
    ): number {
        if (string === null) {
            throw new Error(`Could not parse number "${String(string)}".`);
        }

        return Type.notNan(parseFn(string));
    }
}
