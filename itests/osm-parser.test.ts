import path from 'path';
import { Location } from '../src/location';
import { OsmParser } from '../src/osm-parser';
import { Portal } from '../src/model/portal/portal';
import { PortalType } from '../src/model/portal-type/portal-type';

describe('OsmParser itests', () => {
    let osmParser: OsmParser;

    test('should throw on invalid file', async () => {
        await expect(async () =>
            new OsmParser(path.resolve(__dirname, 'NOT_EXISTING_FILE')).read(),
        ).rejects.toThrow();
        await expect(async () =>
            new OsmParser(__filename).read(),
        ).rejects.toThrow();
    });

    describe('should parse the valid file', () => {
        beforeEach(async () => {
            osmParser = new OsmParser(path.resolve('data', 'map.osm'));
            await osmParser.read();
        });

        test('getPortals', () => {
            expect(osmParser.getPortals()).toEqual([
                new Portal(
                    new Location(56.6373714, 47.9005106),
                    'Царево-кокшайский кремль',
                    new PortalType('Castle', 'castle'),
                ),
                new Portal(
                    new Location(56.6364712, 47.8887489),
                    'Памяти жертв радиационных катастроф и аварий',
                    new PortalType('Memorial', 'memorial'),
                ),
                new Portal(
                    new Location(56.6370914, 47.8890852),
                    'Павшим в локальных войнах',
                    new PortalType('Memorial', 'memorial'),
                ),
                new Portal(
                    new Location(56.6314078, 47.9141778),
                    'Палантаю (И.С. Ключникову)',
                    new PortalType('Memorial', 'memorial'),
                ),
            ]);
        });
    });
});
