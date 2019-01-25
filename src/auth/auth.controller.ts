import { Controller, Get, Res, Req, Query, Post, Body } from '@nestjs/common'
import { AuthService } from './auth.service'
import { Logging } from 'adal-node'

import { TicketDto, OpenIdReturnDto } from './dto'

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
  async ticket(@Query() query: TicketDto): Promise<string> {
    const { ticket } = query
    return await this.authService.ticket(ticket)
  }

  /**
   * redirect to Authentication url
   *
   * @param {*} res
   * @returns {Promise<string>}
   * @memberof AuthController
   */
  @Get('login')
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
  async openIdReturn(@Query() query: OpenIdReturnDto, @Req() req): Promise<string> {
    const { state: ticket } = query
    return await this.authService.openIdReturn(req, ticket)
  }

  @Post('status')
  async status(@Body() body: TicketDto): Promise<boolean> {
    const { ticket } = body
    return await this.authService.status(ticket)
  }

}