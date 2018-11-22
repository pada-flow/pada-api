import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  ticket(): string {
    return ' this is your ticket';
  }
}
