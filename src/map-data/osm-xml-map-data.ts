import { Geo } from '../db/model/geo/geo';
import { Location } from '../location';
import { OsmParser } from '../osm-parser';
import { Portal } from '../model/portal/portal';
import { MapData } from './map-data';

export class OsmXmlMapData implements MapData {
    private readonly parser: OsmParser;

    public constructor(filePath: string) {
        this.parser = new OsmParser(filePath);
    }

    public async init(): Promise<void> {
        await this.parser.read();
    }

    // eslint-disable-next-line @typescript-eslint/require-await
    public async getPortalsNear(
        location: Location,
        radiusMeters: number,
    ): Promise<readonly Portal[]> {
        const portals = this.parser.getPortals();

        return portals.filter(
            (portal) => Geo.distance(portal.location, location) <= radiusMeters,
        );
    }
}
