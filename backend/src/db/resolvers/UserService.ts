import { Service } from 'typedi';
import { Repository, EntityRepository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import User from '@entities/core/User';
import GQUser from '@app/gql/entities/core/User';

@Service()
@EntityRepository(User)
export default class UserService {
    private readonly repository!: Repository<User>

    constructor(@InjectRepository(User) repository: Repository<User>) {
        this.repository = repository;
    }

    async findOne(id: string) {
        const user = new GQUser();
        //get info from db
        Object.assign(user, await this.repository.findOne(id));
        //get info from B2C
        // TODO
        return user;
    }
}