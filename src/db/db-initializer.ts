import { Op } from 'sequelize';
import { PortalType } from '../model/portal-type/portal-type';
import { Portal } from '../model/portal/portal';
import { PortalData } from '../model/portal/portal-data';
import { ArrayUtil } from '../util/array-util';
import { StringUtil } from '../util/string-util';
import { Type } from '../util/type';
import { Database } from './database';
import { BasePortalModel } from './model/portal/base-portal-model';

export class DbInitializer {
    private readonly db: Database;

    #knownPortalTypes:
        | Map<string, { id: number; portalType: PortalType }>
        | undefined;

    public constructor(db: Database) {
        this.db = db;
    }

    private get knownPortalTypes(): Map<
        string,
        { id: number; portalType: PortalType }
    > {
        if (this.#knownPortalTypes === undefined) {
            throw new Error('Known portal types is not initialized.');
        }

        return this.#knownPortalTypes;
    }

    public async init(): Promise<void> {
        this.#knownPortalTypes = new Map(
            (await this.db.modelClasses.portalType.findAll()).map(
                (portalTypeModel) => [
                    portalTypeModel.osmType,
                    {
                        id: portalTypeModel.id,
                        portalType: PortalType.fromData(
                            portalTypeModel.toData(),
                        ),
                    },
                ],
            ),
        );
    }

    public async insertPortals<T extends PortalData>(
        portals: readonly T[],
        getPortalOsmType: (portalData: Readonly<T>) => string,
    ): Promise<BasePortalModel[]> {
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
            this.knownPortalTypes.set(newPortalTypeModel.osmType, {
                id: newPortalTypeModel.id,
                portalType: PortalType.fromData(newPortalTypeModel.toData()),
            });
        });

        // TODO: one query instead all code below
        const knownPortalModels = await this.db.modelClasses.portal.findAll({
            where: {
                [Op.or]: portals.map((portal) => ({
                    latitude: portal.latitude,
                    longitude: portal.longitude,
                    name: portal.name,
                })),
            },
        });

        const newPortals = portals.filter(
            (portal) =>
                !knownPortalModels.some(
                    (knownPortalModel) =>
                        Portal.fromData(knownPortalModel.toData(), () =>
                            Type.defined(
                                this.getPortalTypeById(
                                    knownPortalModel.portalType,
                                ),
                            ),
                        ).id ===
                        Portal.fromData(portal, () =>
                            Type.defined(
                                this.getPortalTypeByOsmType(
                                    getPortalOsmType(portal),
                                ),
                            ),
                        ).id,
                ),
        );

        return this.db.modelClasses.portal.bulkCreate(
            newPortals.map((portalData) => ({
                latitude: portalData.latitude,
                longitude: portalData.longitude,
                name: portalData.name,
                portalType: Type.defined(
                    this.knownPortalTypes.get(getPortalOsmType(portalData)),
                ).id,
            })),
        );
    }

    private getPortalTypeById(id: number): PortalType | undefined {
        return [...this.knownPortalTypes.entries()].find(
            (pair) => pair[1].id === id,
        )?.[1].portalType;
    }

    private getPortalTypeByOsmType(osmType: string): PortalType | undefined {
        return [...this.knownPortalTypes.entries()].find(
            (pair) => pair[1].portalType.osmType === osmType,
        )?.[1].portalType;
    }
}
