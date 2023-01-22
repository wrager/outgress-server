import {
    CreationOptional,
    InferAttributes,
    InferCreationAttributes,
    Model,
} from 'sequelize';
import { PortalTypeData } from '../../../model/portal-type/portal-type-data';

export class BasePortalTypeModel extends Model<
    InferAttributes<BasePortalTypeModel>,
    InferCreationAttributes<BasePortalTypeModel>
> {
    public declare readonly id: CreationOptional<number>;
    public declare readonly name: string;
    public declare readonly osmType: string;

    public static fromData(
        portalType: PortalTypeData,
    ): Promise<BasePortalTypeModel> {
        return this.create({
            name: portalType.name,
            osmType: portalType.osmType,
        });
    }
}
