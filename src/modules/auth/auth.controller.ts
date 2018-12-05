import { Controller, Get, Res, Req } from '@nestjs/common'
import { AuthService } from './auth.service'
import { Logging } from 'adal-node';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ){

  }

  @Get()
  async login(@Res() res): Promise<string> {
    return await this.authService.login(res)
  }

  @Get('openid/return')
  async openIdReturn(@Req() req): Promise<string> {
    return await this.authService.openIdReturn(req)
  }

}