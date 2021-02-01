import { Connection } from 'typeorm';
import User from '../db/entities/core/User';

export default interface Context {
    user?: User;
    jwt: string;
    connectionName: string,
    tenant: string,
}
