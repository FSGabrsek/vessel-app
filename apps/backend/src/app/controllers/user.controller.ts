import { Body, Controller, Get, HttpException, HttpStatus, Param, Put, Request, UseGuards } from "@nestjs/common";
import { ILinkedUser, IUserUpdateDTO, IUserDTO } from "@vessel/shared"
import { UserService } from "../services/user.service";
import { AuthGuard } from "../guards/auth.guards";

@Controller('user')
@UseGuards(AuthGuard)
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    async findAll(): Promise<IUserDTO[]> {
        return this.userService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<ILinkedUser | null> {
        return this.userService.findOneLinkedById(id);
    }

    @Put(':id')
    update(
        @Request() req: any,
        @Param('id') id: string,
        @Body() user: IUserUpdateDTO
    ): Promise<IUserDTO | null> {
        if (req.user.user_id !== id) {
            throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
        }
        return this.userService.update(id, user);
    }

    @Put(':id/follow/:followId')
    follow(
        @Request() req: any,
        @Param('id') id: string,
        @Param('followId') followId: string
    ): Promise<void> {
        if (req.user.user_id !== id) {
            throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
        }
        return this.userService.follow(id, followId);
    }

    @Put(':id/unfollow/:followId')
    unfollow(
        @Request() req: any,
        @Param('id') id: string,
        @Param('followId') followId: string
    ): Promise<void> {
        if (req.user.user_id !== id) {
            throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
        }
        return this.userService.unfollow(id, followId);
    }
}

