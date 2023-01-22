import { BasePortalTypeModel } from './base-portal-type-model';

export const portalTypeModel = (): typeof BasePortalTypeModel =>
    class extends BasePortalTypeModel {};
