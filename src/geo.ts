import { Location } from './location';

export class Geo {
    private static readonly earthRadiusMeters = 6371000;

    /**
     * Distance in meters between two locations.
     * @returns Distance in meters.
     */
    public static distance(location1: Location, location2: Location): number {
        const f1 = (location1.latitude * Math.PI) / 180;
        const f2 = (location2.latitude * Math.PI) / 180;
        const dF = ((location2.latitude - location1.latitude) * Math.PI) / 180;
        const dL =
            ((location2.longitude - location1.longitude) * Math.PI) / 180;

        const a =
            Math.sin(dF / 2) * Math.sin(dF / 2) +
            Math.cos(f1) * Math.cos(f2) * Math.sin(dL / 2) * Math.sin(dL / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return Geo.earthRadiusMeters * c;
    }
}
