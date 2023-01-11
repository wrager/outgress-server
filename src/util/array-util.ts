export class ArrayUtil {
    public static defined<T>(arr: readonly T[]): Exclude<T, undefined>[] {
        return arr.filter((element) => element !== undefined) as Exclude<
            T,
            undefined
        >[];
    }

    public static intersection<T>(arr1: readonly T[], arr2: readonly T[]): T[] {
        return arr1.filter((element1) => arr2.includes(element1));
    }
}
