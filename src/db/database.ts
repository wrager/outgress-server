import { DataTypes, Sequelize } from 'sequelize';
import { Type } from '../util/type';
import { BasePortalTypeModel } from './model/portal-type/base-portal-type-model';
import { portalTypeModel } from './model/portal-type/portal-type-model';
import { BasePortalModel } from './model/portal/base-portal-model';
import { portalModel } from './model/portal/portal-model';

export interface ModelClasses {
    portal: typeof BasePortalModel;
    portalType: typeof BasePortalTypeModel;
}

export class Database {
    private readonly sequelize: Sequelize;

    #initialized = false;
    readonly #modelClasses: ModelClasses = {
        portal: portalModel(),
        portalType: portalTypeModel(),
    };

    public constructor(connectionString: string, logging = false) {
        this.sequelize = new Sequelize(connectionString, {
            logging,
        });

        Database.initModels(this.#modelClasses, this.sequelize);
    }

    public get initialized(): boolean {
        return this.#initialized;
    }

    public get modelClasses(): Readonly<ModelClasses> {
        this.checkInitialization();

        return Type.defined(this.#modelClasses);
    }

    private static initModels(
        modelClasses: ModelClasses,
        sequelize: Sequelize,
    ): void {
        modelClasses.portalType.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    autoIncrement: true,
                    primaryKey: true,
                },
                name: {
                    type: new DataTypes.STRING(64),
                    allowNull: false,
                },
                osmType: {
                    type: new DataTypes.STRING(32),
                    allowNull: false,
                },
            },
            {
                name: {
                    plural: 'portal types',
                    singular: 'portal type',
                },
                modelName: 'portal-type',
                sequelize,
            },
        );

        modelClasses.portal.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    autoIncrement: true,
                    primaryKey: true,
                },
                latitude: DataTypes.FLOAT,
                longitude: DataTypes.FLOAT,
                name: {
                    type: new DataTypes.STRING(128),
                    allowNull: false,
                },
            },
            {
                name: {
                    plural: 'portals',
                    singular: 'portal',
                },
                modelName: 'portal',
                sequelize,
            },
        );

        modelClasses.portalType.hasMany(modelClasses.portal, {
            foreignKey: 'portalType',
        });
        modelClasses.portal.belongsTo(modelClasses.portalType, {
            foreignKey: 'portalType',
        });
    }

    public async clearRows(): Promise<void> {
        if (this.sequelize === undefined) {
            throw new Error('Db instance is not initialized.');
        }

        await this.#modelClasses?.portal.destroy({
            truncate: true,
        });
        await this.#modelClasses?.portalType.destroy({
            truncate: true,
        });
    }

    public async close(): Promise<void> {
        await this.sequelize.close();
    }

    public async dropAndSync(): Promise<void> {
        await this.sequelize.drop();
        await this.sequelize.sync();
    }

    public initEmptyDb(): Promise<void> {
        return this.init(true);
    }

    public initDb(): Promise<void> {
        return this.init(false);
    }

    public selectAllPortals(): Promise<BasePortalModel[]> {
        this.checkInitialization();

        return this.#modelClasses.portal.findAll();
    }

    public selectAllPortalTypes(): Promise<BasePortalTypeModel[]> {
        this.checkInitialization();

        return this.#modelClasses.portalType.findAll();
    }

    private checkInitialization(): void {
        if (!this.#initialized) {
            throw new Error('Db instance is not initialized.');
        }
    }

    private async init(dropTables: boolean): Promise<void> {
        Type.assert(!this.#initialized);

        await this.sequelize.sync({ force: dropTables });
        this.#initialized = true;
    }
}
