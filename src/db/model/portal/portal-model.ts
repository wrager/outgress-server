import { BasePortalModel } from './base-portal-model';

export const portalModel = (): typeof BasePortalModel =>
    class extends BasePortalModel {};
