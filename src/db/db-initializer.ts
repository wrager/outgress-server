import { PortalData } from '../model/portal/portal-data';
import { ArrayUtil } from '../util/array-util';
import { StringUtil } from '../util/string-util';
import { Database } from './database';

export class DbInitializer {
    private readonly db: Database;

    #knownPortalTypes: Map<string, number> | undefined;

    public constructor(db: Database) {
        this.db = db;
    }

    private get knownPortalTypes(): Map<string, number> {
        if (this.#knownPortalTypes === undefined) {
            throw new Error('Known portal types is not initialized.');
        }

        return this.#knownPortalTypes;
    }

    public dropAndSync(): Promise<void> {
        return this.db.dropAndSync();
    }

    public async init(): Promise<void> {
        this.#knownPortalTypes = new Map(
            (await this.db.modelClasses.portalType.findAll()).map(
                (portalTypeModel) => [
                    portalTypeModel.osmType,
                    portalTypeModel.id,
                ],
            ),
        );
    }

    public async insertPortals(
        portals: readonly PortalData[],
        getPortalOsmType: (portalData: Readonly<PortalData>) => string,
    ): Promise<void> {
        const unknownPortalOsmTypes = ArrayUtil.unique(
            portals.map((portal) => getPortalOsmType(portal)),
        ).filter((osmType) => !this.knownPortalTypes.has(osmType));

        const newPortalTypeModels =
            await this.db.modelClasses.portalType.bulkCreate(
                unknownPortalOsmTypes.map((osmType) => ({
                    name: StringUtil.capitalize(osmType),
                    osmType,
                })),
            );
        newPortalTypeModels.forEach((newPortalTypeModel) => {
            this.knownPortalTypes.set(
                newPortalTypeModel.osmType,
                newPortalTypeModel.id,
            );
        });

        await this.db.modelClasses.portal.bulkCreate(
            portals.map((portalData) => ({
                ...portalData,
                portalType: this.knownPortalTypes.get(
                    getPortalOsmType(portalData),
                ),
            })),
        );
    }
}
