import fs from 'fs';
import { PortalType } from 'outgress-lib/model/portal-type/portal-type';
import { Type } from 'outgress-lib/util/type';
import { Database } from 'outgress-server/db/database';
import path from 'path';

describe('Database integration tests', () => {
    const tempDir = './itests/temp_db/Database';

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

    describe('constructor', () => {
        test('new database', async () => {
            const fileName = `${tempDir}/constructor_newDatabase.db`;
            const db = new Database(`sqlite:${fileName}`);
            await db.close();

            expect(fs.existsSync(fileName)).toBe(false);
        });

        test('on existed database', async () => {
            const fileName = `${tempDir}/constructor_onExistedDatabase.db`;
            await fillDatabase(fileName);

            expect(() => new Database(`sqlite:${fileName}`)).not.toThrow();
        });
    });

    describe('initDb', () => {
        test('new database', async () => {
            const fileName = `${tempDir}/initDb_newDatabase.db`;

            const db = new Database(`sqlite:${fileName}`);
            await db.initDb();

            const portalType1 = await db.modelClasses.portalType.fromData({
                name: 'bb',
                osmType: 'bbb',
            });
            expect(portalType1.id).toBe(1);
            expect(portalType1.name).toBe('bb');

            await db.close();
        });

        test('on existed database', async () => {
            const fileName = `${tempDir}/initDb_onExistedDatabase.db`;
            await fillDatabase(fileName);

            const db = new Database(`sqlite:${fileName}`);
            await db.initDb();

            const portalType1 = await db.modelClasses.portalType.fromData({
                name: 'bb',
                osmType: 'bbb',
            });
            expect(portalType1.id).toBeGreaterThan(1);
            expect(portalType1.name).toBe('bb');

            await db.close();
        });
    });

    describe('initEmptyDb', () => {
        test('single database', async () => {
            const fileName = `${tempDir}/initEmptyDb_singleDatabase.db`;
            const db = new Database(`sqlite:${fileName}`);
            await db.initEmptyDb();
            await db.close();

            expect(fs.statSync(fileName).size > 0).toBe(true);
        });

        test('two databases', async () => {
            const fileName1 = `${tempDir}/initEmptyDb_twoDatabases_1.db`;
            const fileName2 = `${tempDir}/initEmptyDb_twoDatabases_2.db`;

            const db2 = new Database(`sqlite:${fileName2}`);
            await db2.initEmptyDb();
            await db2.close();

            expect(fs.existsSync(fileName1)).toBe(false);
            expect(fs.statSync(fileName2).size > 0).toBe(true);

            const db1 = new Database(`sqlite:${fileName1}`);
            await db1.initEmptyDb();
            await db1.close();

            expect(fs.statSync(fileName1).size > 0).toBe(true);
            expect(fs.statSync(fileName2).size > 0).toBe(true);
        });

        test('on existed database', async () => {
            const fileName = `${tempDir}/initEmptyDb_onExistedDatabase.db`;
            await fillDatabase(fileName);

            const db = new Database(`sqlite:${fileName}`);
            await db.initEmptyDb();

            const portalType21 = await db.modelClasses.portalType.fromData({
                name: 'bb',
                osmType: 'bbb',
            });
            expect(portalType21.id).toBe(1);
            expect(portalType21.name).toBe('bb');

            await db.close();
        });
    });

    describe('fill', () => {
        test('single database', async () => {
            const fileName = `${tempDir}/fill_singleDatabase.db`;
            const db = new Database(`sqlite:${fileName}`);
            await db.initEmptyDb();

            const portalType1 = await db.modelClasses.portalType.fromData({
                name: 'aa',
                osmType: 'aaa',
            });
            expect(portalType1.id).toBe(1);

            const portalType2 = await db.modelClasses.portalType.fromData({
                name: 'bb',
                osmType: 'bbb',
            });
            expect(portalType2.id).toBe(2);

            const portal1 = await db.modelClasses.portal.fromData(
                {
                    latitude: 1,
                    longitude: 11,
                    name: '111',
                },
                portalType2.id,
            );
            expect(portal1.id).toBe(1);
            expect(portal1.portalType).toBe(2);

            const portal2 = await db.modelClasses.portal.fromData(
                {
                    latitude: 2,
                    longitude: 22,
                    name: '222',
                },
                portalType2.id,
            );
            expect(portal2.id).toBe(2);
            expect(portal2.portalType).toBe(2);

            const selectedPortal2 = await db.modelClasses.portal.findOne({
                where: {
                    name: '222',
                },
            });

            Type.assert(selectedPortal2);
            expect(selectedPortal2.id).toBe(2);
            expect(selectedPortal2.portalType).toBe(2);

            await db.close();
        });

        test('three databases', async () => {
            const fileName1 = `${tempDir}/fill_threeDatabases_1.db`;
            const fileName2 = `${tempDir}/fill_threeDatabases_2.db`;
            const fileName3 = `${tempDir}/fill_threeDatabases_3.db`;

            const db1 = new Database(`sqlite:${fileName1}`);
            await db1.initEmptyDb();

            const db2 = new Database(`sqlite:${fileName2}`);
            await db2.initEmptyDb();

            const portalType11 = await db1.modelClasses.portalType.fromData(
                new PortalType('aa', 'aaa'),
            );
            expect(portalType11.id).toBe(1);

            const portal11 = await db1.modelClasses.portal.fromData(
                {
                    latitude: 1,
                    longitude: 11,
                    name: '111',
                },
                portalType11.id,
            );
            expect(portal11.id).toBe(1);
            expect(portal11.portalType).toBe(1);

            const portalType21 = await db2.modelClasses.portalType.fromData(
                new PortalType('aa', 'aaa'),
            );
            expect(portalType21.id).toBe(1);

            const portal21 = await db2.modelClasses.portal.fromData(
                {
                    latitude: 1,
                    longitude: 11,
                    name: '111',
                },
                portalType21.id,
            );
            expect(portal21.id).toBe(1);
            expect(portal21.portalType).toBe(1);

            const db3 = new Database(`sqlite:${fileName3}`);
            await db3.initEmptyDb();

            const portalType31 = await db3.modelClasses.portalType.fromData(
                new PortalType('aa', 'aaa'),
            );
            expect(portalType31.id).toBe(1);

            const portal31 = await db3.modelClasses.portal.fromData(
                {
                    latitude: 1,
                    longitude: 11,
                    name: '111',
                },
                portalType31.id,
            );
            expect(portal31.id).toBe(1);
            expect(portal31.portalType).toBe(1);

            await db1.close();
            await db2.close();
            await db3.close();
        });
    });
});
