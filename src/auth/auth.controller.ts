// Controller receives request from internet. It then call a function from the AuthService ans return its result back to the client

import { Controller, Post, Body, Req, ParseIntPipe, HttpCode, HttpStatus } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDTO } from "./dto";

@Controller('auth')  // auth is a global prefix route

export class AuthController {
    constructor(private authService: AuthService ){
        // this.authService.login(); // This  is called dependency injection
    }


    @Post('signup')
    // signup(@Body('email') email: string, 
    //         @Body('password', ParseIntPipe) password: string){ // Pipe to convert string to int 
    //     console.log({
    //         email, 
    //         typeEmail: typeof email,
    //         password,
    //         typasPass: typeof password
    //     })
    //     return this.authService.signup();
    // }

    signup(@Body() dto: AuthDTO){
        return this.authService.signup(dto);
    }

    @HttpCode(HttpStatus.OK)   // This returns internally specified http code with responce
    @Post('login')
    login(@Body() dto: AuthDTO){
        return this.authService.login(dto);
    }

}