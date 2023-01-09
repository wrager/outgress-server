import { Location } from './location';

export class Portal {
    public readonly location: Location;
    public readonly name: string;
    public readonly type: string;

    public constructor(location: Location, name: string, type: string) {
        this.location = location;
        this.name = name;
        this.type = type;
    }
}
