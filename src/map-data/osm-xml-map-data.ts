import { Geo } from '../geo';
import { Location } from '../location';
import { OsmParser } from '../osm-parser';
import { Portal } from '../portal';
import { MapData } from './map-data';

export class OsmXmlMapData implements MapData {
    private readonly parser: OsmParser;

    public constructor(filePath: string) {
        this.parser = new OsmParser(filePath);
    }

    public async init(): Promise<void> {
        await this.parser.read();
    }

    public getPortalsNear(
        location: Location,
        radiusMeters: number,
    ): readonly Portal[] {
        const portals = this.parser.getPortals();

        return portals.filter(
            (portal) => Geo.distance(portal.location, location) <= radiusMeters,
        );
    }
}
