import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateBookmark, EditBookmark } from './dto';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class BookmarkService {

    constructor(private prisma: PrismaService) {}

    async createBookmark(userId: number, dto:CreateBookmark) {
         const bookmark = await this.prisma.bookmark.create({
            data: {
                userId,
                ...dto,
            },
         })
         return bookmark;
    }

    getBookmark(userId: number){
        return this.prisma.bookmark.findMany({
            where: {
                userId,
            }
        });
    }

    getBookmarkById(userId: number, bookmarkId: number) {
        return this.prisma.bookmark.findFirst({
            where: {
                userId,
                id: bookmarkId,
            }
        });
    }
    
    async editBookmark(userId: number, dto:EditBookmark, id:number) {
        // Step 1: Get the bookmark by bookmarkId

        const bookmark = await this.prisma.bookmark.findFirst({
            where:{
                id,
                userId,  //automatically ensure that bookmark belongs to user
            }
        })

        if(!bookmark){
            throw new ForbiddenException("Bookmark not found");
        }

        // Step 2: Update the bookmark

        return this.prisma.bookmark.update({
             where:{
                id,
             },
             data: {
                ...dto,
             }
        });

    }

    async deleteBookmark(userId: number, id: number) {
        // Step 1: Get the bookmark by bookmarkId

        const bookmark = await this.prisma.bookmark.findFirst({
            where:{
                id,
                userId,  //automatically ensure that bookmark belongs to user
            }
        })

        if(!bookmark){
            throw new ForbiddenException("Bookmark not found");
        }

        // Step 2: Delete the bookmark

        await this.prisma.bookmark.delete({
             where:{
                id,
             },
        });
    }
}
