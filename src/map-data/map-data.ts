import { Location } from '../location';
import { Portal } from '../portal';

export interface MapData {
    getPortalsNear(location: Location, radiusMeters: number): readonly Portal[];
}
