import { IsString, IsEmail, IsDate, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export interface IUser {
    _id: string;
    username: string;
    password: string;
    email: string;
    dateOfBirth: Date;
}

export interface ILinkedUser extends IUserDTO {
    follows: IUserDTO[];
    followers: IUserDTO[];
}

export interface IUserIdentity {
    _id: string;
    username: string;
    email: string;
    token?: string;
}

interface IUserUpdateModel {
    username: string;
    oldPassword: string
    password: string;
    email: string;
    dateOfBirth: Date;
}


export class UserDTO implements Omit<IUser, 'password'> {
    @IsString()
    _id!: string;

    @IsString()
    username!: string;

    @IsEmail()
    email!: string;

    @IsDate()
    @Type(() => Date)
    dateOfBirth!: Date;
}

export class LinkedUserDTO extends UserDTO implements ILinkedUser{
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => UserDTO)
    follows!: UserDTO[];

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => UserDTO)
    followers!: UserDTO[];
}

export class UserIdentityDTO implements IUserIdentity {
    @IsString()
    _id!: string;

    @IsString()
    username!: string;

    @IsEmail()
    email!: string;

    @IsOptional()
    @IsString()
    token?: string;
}

export class UserUpdateModelDTO implements IUserUpdateDTO {
    @IsString()
    username!: string;

    @IsString()
    oldPassword!: string;

    @IsString()
    password!: string;

    @IsEmail()
    email!: string;

    @IsDate()
    @Type(() => Date)
    dateOfBirth!: Date;
}

export class UserLoginDTO implements IUserLoginDTO {
    @IsEmail()
    email!: string;

    @IsString()
    password!: string;
}

export class UserCreateDTO implements IUserCreateDTO {
    @IsString()
    username!: string;

    @IsString()
    password!: string;

    @IsEmail()
    email!: string;

    @IsDate()
    @Type(() => Date)
    dateOfBirth!: Date;
}

export class UserUpdateDTO implements IUserUpdateDTO {
    @IsOptional()
    @IsString()
    username?: string;

    @IsOptional()
    @IsString()
    oldPassword?: string;

    @IsOptional()
    @IsString()
    password?: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    dateOfBirth?: Date;
}

export type IUserLoginDTO = Pick<IUser, 'email' | 'password'>

export type IUserDTO = Omit<IUser, 'password'>
export type IUserCreateDTO = Pick<IUser, 'username' | 'password' | 'email' |'dateOfBirth'>;
export type IUserUpdateDTO = Partial<IUserUpdateModel>;