import { Body, Controller, Delete, Get, Param, Post, Put, Query, Request, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../guards/auth.guards";
import { VesselService } from "../services/vessel.service";
import { IVessel, IWatch, VesselCreateDTO, VesselDTO, VesselUpdateDTO } from "@vessel/shared";
import { WatchService } from "../services/watch.service";

@Controller('vessel')
@UseGuards(AuthGuard)
export class VesselController {
    constructor(
        private readonly vesselService: VesselService,
        private readonly watchService: WatchService
    ) {}

    @Get()
    async findAll(@Query('s') search: string): Promise<VesselDTO[]> {
        return this.vesselService.findAll(search);
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<VesselDTO | null> {
        return this.vesselService.findOneById(id);
    }

    @Get('/:id/watch')
    async findAllWatches(@Param('id') id: string): Promise<IWatch[]> {
        return this.watchService.findByVessel(id);
    }

    @Post()
    async create(
        @Request() req: any,
        @Body() vessel: VesselCreateDTO
    ): Promise<IVessel> {
        return this.vesselService.create(vessel, req.user.user_id);
    }

    @Put(':id')
    async update(
        @Request() req: any,
        @Param('id') id: string,
        @Body() vessel: VesselUpdateDTO
    ): Promise<VesselDTO> {
        return this.vesselService.update(id, vessel, req.user.user_id);
    }

    @Delete(':id')
    async remove(
        @Request() req: any,
        @Param('id') id: string,
    ): Promise<VesselDTO> {
        return this.vesselService.delete(id, req.user.user_id);
    }

    @Get('recommendation/user/:userId/')
    async findRecommended(
        @Query('n') n: number = 5,
        @Param('userId') userId: string 
    ): Promise<VesselDTO[]> {
        return this.vesselService.reccommend(userId, +n)
    }
}
