import { ForbiddenException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "src/user/user.schema";
import { AuthDto } from "./dto";
import * as argon from "argon2";

@Injectable({})
export class AuthService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        private jwt: JwtService,
        private config: ConfigService,
    ) {}

    async login(dto: AuthDto) {
        // find user in DB by email
        const user = await this.userModel.findOne({ email: dto.email });
        if (!user) {
            throw new ForbiddenException("Credentials incorrect");
        }

        // compare passwd
        const passwdMatches = await argon.verify(user.password, dto.password);
        if (!passwdMatches) {
            throw new ForbiddenException("Credentials incorrect");
        }

        // return the JWT signed user
        return this.signToken(user._id.toString(), user.email);
    };

    async register(dto: AuthDto) {
        // gen passwd
        const hash = await argon.hash(dto.password);
        // save user in DB
        const user = await this.userModel.insertMany([{
            email: dto.email, password: hash
        }]);
        // return JWT signed user
        return this.signToken(user[0]._id.toString(), user[0].email);
    };

    signToken(userId: string, email: string) {
        const payload = {
            sub: userId,
            email,
        };

        const secret = this.config.get("JWT_SECRET");

        return this.jwt.signAsync(payload, {
            expiresIn: '15m',
            secret,
        });
    }
}