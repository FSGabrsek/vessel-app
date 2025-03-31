import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Query, Request, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../guards/auth.guards";
import { VesselService } from "../services/vessel.service";
import { IVessel, IVesselCreateDTO, IVesselUpdateTO } from "@vessel/shared";

@Controller('vessel')
@UseGuards(AuthGuard)
export class VesselController {
    constructor(private readonly vesselService: VesselService) {}

    @Get()
    async findAll(@Query('s') search: string): Promise<IVessel[]> {
        return this.vesselService.findAll(search);
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<IVessel | null> {
        return this.vesselService.findOneById(id);
    }

    @Post()
    async create(
        @Request() req: any,
        @Body() vessel: IVesselCreateDTO
    ): Promise<IVessel> {
        return this.vesselService.create(vessel, req.user.user_id);
    }

    @Put(':id')
    async update(
        @Request() req: any,
        @Param('id') id: string,
        @Body() vessel: IVesselUpdateTO
    ): Promise<IVessel> {
        return this.vesselService.update(id, vessel, req.user.user_id);
    }

    @Delete(':id')
    async remove(
        @Request() req: any,
        @Param('id') id: string,
    ): Promise<IVessel> {
        return this.vesselService.delete(id, req.user.user_id);
    }

}
