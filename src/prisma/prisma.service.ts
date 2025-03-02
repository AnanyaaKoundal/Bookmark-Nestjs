import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()  // It would be able to use dependency injections

export class PrismaService extends PrismaClient {
    constructor(config: ConfigService){
        super({
            datasources: {
                db: {
                    // url : 'postgresql://postgres:123@localhost:5434/nest?schema=public'
                    url: config.get('DATABASE_URL'),
                },
            }
        })
    }

    // use this function to cleanup database before each test
    cleanDB(){
        return this.$transaction([
            this.bookmark.deleteMany(),
            this.user.deleteMany()
        ])
    }
}
