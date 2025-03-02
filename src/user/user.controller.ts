import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { Request } from 'express';
import { GetUser } from '@/auth/decorator';
import { JwtGuard } from '@/auth/guard';
import { EditUser } from './dto';
import { UserService } from './user.service';

@UseGuards(JwtGuard)
@Controller('user')
export class UserController {

    constructor(private userSerive: UserService){}

    // @UseGuards(AuthGuard('jwt')) // Adding magic strings like 'jwt' everytime can cause error so to make it clean, we abstracting it in a custom Gaurd in auth f older.
    @Get('me')
    // getMe(@Req() req: Request){  // This Req is return from the validate function in strategy. It is error prone and must not be uses immediately.
    //     console.log({
    //         user: req.user,
    //     });
    //     return 'user me';
    // }

    getme(@GetUser() user : User){
        return user;
    }

    //if we want to get specific field say user id
    // getme(@GetUser("1") user : User, @GetUser('email') email:string){
    //     console.log({email,})
    //     return user;
    // }


    @Patch()
    editUser(
        @GetUser('id') userId: number,
        @Body() dto: EditUser
    ){
        return this.userSerive.editUser(userId, dto);
    }
}
