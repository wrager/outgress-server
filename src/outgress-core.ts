import { Location } from './location';
import { MapData } from './map-data/map-data';
import { UserMap } from './user-map';

export class OutgressCore {
    private static readonly visibilityDistanceMeters = 1000;

    private readonly mapData: MapData;

    public constructor(mapData: MapData) {
        this.mapData = mapData;
    }

    public async getUserMap(location: Location): Promise<UserMap> {
        return new UserMap(
            await this.mapData.getPortalsNear(
                location,
                OutgressCore.visibilityDistanceMeters,
            ),
        );
    }
}
