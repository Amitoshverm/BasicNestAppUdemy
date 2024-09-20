import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';

//* randomBytes for generating the salt and scrypt for hash funtion
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { User } from './user.entity';


const scrypt = promisify(_scrypt);
@Injectable()
export class AuthService {

    constructor( private userService: UsersService) {}

    async signup(email: string, password: string) {
        
        // * email is already is presnt or not 
        const users = await this.userService.find(email);
        if (users.length) {
            throw new BadRequestException('Email Already in use');
        }
        // * hash user password : (salt + hash) steps->
        // * 1. generate the salt
        const salt = randomBytes(8).toString('hex')


        // * 2. hash the salt and password together 
        const hash = (await scrypt(password, salt, 32)) as Buffer;

        // * 3. join the hashed result and the salth together
        const result = salt + '.' + hash.toString('hex');

        // * create new user and save to db
        const user = await this.userService.create(email, result);

        // * return user
        return user;
    }

    async signin(email: string, password: string) {
        const [user] = await this.userService.find(email);
        if (!user) {
            throw new NotFoundException('user not found');
        }
        const[salt, storedHash] =  user.password.split('.');

        const hash = (await scrypt(password, salt, 32)) as Buffer;

        if (storedHash !== hash.toString('hex')) {
            throw new BadRequestException('wrong password')
        } 
        return user;
    }
}
