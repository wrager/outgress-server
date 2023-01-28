import { MathUtil } from 'outgress-lib/util/math-util';

export class Location {
    public static readonly precision = 7;

    public readonly latitude: number;
    public readonly longitude: number;

    public constructor(latitude: number, longitude: number) {
        this.latitude = MathUtil.round(latitude, Location.precision);
        this.longitude = MathUtil.round(longitude, Location.precision);
    }

    public get latitudeRadians(): number {
        return MathUtil.degreesToRadians(this.latitude);
    }

    public get longitudeRadians(): number {
        return MathUtil.degreesToRadians(this.longitude);
    }

    public static fromRadians(
        latitudeRadians: number,
        longitudeRadians: number,
    ): Location {
        return new Location(
            MathUtil.radiansToDegrees(latitudeRadians),
            MathUtil.radiansToDegrees(longitudeRadians),
        );
    }
}
