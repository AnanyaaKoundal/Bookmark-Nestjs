// It is responsible for handling the business logic

import { ForbiddenException, Injectable } from "@nestjs/common"
import { User, Bookmark } from "@prisma/client";
import { PrismaService } from "@/prisma/prisma.service";
import * as argon from 'argon2';
import { AuthDTO } from "./dto";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@Injectable ()

export class AuthService {

    constructor(
        private prisma: PrismaService, 
        private jwt: JwtService,
        private config: ConfigService
    ){}

    async signup(dto: AuthDTO){
        // generate password hash
        
        const hash = await argon.hash(dto.password);

        //save the user
        try{

            const user = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    hash
                },
                select:{    // to make user objects containing of some selected objects
                    id: true,
                    email: true,    
                    createdAt: true
                }
            });
            return this.signToken(user.id, user.email);
        }catch(error){
            if(error instanceof PrismaClientKnownRequestError && error.code == 'P2002'){
                throw new ForbiddenException("Credentials already in use");
            }
            throw error;
        }

    }

    async login(dto: AuthDTO){
        // Step 1: Find user by email
        const user = await this.prisma.user.findUnique({
            where:{
                email: dto.email,
            },
        })
        // Step 2: If user does not exist, throw exception
        if(!user){
            throw new ForbiddenException('Incorrect credentials');
        }

        //Step 3: Match passwords
        const isMatched = await argon.verify(user.hash, dto.password);

        // Step 4: If password not matched, throw exception
        if(!isMatched){
            throw new ForbiddenException('Incorrect credentials');
        }

        // Step 5: Login success, send back user

        // const { hash, ...result } = user;   // Filter out hash from response
        // const res = {...result, msg:"Login success"};
        // return res;

        return this.signToken(user.id, user.email);
        
    }

    async signToken(
        userId: number,
        email: string,
    // ): Promise<string>{  // Promise specifies that function is going to return a string, Need not put async when using promise
    )  {
        const payload = {
            sub: userId,
            email
        }

        // return this.jwt.signAsync(payload, {
        //     expiresIn: '15m',
        //     secret: this.config.get('JWT_SECRET')
        // })

        const token = await this.jwt.signAsync(payload, {
            expiresIn: '300m',
            secret: this.config.get('JWT_SECRET')
        });

        return {
            access_token: token
        };
    }

}