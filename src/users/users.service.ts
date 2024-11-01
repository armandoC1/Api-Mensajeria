import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    findAll(): Promise<User[]> {
        return this.usersRepository.find()
    }

    findOne(userName: string): Promise<User> {
        return this.usersRepository.findOneBy({ userName });
    }

    async create(user: User): Promise<User> {
        return this.usersRepository.save(user);
    }
}