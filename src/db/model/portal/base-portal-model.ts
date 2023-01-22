import {
    ForeignKey,
    InferAttributes,
    InferCreationAttributes,
    Model,
} from 'sequelize';
import { PortalData } from '../../../model/portal/portal-data';
import { BasePortalTypeModel } from '../portal-type/base-portal-type-model';

export class BasePortalModel extends Model<
    InferAttributes<BasePortalModel>,
    InferCreationAttributes<BasePortalModel>
> {
    public declare readonly id: number | null;
    public declare readonly latitude: number;
    public declare readonly longitude: number;
    public declare readonly name: string;
    public declare readonly portalType: ForeignKey<BasePortalTypeModel['id']>;

    public static async fromData(
        portal: PortalData,
        portalTypeId: number,
    ): Promise<BasePortalModel> {
        return this.create({
            latitude: portal.latitude,
            longitude: portal.longitude,
            name: portal.name,
            portalType: portalTypeId,
        });
    }
}
