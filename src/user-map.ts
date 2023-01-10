import { Portal } from './portal';

export class UserMap {
    public readonly portals: readonly Portal[];

    public constructor(portals: readonly Portal[]) {
        this.portals = portals;
    }
}
