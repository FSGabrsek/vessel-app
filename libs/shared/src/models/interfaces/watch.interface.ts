import { IUser } from "./user.interface"
import { IVessel } from "./vessel.interface"
import { IsString, IsNumber, IsOptional, ValidateNested, IsIn } from 'class-validator';
import { Type } from 'class-transformer';
import { VesselDTO } from './vessel.interface';
import { UserDTO } from './user.interface';

export interface IReview {
    rating: '+' | '~' | '-'
    content: string
}

export interface IWatch {
    _id: string
    progress: number
    vessel: object
    review?: IReview
    owner: Omit<IUser, 'password'>
}

export interface IWatchCreateDTO {
    progress: number
    vessel: string
}


export class ReviewDTO implements IReview {
    @IsIn(['+', '~', '-'])
    rating!: '+' | '~' | '-';

    @IsString()
    content!: string;
}

export class WatchDTO implements IWatch {
    @IsString()
    _id!: string;

    @IsNumber()
    progress!: number;

    @ValidateNested()
    vessel!: object;

    @IsOptional()
    @ValidateNested()
    @Type(() => ReviewDTO)
    review?: ReviewDTO;

    @ValidateNested()
    @Type(() => UserDTO)
    owner!: UserDTO;
}

export class WatchCreateDTO implements IWatchCreateDTO {
    @IsNumber()
    progress!: number;

    @IsString()
    vessel!: string;
}

export class WatchUpdateDTO implements IWatchUpdateDTO {
    @IsOptional()
    @IsNumber()
    progress?: number;
}

export type IWatchUpdateDTO = Partial<Pick<IWatch, 'progress'>>