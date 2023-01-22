import { Location } from '../../location';
import { Portal } from '../../model/portal/portal';

export abstract class MapDataSource {
    public abstract getPortalsNear(
        location: Location,
        radiusMeters: number,
    ): Promise<readonly Portal[]>;
}
