import { Length, IsNotEmpty } from 'class-validator'

export class TicketDto {

  @Length(48, 48)
  @IsNotEmpty()
  public ticket: string
}
