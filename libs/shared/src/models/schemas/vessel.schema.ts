import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from 'mongoose';
import { IsMongoId } from "class-validator";
import { IVessel } from "../interfaces/vessel.interface";
import { IUser } from "../interfaces/user.interface";

export type VesselDocument = Vessel & Document;

@Schema()
export class Vessel implements IVessel {
    @IsMongoId()
    _id!: string;

    @Prop({ required: true, type: String })
    title!: string;
    
    @Prop({ required: true, type: String })
    type!: "series" | "film" | "literature";
    
    @Prop({ required: true, type: String })
    synopsis!: string;
    
    @Prop({ required: true, type: Number })
    finalLength!: number;
    
    @Prop({ required: true, type: Date })
    releaseDate!: Date;
    
    @Prop({ required: true, type: Number })
    releaseInterval!: number;

    @Prop({ required: false, type: Boolean, default: false })
    bulkRelease?: boolean;
    
    @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: "User" })
    owner!: IUser;

    @Prop({ required: true, type: String })
    status!: "upcoming" | "ongoing" | "finished" 

    get currentLength(): number {
        const now = Date.now();
        const releaseTime = this.releaseDate.getTime();
        const elapsedTime = now - releaseTime;

        if (this.status == 'finished') {
            return this.finalLength // Done, final length
        }

        if (this.status == 'upcoming') {
            return 0; // Before release, no progress
        }

        if (this.bulkRelease) {
            return this.finalLength // Everything released at once, final length
        }

        if (elapsedTime < 0) {
            return 0; // Before release, no progress
        }

        const elapsedIntervals = Math.floor(elapsedTime / (this.releaseInterval * 24 * 60 * 60 * 1000));
        return Math.min(this.finalLength, elapsedIntervals);
    }
}

export const VesselSchema = SchemaFactory.createForClass(Vessel);

VesselSchema.virtual("currentLength").get(function (this: VesselDocument) {
    const now = Date.now();
    const releaseTime = this.releaseDate.getTime();
    const elapsedTime = now - releaseTime;

    if (elapsedTime < 0) {
        return 0; // Before release, no progress
    }

    const elapsedIntervals = Math.floor(elapsedTime / (this.releaseInterval * 24 * 60 * 60 * 1000));
    return Math.min(this.finalLength, elapsedIntervals);
});

VesselSchema.set("toJSON", { virtuals: true });
VesselSchema.set("toObject", { virtuals: true });