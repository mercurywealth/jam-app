import Tenant from '@entities/core/Tenant';
import GQLUser from '@app/gql/entities/core/User';
import { Connection } from 'typeorm';

export default interface Context {
    user?: GQLUser;
    jwt: string;
    tenant: Tenant,
    connectionName: string,
}
