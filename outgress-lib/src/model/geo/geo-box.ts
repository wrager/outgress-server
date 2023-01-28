import { Location } from './location';
import { Geo } from './geo';

export class GeoBox {
    public readonly northEast: Location;
    public readonly southWest: Location;

    public constructor(northEast: Location, southWest: Location) {
        this.northEast = northEast;
        this.southWest = southWest;
    }

    public static tangential(location: Location, radiusMeters: number): GeoBox {
        const tangentialCircleRadius = Math.sqrt(2 * radiusMeters ** 2);

        const northEast = Geo.move(location, tangentialCircleRadius, 45);
        const southWest = Geo.move(location, tangentialCircleRadius, 225);

        return new GeoBox(northEast, southWest);
    }
}
