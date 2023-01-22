import fetch from 'node-fetch';
import { GeoBox } from '../db/model/geo/geo-box';
import { Location } from '../location';
import { Portal } from '../model/portal/portal';
import { ArrayUtil } from '../util/array-util';
import { Type } from '../util/type';
import { MapData } from './map-data';
import { Way } from '../way';
import { PortalType } from '../model/portal-type/portal-type';

export class OverpassMapData implements MapData {
    private readonly url = 'https://overpass-api.de/api/interpreter';

    public async getPortalsNear(
        location: Location,
        radiusMeters: number,
    ): Promise<readonly Portal[]> {
        const box = GeoBox.tangential(location, radiusMeters);
        const boxString = [
            box.southWest.latitude,
            box.southWest.longitude,
            box.northEast.latitude,
            box.northEast.longitude,
        ].join(',');

        const objectTypes = [{ type: 'historic', exclude: 'citywalls' }];

        const query = `[out:json][timeout:25];
        ${objectTypes
            .map(
                (objectType) => `(
            way["${objectType.type}"](${boxString});
            relation["${objectType.type}"](${boxString});
          );`,
            )
            .join('\n')}
        out body;
        >;
        out skel qt;`;

        const result = await this.postForm({
            data: query,
        });

        const elements = result.elements as {
            type: string;
            id: number;
            nodes?: number[];
            tags?: { [tagName: string]: string | undefined; name?: string };
            lat?: number;
            lon?: number;
        }[];

        const wayDefinitions = elements.filter(
            (element) => element.type === 'way',
        );
        const portals = ArrayUtil.defined(
            wayDefinitions.map((wayDefinition) => {
                if (!wayDefinition.tags || !wayDefinition.tags.name) {
                    return undefined;
                }

                const tagNames = Object.keys(wayDefinition.tags);
                const objectType = objectTypes.find((type) =>
                    tagNames.includes(type.type),
                );
                Type.assert(objectType);

                const wayType = objectType.type;
                const waySubtype = wayDefinition.tags[wayType];
                Type.assert(waySubtype);

                if (objectType.exclude.includes(waySubtype)) {
                    return undefined;
                }

                const wayNodes = ArrayUtil.defined(
                    Type.defined(wayDefinition.nodes).map((nodeId: number) =>
                        elements.find((element) => element.id === nodeId),
                    ),
                );

                const wayLocations = wayNodes?.map(
                    (wayNode) =>
                        new Location(
                            Type.defined(wayNode.lat),
                            Type.defined(wayNode.lon),
                        ),
                );

                return new Portal(
                    new Way(wayLocations).center,
                    wayDefinition.tags.name,
                    new PortalType(waySubtype.toUpperCase(), waySubtype),
                );
            }),
        );

        return portals;
    }

    private async postForm(data: {
        [name: string]: string;
    }): Promise<Record<string, unknown>> {
        const params = new URLSearchParams();
        Object.entries(data).forEach(([name, value]) => {
            params.append(name, value);
        });

        const result = await fetch(this.url, {
            headers: {
                'content-type':
                    'application/x-www-form-urlencoded; charset=UTF-8',
            },
            body: params,
            method: 'POST',
        });

        return result.json();
    }
}
