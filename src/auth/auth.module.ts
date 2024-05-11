import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/user/user.schema';
import { ConfigModule } from '@nestjs/config';


@Module({
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), 
        JwtModule.register({}),
        ConfigModule,
    ],
    controllers: [AuthController],
    providers: [AuthService],
})
export class AuthModule {}
