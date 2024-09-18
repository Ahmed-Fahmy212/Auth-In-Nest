import { forwardRef, HttpException, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UsersRepository } from './users.repository';
import { AuthService } from '../auth/auth.service';
@Injectable()
export class UsersService {
  constructor(private userRepository: UsersRepository) { }


  public async findByUsername(username: string): Promise<User> {
    try {
      const user = await this.userRepository.findByUsername(username);
      return user;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
  ////////////////////////////////////////////////////////////////////
  public async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = await this.userRepository.create(createUserDto);
    if (!createdUser) {
      throw new HttpException('User creation failed', 400);
    }
    return createdUser;
  }
////////////////////////////////////////////////////////////////////
public async getUserByEmail(email: string) {
  return this.userRepository.getUserByEmail(email);
}
////////////////////////////////////////////////////////////////////
public async makeUserVerified(userId: string) {
  return this.userRepository.makeUserVerified(userId);
}

////////////////////////////////////////////////////////////////////
//   findAll() {
//   return `This action returns all users`;
// }
// ////////////////////////////////////////////////////////////////////
// findOne(id: number) {
//   return `This action returns a #${id} user`;
// }
// ////////////////////////////////////////////////////////////////////
// update(id: number, updateUserDto: UpdateUserDto) {
//   return `This action updates a #${id} user`;
// }
// ////////////////////////////////////////////////////////////////////
// remove(id: number) {
//   return `This action removes a #${id} user`;
// }
}
