import { Controller, Get } from '@nestjs/common'
import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ){

  }

  @Get()
  async login(): Promise<string> {
    return await this.authService.login()
  }

  @Get('/token')
  getToken(): string {
    return 'your token'
  }
}