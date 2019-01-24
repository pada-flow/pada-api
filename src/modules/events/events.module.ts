import { Module } from '@nestjs/common';
import { EventsGateway } from './events.controller';

@Module({
  providers: [EventsGateway],
})
export class EventsModule {};