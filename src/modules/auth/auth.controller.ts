import { Controller, Get, Res, Req, Query, Post } from '@nestjs/common'
import { AuthService } from './auth.service'
import { Logging } from 'adal-node'

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ){

  }

  /**
   * return ticket to client
   * client use ticket open browser & query login
   * @param {*} res
   * @returns {Promise<string>}
   * @memberof AuthController
   */
  @Get('ticket')
  async ticket(): Promise<string> {
    return await this.authService.ticket()
  }

  /**
   * redirect to Authentication url
   *
   * @param {*} res
   * @returns {Promise<string>}
   * @memberof AuthController
   */
  @Post('login')
  async login(@Query() query, @Res() res): Promise<string> {
    const { token } = query
    return await this.authService.login(token, res)
  }

  /**
   * Once Authentication passed in AAD, redirect to this api
   * Store accessToken & return to client once client request accessToken
   * @param {*} req
   * @returns {Promise<string>}
   * @memberof AuthController
   */
  @Get('openid/return')
  async openIdReturn(@Req() req): Promise<string> {
    return await this.authService.openIdReturn(req)
  }

}