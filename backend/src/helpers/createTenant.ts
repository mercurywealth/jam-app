import {createConnection, getConnectionManager, DeepPartial, getConnection} from "typeorm";
import Tenant from '@entities/core/Tenant';
import ormConfig from "@app/../ormConfig";
import path from "path";

interface CreateTenantOptions {
    name: string;
    db_database: string;
    db_server: string;
    db_password: string;
}

export default async function createTenant(data: CreateTenantOptions){
    const connMan = getConnectionManager();
    const defaultConnection = connMan.has("default") ? connMan.get("default") : await createConnection();
    const tenant = await defaultConnection.getRepository<Tenant>("Tenant").create(data).save();

    var [host, port] = data.db_server.split(":");
    const tenantConnection = connMan.has(tenant.id) ? connMan.get(tenant.id) : await createConnection({
        name: tenant.id,
        type: ormConfig.type,
        database: data.db_database,
        host: host,
        port: parseInt(port),
        username: ormConfig.username,
        password: ormConfig.password,
        entities: [path.resolve(__dirname, "../db/entities/**/*.{ts,js}")],
        entityPrefix: ormConfig.entityPrefix,
        synchronize: false,
    });
    await tenantConnection.synchronize();
    return tenant;
}
