import { Location } from '../../../location';
import { MathUtil } from '../../../util/math-util';

export class Geo {
    private static readonly earthRadiusMeters = 6371000;

    /**
     * Distance in meters between two locations.
     * @returns Distance in meters.
     */
    public static distance(location1: Location, location2: Location): number {
        const f1 = location1.latitudeRadians;
        const f2 = location2.latitudeRadians;
        const dF = location2.latitudeRadians - location1.latitudeRadians;
        const dL = location2.longitudeRadians - location1.longitudeRadians;

        const a =
            Math.sin(dF / 2) * Math.sin(dF / 2) +
            Math.cos(f1) * Math.cos(f2) * Math.sin(dL / 2) * Math.sin(dL / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return Geo.earthRadiusMeters * c;
    }

    public static move(
        location: Location,
        distanceMeters: number,
        bearing: number,
    ): Location {
        const bearingRadians = MathUtil.degreesToRadians(bearing);
        const latitudeRadians1 = location.latitudeRadians;
        const longitudeRadians1 = location.longitudeRadians;

        const latitudeRadians2 = Math.asin(
            Math.sin(latitudeRadians1) *
                Math.cos(distanceMeters / Geo.earthRadiusMeters) +
                Math.cos(latitudeRadians1) *
                    Math.sin(distanceMeters / Geo.earthRadiusMeters) *
                    Math.cos(bearingRadians),
        );
        const longitudeRadians2 =
            longitudeRadians1 +
            Math.atan2(
                Math.sin(bearingRadians) *
                    Math.sin(distanceMeters / Geo.earthRadiusMeters) *
                    Math.cos(latitudeRadians1),
                Math.cos(distanceMeters / Geo.earthRadiusMeters) -
                    Math.sin(latitudeRadians1) * Math.sin(latitudeRadians2),
            );

        return Location.fromRadians(latitudeRadians2, longitudeRadians2);
    }
}
