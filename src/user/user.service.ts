import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { EditUser } from './dto';

@Injectable()
export class UserService {

    constructor(private prisma: PrismaService){}

    async editUser(userId: number, dto: EditUser){
        const user = await this.prisma.user.update({
            where:{
                id: userId,
            },
            data: {
                ...dto,
            },
        })
        const {hash, ...result} = user;
        return result;
    }

}
