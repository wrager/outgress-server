export class Location {
    public static readonly precision = 7;

    public readonly latitude: number;
    public readonly longitude: number;

    public constructor(latitude: number, longitude: number) {
        this.latitude = latitude;
        this.longitude = longitude;
    }
}
