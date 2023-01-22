export class StringUtil {
    public static capitalize(string: string): string {
        if (string.length === 0) {
            return '';
        }

        return (
            string.charAt(0).toLocaleUpperCase() + string.slice(1).toLowerCase()
        );
    }
}
