import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) { }

  async register(registerDto: RegisterDto) {

    const exists = await this.usersService.findOneByEmail(registerDto.email);
    if (exists) throw new ConflictException('El email ya está registrado');

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const user = await this.usersService.create({
      name: registerDto.name,
      email: registerDto.email,
      password: hashedPassword,
      role: UserRole.USER,
    });
    return { message: 'Usuario registrado', userId: user.id };
  }

  async login(loginDto: LoginDto) {
    console.log("🚀 ~ AuthService ~ login ~ loginDto:", loginDto)
    const user = await this.usersService.findOneByEmail(loginDto.email);
    console.log("🚀 ~ AuthService ~ login ~ user:", user)
    if (!user || !(await bcrypt.compare(loginDto.password, user.password))) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}