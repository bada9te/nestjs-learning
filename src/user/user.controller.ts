import { Controller, Get, Req, Request, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';

@Controller('users')
export class UserController {
    @UseGuards(JwtGuard)
    @Get('me')
    getMe(@Request() req) {
        return {
            user: req.user,
        }
    }
}
