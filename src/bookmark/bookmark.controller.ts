import { JwtGuard } from '@/auth/guard';
import { Controller, Post, Get, Patch, Delete, Param, UseGuards, ParseIntPipe, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { BookmarkService } from './bookmark.service';
import { GetUser } from '@/auth/decorator';
import { CreateBookmark, EditBookmark } from './dto';

@UseGuards(JwtGuard)
@Controller('bookmark')
export class BookmarkController {

    constructor(private bookmarkService: BookmarkService) {}

    @Post()
    createBookmark(
        @GetUser('id') userId: number,
        @Body() dto: CreateBookmark,
    ) {
        return this.bookmarkService.createBookmark(userId, dto);
    }

    @Get()
    getBookmark(@GetUser('id') userId: number){
        return this.bookmarkService.getBookmark(userId);
    }

    @Get(":id")
    getBookmarkById(
        @GetUser('id') userId: number,
        @Param('id', ParseIntPipe) id: number
    ) {
        return this.bookmarkService.getBookmarkById(userId, id);
    }
    
    @Patch(":id")
    editBookmark(
        @GetUser('id') userId: number,
        @Body() dto: EditBookmark,
        @Param('id', ParseIntPipe) id: number
    ) {
        return this.bookmarkService.editBookmark(userId, dto, id);
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete(":id")
    deleteBookmark(
        @GetUser('id') userId: number,
        @Param('id', ParseIntPipe) id: number
    ) {
        return this.bookmarkService.deleteBookmark(userId, id);
    }
}
