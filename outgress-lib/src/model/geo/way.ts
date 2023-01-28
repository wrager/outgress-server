import { Location } from 'outgress-lib/model/geo/location';
import { MathUtil } from 'outgress-lib/util/math-util';
import { Type } from 'outgress-lib/util/type';

export class Way {
    public readonly locations: readonly Location[];

    public constructor(locations: readonly Location[]) {
        Type.assert(locations.length > 0);

        this.locations = locations;
    }

    public get center(): Location {
        const latitudes = this.locations.map((location) => location.latitude);
        const centerLatitude = MathUtil.round(
            MathUtil.average(Math.min(...latitudes), Math.max(...latitudes)),
            Location.precision,
        );

        const longitudes = this.locations.map((location) => location.longitude);
        const centerLongitude = MathUtil.round(
            MathUtil.average(Math.min(...longitudes), Math.max(...longitudes)),
            Location.precision,
        );

        return new Location(centerLatitude, centerLongitude);
    }
}
