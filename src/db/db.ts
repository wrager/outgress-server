import { DataTypes, ModelStatic, Model, Sequelize } from 'sequelize';

export class Db {
    private readonly sequelize = new Sequelize('sqlite::memory:');

    private readonly models: Record<string, ModelStatic<Model>>;

    public constructor() {
        this.models = {
            portal: this.sequelize.define('Portal', {
                latitude: DataTypes.FLOAT,
                longitude: DataTypes.FLOAT,
            }),
        };
    }
}
