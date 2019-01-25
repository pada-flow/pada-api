import { Length, IsNotEmpty } from 'class-validator'

export class OpenIdReturnDto {

  @Length(48, 48)
  @IsNotEmpty()
  public state: string
  public code: string
}