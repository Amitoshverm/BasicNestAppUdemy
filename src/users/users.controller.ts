import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Query, Session, UseGuards } from '@nestjs/common';
import { User } from './user.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { UpdatedUserDto } from './dtos/update-user.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorators';
import { AuthGaurd } from 'src/gaurds/auth.gaurd';


@Controller('auth')
@Serialize(UserDto)
export class UsersController {

    constructor( 
        private service: UsersService, 
        private authService: AuthService
                ) {}


    // @Get('/colors/:color')
    // setColor(@Param() color: string, @Session() session: any) {
    //     session.color = color;
    // }
    // @Get('/colors')
    // getColor(@Session() session: any) {
    //     return session.color;
    // }
    
    // @Get('/whoami')  
    // whoAmI(@Session() session: any) {
    //     return this.service.findOneUser(session.userId);
    // }


    @Get('/whoami')
    @UseGuards(AuthGaurd)
    whoAmI(@CurrentUser() user: User) {
        return user;
    }


    @Post('/signout')
    signout(@Session() session: any) {
        session.userId = null;
    }

    @Post('/signup')
    async createUser(@Body() body: CreateUserDto, @Session() session: any) {
        const user =  await this.authService.signup(body.email, body.password);
        session.userId = user.id;
        return user;
    }

    @Post('/signin')
    async signin(@Body() body: CreateUserDto, @Session() session: any) {
        const user = await this.authService.signin(body.email, body.password);
        session.userId = user.id;
        return user;
    }



    @Get('/:id')
    findUser(@Param('id') id: string): Promise<any> {
    return this.service.findOneUser(parseInt(id));
    // console.log(user.id);
    // if (!user) {
    //   throw new NotFoundException('user not found');
    // }
    // return user;
  }

    @Get()
    getUsers(@Query('email') email: string) {
        return this.service.find(email);
    }

    @Delete('/:id') 
    removeUser(@Param('id') id: string) {
        return this.service.remove(parseInt(id));
    }

    @Patch('/:id')
    updateUser(@Param('id') id: string, @Body() user: UpdatedUserDto) {
        return this.service.update(parseInt(id), user);
    }

    @Get()
    getAllUsers() {
        return this.service.findAllUsers();
    }
}
