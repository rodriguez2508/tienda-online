import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ){}
  
  async create(userData: Partial<User>): Promise<User> {
    const user = this.userRepo.create(userData);
    return this.userRepo.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.userRepo.find();
  }



  async findOne(id: string): Promise<User | null> {
    return this.userRepo.findOneBy({ id });
  }

  /**
   * Find a user by their email.
   *
   * @param email The email to search for.
   * @returns The user if found, otherwise `null`.
   */
  async findOneByEmail(email: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { email } });
  }
  
  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
