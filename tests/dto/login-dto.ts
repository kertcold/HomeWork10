export class loginDto {
  username: string
  password: string

  constructor(username: string, password: string) {
    this.username = username
    this.password = password
  }
  static createLoginWithCorrectData(): loginDto {
    return new loginDto(process.env.USER || '', process.env.PASSWORD || '')
  }

  static createLoginWithIncorrectData(): loginDto {
    return new loginDto('incorrect-username', 'incorrect-password')
  }
}
