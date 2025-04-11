import { IUser, UserDTO } from "./user.interface"
import { IsString, IsIn, IsNumber, IsOptional, IsBoolean, IsDate, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export interface IVessel {
    _id: string
    title: string
    type: 'series' | 'film' | 'literature'
    synopsis: string
    finalLength: number
    currentLength: number
    status: 'upcoming' | 'ongoing' | 'finished'
    releaseDate: Date
    releaseInterval: number
    bulkRelease?: boolean
    owner: Omit<IUser, 'password'>
}


export class VesselDTO implements IVessel {
    @IsString()
    _id!: string;
    
    @IsString()
    title!: string;

    @IsIn(['series', 'film', 'literature'])
    type!: 'series' | 'film' | 'literature';
    
    @IsString()
    synopsis!: string;

    @IsNumber()
    finalLength!: number;

    @IsNumber()
    currentLength!: number;
    
    @IsIn(['upcoming', 'ongoing', 'finished'])
    status!: 'upcoming' | 'ongoing' | 'finished';
    
    @IsDate()
    @Type(() => Date)
    releaseDate!: Date;

    @IsOptional()
    @IsNumber()
    releaseInterval!: number;

    @IsOptional()
    @IsBoolean()
    bulkRelease?: boolean;

    @ValidateNested()
    @Type(() => UserDTO)
    owner!: UserDTO;
}

export class VesselCreateDTO implements IVesselCreateDTO {
    @IsString()
    title!: string;

    @IsIn(['series', 'film', 'literature'])
    type!: 'series' | 'film' | 'literature';

    @IsString()
    synopsis!: string;

    @IsNumber()
    finalLength!: number;

    @IsIn(['upcoming', 'ongoing', 'finished'])
    status!: 'upcoming' | 'ongoing' | 'finished';
    
    @IsDate()
    @Type(() => Date)
    releaseDate!: Date;
    
    @IsOptional()
    @IsNumber()
    releaseInterval!: number;

    @IsOptional()
    @IsBoolean()
    bulkRelease?: boolean;
}

export class VesselUpdateDTO implements IVesselUpdateDTO {
    @IsOptional()
    @IsNumber()
    finalLength?: number;
    
    @IsOptional()
    @IsIn(['upcoming', 'ongoing', 'finished'])
    status?: 'upcoming' | 'ongoing' | 'finished';
}

export type IVesselCreateDTO = Omit<IVessel, '_id' | 'currentLength' | 'owner'>
export type IVesselUpdateDTO = Partial<Pick<IVessel, 'finalLength' | 'status'>>