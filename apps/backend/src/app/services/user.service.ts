import { ConflictException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User as UserModel, UserDocument, IUserUpdateDTO, ILinkedUser } from '@vessel/shared';
import { IUser, IUserDTO } from '@vessel/shared';
import { compare, hash } from 'bcrypt';
import { Neo4jService } from 'nest-neo4j/dist';

@Injectable()
export class UserService {
    private readonly logger: Logger = new Logger(UserService.name);

    constructor(
        @InjectModel(UserModel.name) private userModel: Model<UserDocument>,
        private readonly neo4jService: Neo4jService
    ) {}

    async findAll(): Promise<IUserDTO[]> {
        this.logger.log(`Finding all items`);
        const items = await this.userModel.find();
        return items;
    }

    async findOneById(_id: string): Promise<IUser | null> {
        this.logger.log(`Finding user with id ${_id}`);
        const item = await this.userModel.findOne({ _id }).exec();
        if (!item) {
            this.logger.debug('Item not found');
        }
        return item;
    }

    async findOneByEmail(email: string): Promise<IUserDTO | null> {
        this.logger.log(`Finding user by email ${email}`);
        const item = this.userModel
            .findOne({ email: email })
            .exec();
        return item;
    }

    async update(_id: string, user: IUserUpdateDTO): Promise<IUserDTO | null> {
        this.logger.log(`Update user ${user.username}`);

        const mongoSession = await this.userModel.startSession();
        const neo4jSession = this.neo4jService.getWriteSession();

        mongoSession.startTransaction();
        const neo4jTransaction = neo4jSession.beginTransaction();

        try {
            if (await this.userModel.findOne({ email: user.email, _id: { $ne: new mongoose.Types.ObjectId(_id) } })) {
                this.logger.debug('user exists');
                throw new ConflictException('User already exist');
            }

            if (user.password) {
                const item = await this.userModel
                            .findOne({ _id })
                            .select('+password')
                            .exec();
                
                if (!item) {
                    this.logger.debug('User not found');
                    throw new UnauthorizedException('Email not found or password invalid');
                }
                const isPasswordValid = await compare(user.oldPassword, item.password);
                if (!isPasswordValid) {
                    throw new UnauthorizedException('Email not found or password invalid');
                }
                user.password = await hash(user.password, 10);
            }

            const updatedItem = await this.userModel.findByIdAndUpdate({ _id }, user, { new: true });
            
            const updatedUserQuery = `
            MATCH (u:User {id: $id})
            SET u.username = $username
            RETURN u
            `;

            await neo4jTransaction.run(updatedUserQuery, {
                id: _id.toString(),
                username: user.username,
            });

            await mongoSession.commitTransaction();
            await neo4jTransaction.commit();

            return updatedItem;
        } catch (error) {
            await mongoSession.abortTransaction();
            await neo4jTransaction.rollback();
            throw error;
        } finally {
            mongoSession.endSession();
            neo4jSession.close();
        }
    }

    async findOneLinkedById(_id: string): Promise<ILinkedUser | null> {
        this.logger.log(`Finding linked user with id ${_id}`);
        
        const item = await this.userModel.findOne({ _id }).exec();
        if (!item) {
            this.logger.debug('Item not found');
            return null;
        }
        
        const followsQuery = `
            MATCH (u:User {id: $id})-[:FOLLOWS]->(f:User)
            RETURN f.id AS id
        `;
        const followersQuery = `
            MATCH (u:User {id: $id})<-[:FOLLOWS]-(f:User)
            RETURN f.id AS id
        `;
        
        const followsResult = await this.neo4jService.read(followsQuery, { id: _id });
        const followersResult = await this.neo4jService.read(followersQuery, { id: _id });
        
        const followsIds = followsResult.records.map(record => record.get('id'));
        const followersIds = followersResult.records.map(record => record.get('id'));
        
        const follows = await this.userModel.find({ _id: { $in: followsIds } }).exec();
        const followers = await this.userModel.find({ _id: { $in: followersIds } }).exec();
        
        return { ...item.toObject(), follows, followers };
    }
    
    async follow(_id: string, followId: string): Promise<void> {
        this.logger.log(`Adding follow relation: ${_id} -> ${followId}`);
        if (await this.userModel.findOne({ _id: followId }) === null || await this.userModel.findOne({ _id }) === null) {
            throw new Error('Users do not exist');
        }
        const query = `
            MATCH (a:User {id: $followerId}), (b:User {id: $followingId})
            MERGE (a)-[:FOLLOWS]->(b)
        `;
        
        await this.neo4jService.write(query, { followerId: _id, followingId: followId });
    }

    async unfollow(_id: string, followId: string): Promise<void> {
        this.logger.log(`Removing follow relation: ${_id} -> ${followId}`);
        if (await this.userModel.findOne({ _id: followId }) === null || await this.userModel.findOne({ _id }) === null) {
            throw new Error('Users do not exist');
        }
        const query = `
            MATCH (a:User {id: $followerId})-[r:FOLLOWS]->(b:User {id: $followingId})
            DELETE r
        `;
        
        await this.neo4jService.write(query, { followerId: _id, followingId: followId });
    }
}
