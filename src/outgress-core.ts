import { Location } from './location';
import { MapData } from './map-data/map-data';
import { UserMap } from './user-map';

export class OutgressCore {
    private static readonly visibilityDistanceMeters = 100;

    private readonly mapData: MapData;

    public constructor(mapData: MapData) {
        this.mapData = mapData;
    }

    public getUserMap(location: Location): UserMap {
        return new UserMap(
            this.mapData.getPortalsNear(
                location,
                OutgressCore.visibilityDistanceMeters,
            ),
        );
    }
}
