import { Location } from '../geo/location';
import { PortalType } from '../portal-type/portal-type';
import { PortalTypeData } from '../portal-type/portal-type-data';
import { PortalData } from './portal-data';

export class Portal implements PortalData {
    public readonly location: Location;
    public readonly name: string;
    public readonly type: PortalType;

    public constructor(location: Location, name: string, type: PortalType) {
        this.location = location;
        this.name = name;
        this.type = type;
    }

    public get id(): string {
        // TODO: use OSM id
        return `${this.latitude};${this.longitude};${this.name};${this.type.osmType}`;
    }

    public get latitude(): number {
        return this.location.latitude;
    }

    public get longitude(): number {
        return this.location.longitude;
    }

    public static fromData(
        data: PortalData,
        getPortalTypeData: () => PortalTypeData,
    ): Portal {
        return new Portal(
            new Location(data.latitude, data.longitude),
            data.name,
            PortalType.fromData(getPortalTypeData()),
        );
    }

    public toData(): PortalData {
        return {
            latitude: this.location.latitude,
            longitude: this.location.longitude,
            name: this.name,
        };
    }
}
