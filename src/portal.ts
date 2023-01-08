import { Coordinates } from './coordinates';

export class Portal {
    public readonly coordinates: Coordinates;
    public readonly name: string;
    public readonly type: string;

    public constructor(coordinates: Coordinates, name: string, type: string) {
        this.coordinates = coordinates;
        this.name = name;
        this.type = type;
    }
}
