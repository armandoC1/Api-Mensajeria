import { Body, Controller, Get, HttpException, HttpStatus, Post } from "@nestjs/common";
import { UsersService } from "./users.service";
import * as bcrypt from 'bcrypt';
import { User } from "./entities/user.entity";

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) { }

  @Post('register')
  async register(@Body() userData: { userName: string; password: string }) {
    try {
      const hashedPassword = await bcrypt.hash(userData.password, 10);

      const newUser = new User();
      newUser.userName = userData.userName;
      newUser.password = hashedPassword;

      const createdUser = await this.userService.create(newUser);

      return {
        statusCode: HttpStatus.CREATED,
        success: true,
        message: 'Usuario registrado exitosamente',
        user: {
          id: createdUser.id,
          userName: createdUser.userName,
        },
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          success: false,
          message: 'Error al registrar el usuario',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('list')
  findAll() {
    return this.userService.findAll()
  }
}