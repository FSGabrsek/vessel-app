import { Injectable, Logger } from '@nestjs/common';
import {
    ConflictException,
    UnauthorizedException
} from '@nestjs/common/exceptions';
import {
    User as UserModel,
    UserDocument,
    IUserLoginDTO,
    IUserIdentity,
    IUserCreateDTO
} from '@vessel/shared';
import { JwtService } from '@nestjs/jwt';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { compare, hash } from 'bcrypt';
import { Neo4jService } from 'nest-neo4j/dist';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);

    constructor(
        @InjectModel(UserModel.name) private userModel: Model<UserDocument>,
        private jwtService: JwtService,
        private readonly neo4jService: Neo4jService
    ) {}

    async login(credentials: IUserLoginDTO): Promise<IUserIdentity> {
        this.logger.log('Login ' + credentials.email);

        try {
            const user = await this.userModel
                .findOne({ email: credentials.email })
                .select('+password')
                .exec();
    
            if (!user) {
                this.logger.debug('User not found');
                throw new UnauthorizedException('Email not found or password invalid');
            }

            const isPasswordValid = await compare(credentials.password, user.password);

            if (!isPasswordValid) {
                this.logger.debug('Invalid password');
                throw new UnauthorizedException('Email not found or password invalid');
            }
    
            const payload = { user_id: user._id };
            return {
                _id: user._id,
                username: user.username,
                email: user.email,
                token: this.jwtService.sign(payload),
            };
        } catch (error) {
            this.logger.error('Login error', error);
            throw error;
        }
    }

    async register(user: IUserCreateDTO): Promise<IUserIdentity> {
        this.logger.log(`Register user ${user.username}`);
        
        const mongoSession = await this.userModel.startSession();
        const neo4jSession = this.neo4jService.getWriteSession();

        mongoSession.startTransaction();
        const neo4jTransaction = neo4jSession.beginTransaction();

        try {
            if (await this.userModel.findOne({ emailAddress: user.email })) {
                this.logger.debug('user exists');
                throw new ConflictException('User already exist');
            }
            const hashedPassword = await hash(user.password, 10);

            const createdItem = await this.userModel.create(
                [{ ...user, password: hashedPassword }],
                { session: mongoSession },
            );
            
            const createUserQuery = `
            CREATE (u:User {id: $id, username: $username})
            RETURN u
            `;
            await neo4jTransaction.run(createUserQuery, {
                id: createdItem[0]._id.toString(),
                username: user.username,
            });
    
            await mongoSession.commitTransaction();
            await neo4jTransaction.commit();
            
            const { password, ...safeUser } = createdItem[0];
            return safeUser;
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
