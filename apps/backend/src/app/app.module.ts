import { Logger, Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './controllers/auth.controller';
import { UserController } from './controllers/user.controller';
import { AuthService } from './services/auth.service';
import { User, UserSchema, Vessel, VesselSchema, Watch, WatchSchema } from '@vessel/shared';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { UserService } from './services/user.service';
import { Neo4jModule } from 'nest-neo4j/dist';
import { VesselController } from './controllers/vessel.controller';
import { WatchController } from './controllers/watch.controller';
import { VesselService } from './services/vessel.service';
import { WatchService } from './services/watch.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI, {
        connectionFactory: (connection) => {
            connection.on('connected', () => {
                Logger.verbose(
                    `Mongoose db connected to ${process.env.MONGO_URI}`
                );
            });
            connection._events.connected();
            return connection;
        }
    }),
    Neo4jModule.forRoot({
        scheme: 'neo4j+s',
        host: '1f773e0a.databases.neo4j.io',
        port: 7687,
        username: process.env.NEO4J_USER,
        password: process.env.NEO4J_PASSWORD
    }),
    MongooseModule.forFeature([
        { name: User.name, schema: UserSchema },
        { name: Vessel.name, schema: VesselSchema },
        { name: Watch.name, schema: WatchSchema },
    ]),
    JwtModule.register({
        secret: process.env['JWT_SECRET'],
        signOptions: { expiresIn: '12 days' }
    })
  ],
  controllers: [AuthController, UserController, VesselController, WatchController],
  providers: [AuthService, UserService, VesselService, WatchService],
})
export class AppModule {}
