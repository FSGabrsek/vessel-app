import { IReview, IWatch } from "../interfaces/watch.interface";
import { Document, Schema as MongooseSchema } from 'mongoose';

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsMongoId } from "class-validator";
import { IUser } from "../interfaces/user.interface";

export type ReviewDocument = Review & Document;
export type WatchDocument = Watch & Document;

@Schema()
export class Review implements IReview {
    @IsMongoId()
    _id!: string;

    @Prop({ required: true, type: String })
    rating!: "+" | "~" | "-";

    @Prop({ required: true, type: String })
    content!: string;

    @Prop({ required: true, type: Date })
    lastModified!: Date;
}

@Schema()
export class Watch implements IWatch {
    @IsMongoId()
    _id!: string;
    
    @Prop({ required: true, type: Number })
    progress!: number;
    
    @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: "Vessel" })
    vessel!: object;
    
    @Prop({ required: false, type: Object })
    review!: IReview;
    
    @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: "User" })
    owner!: IUser;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
export const WatchSchema = SchemaFactory.createForClass(Watch);