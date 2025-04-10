import { Body, Controller, Delete, Get, Param, Post, Put, Request, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../guards/auth.guards";
import { WatchService } from "../services/watch.service";
import { IReview, IWatch, WatchCreateDTO, WatchDTO, WatchUpdateDTO } from "@vessel/shared";

@Controller('user')
@UseGuards(AuthGuard)
export class WatchController {
    constructor(private readonly watchService: WatchService) {}

    @Get(':userId/watch')
    async findAll(
        @Param('userId') userId: string,
    ): Promise<WatchDTO[]> {
        return this.watchService.findByOwner(userId);
    }

    @Get(':userId/watch/:id')
    async findOne(
        @Param('id') id: string
    ): Promise<WatchDTO | null> {
        return this.watchService.findOneById(id);
    }

    @Post(':userId/watch')
    async create(
        @Request() req: any,
        @Body() watch: WatchCreateDTO
    ): Promise<WatchDTO> {
        return this.watchService.create(watch, req.user.user_id);
    }

    @Put(':userId/watch/:id')
    async update(
        @Request() req: any,
        @Param('id') id: string,
        @Body() watch: WatchUpdateDTO
    ): Promise<WatchDTO> {
        return this.watchService.update(id, watch, req.user.user_id);
    }

    @Delete(':userId/watch/:id')
    async remove(
        @Request() req: any,
        @Param('id') id: string,
    ): Promise<WatchDTO> {
        return this.watchService.delete(id, req.user.user_id);
    }

    @Post(':userId/watch/:id/review')
    async createReview(
        @Request() req: any,
        @Param('id') id: string,
        @Body() review: IReview
    ): Promise<WatchDTO> {
        return this.watchService.createReview(id, review, req.user.user_id);
    }

    @Put(':userId/watch/:id/review')
    async updateReview(
        @Request() req: any,
        @Param('id') id: string,
        @Body() review: IReview
    ): Promise<IWatch> {
        return this.watchService.createReview(id, review, req.user.user_id);
    }

    @Delete(':userId/watch/:id/review')
    async removeReview(
        @Request() req: any,
        @Param('id') id: string,
    ): Promise<WatchDTO> {
        return this.watchService.deleteReview(id, req.user.user_id);
    }
}
