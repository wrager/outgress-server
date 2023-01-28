import { Location } from 'outgress-lib/model/geo/location';
import { Portal } from 'outgress-lib/model/portal/portal';

export abstract class MapDataSource {
    public abstract getPortalsNear(
        location: Location,
        radiusMeters: number,
    ): Promise<readonly Portal[]>;
}
