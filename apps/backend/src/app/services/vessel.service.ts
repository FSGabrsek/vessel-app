import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Vessel as VesselModel, VesselDocument, IVessel, IVesselCreateDTO, IVesselUpdateTO, Watch as WatchModel, WatchDocument } from "@vessel/shared";
import mongoose, { Model, Mongoose } from "mongoose";

@Injectable()
export class VesselService {
    private readonly logger: Logger = new Logger(VesselService.name);

    constructor(
        @InjectModel(VesselModel.name) private vesselModel: Model<VesselDocument>,
        @InjectModel(WatchModel.name) private watchModel: Model<WatchDocument>,
    ) {}

    createFuzzyRegex(filter: string): RegExp {
        const escaped = filter.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        const pattern = escaped.split('').map(char => `${char}.*`).join('');
        return new RegExp(pattern, 'i');
    }

    async findAll(filter?: string): Promise<IVessel[]> {
        this.logger.log(`Finding all vessels`);
        
        const regex = filter ? this.createFuzzyRegex(filter) : new RegExp('.*', 'i');
        return this.vesselModel.find({ title: { $regex: regex } }).populate('owner').exec();
    }

    async findOneById(_id: string): Promise<IVessel | null> {
        this.logger.log(`Finding vessel with id ${_id}`);

        return this.vesselModel.findOne({ _id }).populate('owner').exec();
    }

    async create(vessel: IVesselCreateDTO, owner_id: string): Promise<IVessel> {
        this.logger.log(`Creating vessel with title ${vessel.title}`)

        const createItem = {
            ...vessel,
            owner: owner_id
        }

        return this.vesselModel.create(createItem);
    }

    async update(_id: string, vessel: IVesselUpdateTO, user_id: string): Promise<IVessel> {
        this.logger.log(`Updating vessel with id ${_id}`)

        const item = await this.vesselModel.findOne({ _id }).populate('owner').exec();

        if (item === null) {
            throw new HttpException(null, HttpStatus.NOT_FOUND);
        }
        if (item.owner._id.toString() !== user_id) {
            throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
        }
        
        return this.vesselModel.findOneAndUpdate({ _id }, vessel, { new: true }).exec();
    }

    async delete(_id: string, user_id: string): Promise<IVessel> {
        this.logger.log(`Deleting vessel with id ${_id}`)

        const item = await this.vesselModel.findOne({ _id }).populate('owner').exec();
        if (item === null) {
            throw new HttpException(null, HttpStatus.NOT_FOUND);
        }
        if (item.owner._id.toString() !== user_id) {
            throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
        }

        const dependants = await this.watchModel.aggregate([
            { $match: { vessel: new mongoose.Types.ObjectId(_id) } },
            { $match: { owner: { $ne: new mongoose.Types.ObjectId(user_id) } } }
        ])
        if (dependants.length !== 0) {
            throw new HttpException('Cannot delete vessels with active users', HttpStatus.FORBIDDEN);
        }

        const mongoSession = await this.vesselModel.startSession();

        mongoSession.startTransaction();

        try {
            await this.watchModel.deleteMany({ vessel: new mongoose.Types.ObjectId(_id), owner: new mongoose.Types.ObjectId(user_id) }, { session: mongoSession }).exec()
            const deletedItem = await this.vesselModel.findOneAndDelete({ _id }, { session: mongoSession }).exec();
            await mongoSession.commitTransaction();

            return deletedItem;
        } catch (error) {
            await mongoSession.abortTransaction();
            throw error;
        } finally {
            mongoSession.endSession();
        }
    }
}