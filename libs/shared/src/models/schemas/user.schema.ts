import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IsMongoId } from 'class-validator';
import { IUser } from '../interfaces/user.interface';

export type UserDocument = User & Document;

@Schema()
export class User implements IUser {
    @IsMongoId()
    _id!: string;

    @Prop({ required: true, type: String })
    username!: string;

    @Prop({ required: true, select: false, type: String})
    password!: string;

    @Prop({ required: true, unique: true, type: String })
    email!: string;

    @Prop({ required: true, type: Date })
    dateOfBirth!: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);