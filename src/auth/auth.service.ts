import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from 'bcrypt';
import { UsersService } from "src/users/users.service";


@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    async validateUser(userName: string, pass: string): Promise<any> {
        const user = await this.usersService.findOne(userName)
        if (user && (await bcrypt.compare(pass, user.password))) {
            const { password, ...result } = user
            return user
        }
        return null
    }

    async login(user: any) {
        const payload = { userName: user.userName, sub: user.id };
        return {
            access_token: this.jwtService.sign(payload),
            userId: user.id,
            userName: user.userName
        }
    }
}