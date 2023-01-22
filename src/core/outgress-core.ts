import { Database } from '../db/database';
import { Location } from '../location';
import { MapDataSource } from './app-data-source/map-data-source';
import { UserMap } from '../user-map';
import { CoreOptions } from './core-options';
import { Type } from '../util/type';
import { DbInitializer } from '../db/db-initializer';

export class OutgressCore {
    private static readonly visibilityDistanceMeters = 1000;

    private readonly db: Database;
    private readonly dbInitializer: DbInitializer;
    private readonly mapDataSource: MapDataSource;

    public constructor(
        mapDataSource: MapDataSource,
        options: Readonly<CoreOptions>,
    ) {
        this.mapDataSource = mapDataSource;
        this.db = new Database(options.db.connectionString, options.db.logging);

        this.dbInitializer = new DbInitializer(this.db);
    }

    public async fillData(location: Location, radius: number): Promise<number> {
        Type.assert(this.mapDataSource);

        const portalsNear = await this.mapDataSource.getPortalsNear(
            location,
            radius,
        );

        return (
            await this.dbInitializer.insertPortals(
                portalsNear,
                (portalData) => portalData.type.osmType,
            )
        ).length;
    }

    public async getUserMap(location: Location): Promise<UserMap> {
        return new UserMap(
            await this.mapDataSource.getPortalsNear(
                location,
                OutgressCore.visibilityDistanceMeters,
            ),
        );
    }

    public async init(): Promise<void> {
        await this.db.initDb();
        await this.dbInitializer.init();
    }
}
