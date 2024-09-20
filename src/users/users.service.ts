import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';


@Injectable()
export class UsersService {

    // * here we are directly injecting repository without defining the Repository
    // remember this syntax
    constructor(@InjectRepository(User) private repo: Repository<User>){}

    create(email: string, password: string) {
        const user = this.repo.create({email, password});
        return this.repo.save(user);
    }

    find(email: string) {
        return this.repo.find({where: {email}});
    }

     async findOneUser(id: number): Promise<any> {
        if (!id) {
            return null;
        }
        const user = await this.repo.findOne({where : {id}});
        // console.log(user);
        return user;
    }

    async update(id: number , attrs: Partial<User>) {
        const user = await this.findOneUser(id);
        if (!user) {
            throw new NotFoundException('user not found');
        }
        Object.assign(user, attrs);
        return this.repo.save(user);
    }

    async remove(id: number) {
        const user = await this.findOneUser(id);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return this.repo.remove(user);
    }

    async findAllUsers() {
        const users = await this.repo.find();
        if (users == null) {
            throw new NotFoundException('users not found');
        }
        return users;
    }
}
