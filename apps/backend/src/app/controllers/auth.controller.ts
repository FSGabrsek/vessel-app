import {
    Controller,
    Post,
    UseGuards,
    Logger,
    Body
} from '@nestjs/common';

import { UserCreateDTO, UserIdentityDTO, UserLoginDTO } from '@vessel/shared';
import { Public } from '../deocrators/decorators';
import { AuthService } from '../services/auth.service';
import { UserExistGuard } from '../guards/user-exists.guard';

@Controller('auth')
export class AuthController {
    private readonly logger = new Logger(AuthController.name);

    constructor(private authService: AuthService) {}

    @Public()
    @Post('login')
    async login(@Body() credentials: UserLoginDTO): Promise<UserIdentityDTO> {
        this.logger.log('Login');
        return await this.authService.login(credentials);
    }

    @Public()
    @UseGuards(UserExistGuard)
    @Post('register')
    async register(@Body() user: UserCreateDTO): Promise<UserIdentityDTO> {
        this.logger.log('Register');
        return await this.authService.register(user);
    }
}
