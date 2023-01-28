import { Location } from './location';
import { Geo } from './geo';

describe('Geo', () => {
    test('move', () => {
        expect(
            Geo.move(new Location(53.3205556, 1.7297222), 11000, 225),
        ).toEqual(new Location(53.2505476, 1.6128096));
    });
});
