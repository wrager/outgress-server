import path from 'path';
import { Location } from '../src/location';
import { OsmParser } from '../src/osm-parser';
import { Portal } from '../src/portal';

describe('OsmParser', () => {
    let osmParser: OsmParser;

    test('Should throw on invalid file', async () => {
        await expect(async () =>
            new OsmParser(path.resolve(__dirname, 'NOT_EXISTING_FILE')).read(),
        ).rejects.toThrow();
        await expect(async () =>
            new OsmParser(__filename).read(),
        ).rejects.toThrow();
    });

    describe('', () => {
        beforeEach(async () => {
            osmParser = new OsmParser(path.resolve('data', 'map.osm'));
            await osmParser.read();
        });

        test('getPortals', () => {
            expect(osmParser.getPortals()).toEqual([
                new Portal(
                    new Location(56.6373714, 47.9005106),
                    'Царево-кокшайский кремль',
                    'castle',
                ),
                new Portal(
                    new Location(56.6364712, 47.8887489),
                    'Памяти жертв радиационных катастроф и аварий',
                    'memorial',
                ),
                new Portal(
                    new Location(56.6370914, 47.8890852),
                    'Павшим в локальных войнах',
                    'memorial',
                ),
                new Portal(
                    new Location(56.6314078, 47.9141778),
                    'Палантаю (И.С. Ключникову)',
                    'memorial',
                ),
            ]);
        });
    });
});
