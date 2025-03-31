import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '@vessel/shared';
import { Model } from 'mongoose';
import { Observable } from 'rxjs';

@Injectable()
export class UserExistGuard implements CanActivate {
    constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

    canActivate(
        context: ExecutionContext
    ): boolean | Promise<boolean> | Observable<boolean> {
        const user = context.switchToHttp().getRequest().body;
        return !!this.userModel.findOne({ email: user.email });
    }
}
