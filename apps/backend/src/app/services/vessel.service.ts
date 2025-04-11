import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Vessel as VesselModel, VesselDocument, IVessel, IVesselCreateDTO, IVesselUpdateDTO, Watch as WatchModel, WatchDocument } from "@vessel/shared";
import mongoose, { Model, Mongoose } from "mongoose";
import { Neo4jService } from "nest-neo4j/dist";

@Injectable()
export class VesselService {
    private readonly logger: Logger = new Logger(VesselService.name);

    constructor(
        @InjectModel(VesselModel.name) private vesselModel: Model<VesselDocument>,
        @InjectModel(WatchModel.name) private watchModel: Model<WatchDocument>,
        private readonly neo4jService: Neo4jService
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

    async reccommend(_userId: string, count: number): Promise<IVessel[]> {
        const recommendQuery = `
            MATCH (u:User {id: $userId})-[:FOLLOWS]->(f:User)-[:LIKES]->(v:Vessel)
            WHERE NOT (u)-[:DISLIKED]->(v)
            WITH v, COUNT(f) AS likesFromFollowed
            RETURN v.id as id
            ORDER BY likesFromFollowed DESC
        `;

        const recommendations = await this.neo4jService.read(recommendQuery, { userId: _userId });
        const recommendedIds = recommendations.records.map(record => record.get('id'));

        const rawVessels = await this.vesselModel.aggregate([
            {
                $facet: {
                    recommended: [
                        { $match: { _id: { $in: recommendedIds.map(id => new mongoose.Types.ObjectId(id)) } } },
                        { $sample: { size: count } }
                    ],
                    fallback: [
                        { $match: { _id: { $nin: recommendedIds.map(id => new mongoose.Types.ObjectId(id)) } } },
                        { $sample: { size: count } }
                    ]
                }
            },
            {
                $project: {
                    combined: {
                        $concatArrays: [
                            "$recommended",
                            { $slice: ["$fallback", { $subtract: [count, { $size: "$recommended" }] }] }
                        ]
                    }
                }
            },
            { $unwind: "$combined" },
            { $replaceRoot: { newRoot: "$combined" } },
            {
                $lookup: {
                  from: "users",
                  localField: "owner",
                  foreignField: "_id",
                  as: "owner"
                }
            },
            { $unwind: { path: "$owner", preserveNullAndEmptyArrays: true } },
            { $project: { "owner.password": 0 } }
        ]);

        const vesselDocuments = rawVessels.map(v => this.vesselModel.hydrate(v))
        this.vesselModel.populate(vesselDocuments, { path: "owner" })
        return vesselDocuments.map(v => v.toObject())
    }

    async create(vessel: IVesselCreateDTO, owner_id: string): Promise<IVessel> {
        this.logger.log(`Creating vessel with title ${vessel.title}`)

        const createItem = {
            ...vessel,
            owner: owner_id
        }

        return this.vesselModel.create(createItem);
    }

    async update(_id: string, vessel: IVesselUpdateDTO, user_id: string): Promise<IVessel> {
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

        const neo4jSession = this.neo4jService.getWriteSession();

        mongoSession.startTransaction();
        const neo4jTransaction = neo4jSession.beginTransaction();

        try {
            await this.watchModel.deleteMany({ vessel: new mongoose.Types.ObjectId(_id), owner: new mongoose.Types.ObjectId(user_id) }, { session: mongoSession }).exec()
            const deletedItem = await this.vesselModel.findOneAndDelete({ _id }, { session: mongoSession }).exec();

            const query = `
                MATCH (v:Vessel {id: $vesselId})
                DETACH DELETE v
            `;

            await neo4jTransaction.run(query, {
                vesselId: _id.toString()
            });

            await mongoSession.commitTransaction();
            await neo4jTransaction.commit();

            return deletedItem;
        } catch (error) {
            await mongoSession.abortTransaction();
            await neo4jTransaction.rollback();
            throw error;
        } finally {
            mongoSession.endSession();
            neo4jSession.close();
        }
    }
}