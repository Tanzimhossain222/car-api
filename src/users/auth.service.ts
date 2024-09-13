import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { scrypt as _scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';
import { UsersService } from './users.service';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}
  async signUp(email: string, password: string, name: string) {
    // See if email is in use
    const users = await this.usersService.find(email);
    if (users.length) {
      throw new ConflictException('Email is already in use');
    }

    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    const result = salt + '.' + hash.toString('hex');

    const user = await this.usersService.create(email, result, name);

    return user;
  }

  async signIn(email: string, password: string) {
    // Find the user with the email
    const [user] = await this.usersService.find(email);

    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    const [salt, storedHash] = user.password.split('.');
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('Invalid credentials');
    }

    return user;
  }
}
