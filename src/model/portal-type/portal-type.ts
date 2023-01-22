import { PortalTypeData } from './portal-type-data';

export class PortalType implements PortalTypeData {
    public readonly name: string;
    public readonly osmType: string;

    public constructor(name: string, osmType: string) {
        this.name = name;
        this.osmType = osmType;
    }

    public static fromData(data: PortalTypeData): PortalType {
        return new PortalType(data.name, data.osmType);
    }

    public toData(): PortalTypeData {
        return {
            name: this.name,
            osmType: this.osmType,
        };
    }
}
