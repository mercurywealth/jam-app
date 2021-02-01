import { Service } from "typedi";
import { getConnection } from "typeorm";

@Service()
export default class ConnectionService {
    get(name: string){
        return getConnection(name);
    }
}