import fs from 'fs';
import { PortalData } from 'outgress-lib/model/portal/portal-data';
import { Database } from 'outgress-server/db/database';
import { DbInitializer } from 'outgress-server/db/db-initializer';
import path from 'path';

describe('DbInitializer integration tests', () => {
    const tempDir = './itests/temp_db/DbInitializer';

    const fillDatabase = async (fileName: string): Promise<void> => {
        const db = new Database(`sqlite:${fileName}`);
        await db.initEmptyDb();

        const portalType1 = await db.modelClasses.portalType.fromData({
            name: 'name1',
            osmType: 'osmType1',
        });
        const portalType2 = await db.modelClasses.portalType.fromData({
            name: 'name2',
            osmType: 'osmType2',
        });
        const portalType3 = await db.modelClasses.portalType.fromData({
            name: 'name3',
            osmType: 'osmType3',
        });

        await db.modelClasses.portal.fromData(
            {
                latitude: 1.234,
                longitude: -1.222,
                name: 'Portal 1',
            },
            portalType2.id,
        );
        await db.modelClasses.portal.fromData(
            {
                latitude: 2.234,
                longitude: -2.222,
                name: 'Portal 2',
            },
            portalType1.id,
        );
        await db.modelClasses.portal.fromData(
            {
                latitude: 3.234,
                longitude: -3.222,
                name: 'Portal 3',
            },
            portalType3.id,
        );
        await db.modelClasses.portal.fromData(
            {
                latitude: 4.234,
                longitude: -4.222,
                name: 'Portal 4',
            },
            portalType2.id,
        );

        await db.close();
    };

    beforeAll(() => {
        if (fs.existsSync(tempDir)) {
            fs.readdirSync(tempDir).forEach((fileName) => {
                fs.unlinkSync(path.resolve(tempDir, fileName));
            });
        } else {
            fs.mkdirSync(tempDir);
        }
    });

    describe('init', () => {
        test('on empty database', async () => {
            const fileName = `${tempDir}/init_onEmptyDatabase.db`;
            const db = new Database(`sqlite:${fileName}`);
            await db.initEmptyDb();
            const dbInitializer = new DbInitializer(db);

            await dbInitializer.init();

            await db.close();
        });

        test('on existed database', async () => {
            const fileName = `${tempDir}/init_onExistedDatabase.db`;
            await fillDatabase(fileName);
            const db = new Database(`sqlite:${fileName}`);
            await db.initEmptyDb();
            const dbInitializer = new DbInitializer(db);

            await dbInitializer.init();

            await db.close();
        });
    });

    describe('insertPortals', () => {
        test('on empty database', async () => {
            const fileName = `${tempDir}/insertPortals_onEmptyDatabase.db`;
            const db = new Database(`sqlite:${fileName}`);
            await db.initEmptyDb();
            const dbInitializer = new DbInitializer(db);
            await dbInitializer.init();

            expect(await db.selectAllPortals()).toEqual([]);
            expect(await db.selectAllPortalTypes()).toEqual([]);

            interface PortalDataWithType extends PortalData {
                type: string;
            }
            const portalsData: PortalDataWithType[] = [
                {
                    latitude: 1,
                    longitude: 11,
                    name: '1111',
                    type: 'type1',
                },
                {
                    latitude: 1,
                    longitude: 11,
                    name: '1111',
                    type: 'type1',
                },
                {
                    latitude: 1,
                    longitude: 11,
                    name: '1111',
                    type: 'type2',
                },
                {
                    latitude: 1,
                    longitude: 11,
                    name: '2222',
                    type: 'type2',
                },
                {
                    latitude: 3,
                    longitude: 3,
                    name: '333',
                    type: 'type1',
                },
            ];
            await dbInitializer.insertPortals(
                portalsData,
                (portalData) => (portalData as PortalDataWithType).type,
            );

            const mockedDate = new Date();
            expect(
                (await db.selectAllPortalTypes()).map((portalTypeModel) => ({
                    ...portalTypeModel.toJSON(),
                    createdAt: mockedDate,
                    updatedAt: mockedDate,
                })),
            ).toEqual([
                {
                    id: 1,
                    name: 'Type1',
                    osmType: 'type1',
                    createdAt: mockedDate,
                    updatedAt: mockedDate,
                },
                {
                    id: 2,
                    name: 'Type2',
                    osmType: 'type2',
                    createdAt: mockedDate,
                    updatedAt: mockedDate,
                },
            ]);
            expect(
                (await db.selectAllPortals()).map((portalTypeModel) => ({
                    ...portalTypeModel.toJSON(),
                    createdAt: mockedDate,
                    updatedAt: mockedDate,
                })),
            ).toEqual([
                {
                    id: 1,
                    latitude: 1,
                    longitude: 11,
                    name: '1111',
                    portalType: 1,
                    createdAt: mockedDate,
                    updatedAt: mockedDate,
                },
                {
                    id: 2,
                    latitude: 1,
                    longitude: 11,
                    name: '1111',
                    portalType: 1,
                    createdAt: mockedDate,
                    updatedAt: mockedDate,
                },
                {
                    id: 3,
                    latitude: 1,
                    longitude: 11,
                    name: '1111',
                    portalType: 2,
                    createdAt: mockedDate,
                    updatedAt: mockedDate,
                },
                {
                    id: 4,
                    latitude: 1,
                    longitude: 11,
                    name: '2222',
                    portalType: 2,
                    createdAt: mockedDate,
                    updatedAt: mockedDate,
                },
                {
                    id: 5,
                    latitude: 3,
                    longitude: 3,
                    name: '333',
                    portalType: 1,
                    createdAt: mockedDate,
                    updatedAt: mockedDate,
                },
            ]);

            await db.close();
        });

        test('on existed database', async () => {
            const fileName = `${tempDir}/insertPortals_onExistedDatabase.db`;
            await fillDatabase(fileName);
            const db = new Database(`sqlite:${fileName}`);
            await db.initDb();
            const dbInitializer = new DbInitializer(db);
            await dbInitializer.init();

            const mockedDate = new Date();
            expect(
                (await db.selectAllPortalTypes()).map((portalTypeModel) => ({
                    ...portalTypeModel.toJSON(),
                    createdAt: mockedDate,
                    updatedAt: mockedDate,
                })),
            ).toEqual([
                {
                    id: 1,
                    name: 'name1',
                    osmType: 'osmType1',
                    createdAt: mockedDate,
                    updatedAt: mockedDate,
                },
                {
                    id: 2,
                    name: 'name2',
                    osmType: 'osmType2',
                    createdAt: mockedDate,
                    updatedAt: mockedDate,
                },
                {
                    id: 3,
                    name: 'name3',
                    osmType: 'osmType3',
                    createdAt: mockedDate,
                    updatedAt: mockedDate,
                },
            ]);
            expect((await db.selectAllPortalTypes()).length).toBeGreaterThan(0);

            interface PortalDataWithType extends PortalData {
                type: string;
            }
            const portalsData: PortalDataWithType[] = [
                {
                    latitude: 1,
                    longitude: 11,
                    name: '1111',
                    type: 'type1',
                },
                {
                    latitude: 1,
                    longitude: 11,
                    name: '1111',
                    type: 'osmType1',
                },
                {
                    latitude: 1,
                    longitude: 11,
                    name: '1111',
                    type: 'type1',
                },
            ];
            await dbInitializer.insertPortals(
                portalsData,
                (portalData) => (portalData as PortalDataWithType).type,
            );

            expect(
                (await db.selectAllPortalTypes()).map((portalTypeModel) => ({
                    ...portalTypeModel.toJSON(),
                    createdAt: mockedDate,
                    updatedAt: mockedDate,
                })),
            ).toEqual([
                {
                    id: 1,
                    name: 'name1',
                    osmType: 'osmType1',
                    createdAt: mockedDate,
                    updatedAt: mockedDate,
                },
                {
                    id: 2,
                    name: 'name2',
                    osmType: 'osmType2',
                    createdAt: mockedDate,
                    updatedAt: mockedDate,
                },
                {
                    id: 3,
                    name: 'name3',
                    osmType: 'osmType3',
                    createdAt: mockedDate,
                    updatedAt: mockedDate,
                },
                {
                    id: 4,
                    name: 'Type1',
                    osmType: 'type1',
                    createdAt: mockedDate,
                    updatedAt: mockedDate,
                },
            ]);
            expect(
                (await db.selectAllPortals()).map((portalTypeModel) => ({
                    ...portalTypeModel.toJSON(),
                    createdAt: mockedDate,
                    updatedAt: mockedDate,
                })),
            ).toEqual([
                {
                    id: 1,
                    latitude: 1.234,
                    longitude: -1.222,
                    name: 'Portal 1',
                    portalType: 2,
                    createdAt: mockedDate,
                    updatedAt: mockedDate,
                },
                {
                    id: 2,
                    latitude: 2.234,
                    longitude: -2.222,
                    name: 'Portal 2',
                    portalType: 1,
                    createdAt: mockedDate,
                    updatedAt: mockedDate,
                },
                {
                    id: 3,
                    latitude: 3.234,
                    longitude: -3.222,
                    name: 'Portal 3',
                    portalType: 3,
                    createdAt: mockedDate,
                    updatedAt: mockedDate,
                },
                {
                    id: 4,
                    latitude: 4.234,
                    longitude: -4.222,
                    name: 'Portal 4',
                    portalType: 2,
                    createdAt: mockedDate,
                    updatedAt: mockedDate,
                },
                {
                    id: 5,
                    latitude: 1,
                    longitude: 11,
                    name: '1111',
                    portalType: 4,
                    createdAt: mockedDate,
                    updatedAt: mockedDate,
                },
                {
                    id: 6,
                    latitude: 1,
                    longitude: 11,
                    name: '1111',
                    portalType: 1,
                    createdAt: mockedDate,
                    updatedAt: mockedDate,
                },
                {
                    id: 7,
                    latitude: 1,
                    longitude: 11,
                    name: '1111',
                    portalType: 4,
                    createdAt: mockedDate,
                    updatedAt: mockedDate,
                },
            ]);

            await db.close();
        });
    });
});
