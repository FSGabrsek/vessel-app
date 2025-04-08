
export interface IUser {
    _id: string;
    username: string;
    password: string;
    email: string;
    dateOfBirth: Date;
}

export interface ILinkedUser extends IUser {
    follows: IUser[];
    followers: IUser[];
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

export type IUserLoginDTO = Pick<IUser, 'email' | 'password'>

export type IUserDTO = Omit<IUser, 'password'>
export type IUserCreateDTO = Pick<IUser, 'username' | 'password' | 'email' |'dateOfBirth'>;
export type IUserUpdateDTO = Partial<IUserUpdateModel>;