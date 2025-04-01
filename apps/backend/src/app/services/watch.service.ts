import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { IReview, IWatch, IWatchCreateDTO, IWatchUpdateDTO, WatchDocument, Watch as WatchModel } from "@vessel/shared";
import { Model } from "mongoose";
import { VesselService } from "./vessel.service";
import { UserService } from "./user.service";
import { Neo4jService } from "nest-neo4j/dist";

@Injectable()
export class WatchService {
    private readonly logger: Logger = new Logger(WatchService.name);

    constructor(
        @InjectModel(WatchModel.name) private watchModel: Model<WatchDocument>,
        private vesselService: VesselService,
        private userService: UserService,
        private readonly neo4jService: Neo4jService
        
    ) {}

    async findOneById(_id: string): Promise<IWatch> {
        this.logger.log(`Finding all watches`)

        return this.watchModel.findOne({ _id }).populate('vessel').populate('owner');
    }

    async findByOwner(owner_id: string): Promise<IWatch[]> {
        this.logger.log(`Finding all watches for owner ${owner_id}`)

        return this.watchModel.find({ owner: owner_id }).populate('vessel').populate('owner')
    }

    async create(watch: IWatchCreateDTO, owner_id: string): Promise<IWatch> {
        this.logger.log(`Creating watch entry for vessel with id ${watch.vessel}`)

        const createItem = {
            ...watch,
            vessel: await this.vesselService.findOneById(watch.vessel),
            owner: await this.userService.findOneById(owner_id)
        }

        return this.watchModel.create(createItem)
    }

    async update(_id: string, watch: IWatchUpdateDTO, user_id: string): Promise<IWatch> {
        this.logger.log(`Updating watch with id ${_id}`)

        const item = await this.watchModel.findOne({ _id }).populate('owner').exec();
        if (item === null) {
            throw new HttpException(null, HttpStatus.NOT_FOUND);
        }
        if (item.owner._id.toString() !== user_id) {
            throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
             
        }
        return this.watchModel.findOneAndUpdate({ _id }, watch, { new: true }).populate('vessel').populate('owner');
    }

    async delete(_id: string, user_id: string): Promise<IWatch> {
        this.logger.log(`Deleting watch with id ${_id}`)

        const item = await this.watchModel.findOne({ _id }).populate('owner').exec();
        if (item === null) {
            throw new HttpException(null, HttpStatus.NOT_FOUND);
        }
        if (item.owner._id.toString() !== user_id) {
            throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
             
        }

        const mongoSession = await this.watchModel.startSession();
        const neo4jSession = this.neo4jService.getWriteSession();

        mongoSession.startTransaction();
        const neo4jTransaction = neo4jSession.beginTransaction();

        try {
            const deletedItem = await this.watchModel.findOneAndDelete({ _id }, { session: mongoSession }).populate('vessel').populate('owner');

            const query = `
                MATCH (u:User {id: $userId})-[r]->(v:Vessel {id: $vesselId})
                DELETE r
                RETURN u, v
            `;

            await neo4jTransaction.run(query, {
                userId: user_id,
                vesselId: (deletedItem.vessel as any)._id.toString(),
            });

            await mongoSession.commitTransaction();
            await neo4jTransaction.commit();

            return deletedItem
        } catch (error) {
            await mongoSession.abortTransaction();
            await neo4jTransaction.rollback();
            throw error;
        } finally {
            mongoSession.endSession();
            neo4jSession.close();
        }
    }

    async createReview(_watch_id: string, review: IReview, user_id: string): Promise<IWatch> {
        this.logger.log(`Setting review entry for watch with id ${_watch_id}`)

        const item = await this.watchModel.findOne({ _id: _watch_id }).populate('owner').exec();
        if (item === null) {
            throw new HttpException(null, HttpStatus.NOT_FOUND);
        }
        if (item.owner._id.toString() !== user_id) {
            throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
        }

        const mongoSession = await this.watchModel.startSession();
        const neo4jSession = this.neo4jService.getWriteSession();

        mongoSession.startTransaction();
        const neo4jTransaction = neo4jSession.beginTransaction();

        try {
            const updatedItem = await this.watchModel.findOneAndUpdate({ _id: _watch_id }, { $set: { review: review }, }, { session: mongoSession, new: true }).populate('vessel').populate('owner');

            const query = `
                MERGE (v:Vessel {id: $vesselId})
                ON CREATE SET v.title = $vesselTitle

                WITH v

                MATCH (u:User {id: $userId})

                OPTIONAL MATCH (u)-[r:LIKES|DISLIKED|REVIEWED]->(v)
                DELETE r

                WITH u, v, $reviewRating AS rating

                FOREACH (_ IN CASE WHEN rating = '+' THEN [1] ELSE [] END |
                    MERGE (u)-[:LIKES]->(v)
                )
                FOREACH (_ IN CASE WHEN rating = '-' THEN [1] ELSE [] END |
                    MERGE (u)-[:DISLIKED]->(v)
                )
                FOREACH (_ IN CASE WHEN rating = '~' THEN [1] ELSE [] END |
                    MERGE (u)-[:REVIEWED]->(v)
                )

                RETURN u, v;
            `;

            this.logger.log(updatedItem)

            await neo4jTransaction.run(query, {
                userId: user_id,
                vesselId: (updatedItem.vessel as any)._id.toString(),
                vesselTitle: (updatedItem.vessel as any).title.toString(),
                reviewRating: review.rating
            });

            await mongoSession.commitTransaction();
            await neo4jTransaction.commit();

            return updatedItem
        } catch (error) {
            await mongoSession.abortTransaction();
            await neo4jTransaction.rollback();
            throw error;
        } finally {
            mongoSession.endSession();
            neo4jSession.close();
        }
    }

    async deleteReview(_watch_id: string, user_id: string): Promise<IWatch> {
        this.logger.log(`Removing review entry for watch with id ${_watch_id}`)

        const item = await this.watchModel.findOne({ _id: _watch_id }).populate('owner').exec();
        if (item === null) {
            throw new HttpException(null, HttpStatus.NOT_FOUND);
        }
        if (item.owner._id.toString() !== user_id) {
            throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
             
        }
        
        const mongoSession = await this.watchModel.startSession();
        const neo4jSession = this.neo4jService.getWriteSession();

        mongoSession.startTransaction();
        const neo4jTransaction = neo4jSession.beginTransaction();

        try {
            const updatedItem = await this.watchModel.findOneAndUpdate({ _id: _watch_id }, { $set: { review: null }, }, { session: mongoSession, new: true }).populate('vessel').populate('owner');

            const query = `
                MATCH (u:User {id: $userId})-[r]->(v:Vessel {id: $vesselId})
                DELETE r
                RETURN u, v
            `;

            await neo4jTransaction.run(query, {
                userId: user_id,
                vesselId: (updatedItem.vessel as any)._id.toString(),
            });

            await mongoSession.commitTransaction();
            await neo4jTransaction.commit();

            return updatedItem
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