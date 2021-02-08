import "../src/header";
import createTenant from '../src/helpers/createTenant';


async function main() {
    const tenant = await createTenant({
        name: "Test Tenant",
        db_database: "noteapp_tenant_3",
        db_server: "127.0.0.1:3306",
        db_password: "",
    });
    console.log(`Successfully created tenant (${tenant.id}): `, tenant);
}
main();