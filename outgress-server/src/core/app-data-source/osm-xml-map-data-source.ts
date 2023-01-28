import { Geo } from 'outgress-lib/model/geo/geo';
import { Location } from 'outgress-lib/model/geo/location';
import { Portal } from 'outgress-lib/model/portal/portal';
import { OsmParser } from '../../osm-parser';
import { MapDataSource } from './map-data-source';

export class OsmXmlMapDataSource implements MapDataSource {
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
