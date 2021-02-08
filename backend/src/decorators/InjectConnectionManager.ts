import Container from "typedi";
import { ConnectionManager } from "typeorm";


export function InjectConnectionManager() {
    return function (object, propertyName, index) {
        Container.registerHandler({
            object: object,
            index,
            propertyName,
            value: () => {
                return Container.get(ConnectionManager);
            },
        });
    };
}