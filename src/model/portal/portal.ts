import { Location } from '../../location';
import { PortalType } from '../portal-type/portal-type';
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

    public get latitude(): number {
        return this.location.latitude;
    }

    public get longitude(): number {
        return this.location.longitude;
    }

    public static fromData(
        data: PortalData,
        getPortalType: () => PortalType,
    ): Portal {
        return new Portal(
            new Location(data.latitude, data.longitude),
            data.name,
            getPortalType(),
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
