import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRepository: Repository<User>) { }


  public async findByUsernameOrFail(username: string): Promise<User> {
    try {
      return await this.userRepository.findOneBy({ username: username });
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
  ////////////////////////////////////////////////////////////////////
  public async create(createUserDto: CreateUserDto): Promise<User> {
    const { username, password } = createUserDto;
    const result = await this.userRepository.createQueryBuilder()
      .insert()
      .into(User)
      .values({ username, password })// password is hashed in the entity
      .execute();

    if (!result.raw || result.raw.length === 0) {
      throw new HttpException('User isn`t created', 404);
    }

    const createdUser = await this.userRepository.findOne({ where: { id: result.raw[0].id } });

    if (!createdUser) {
      throw new NotFoundException('User not found after creation');
    }
    return createdUser;
  }
}
////////////////////////////////////////////////////////////////////
  findAll() {
  return `This action returns all users`;
}
////////////////////////////////////////////////////////////////////
findOne(id: number) {
  return `This action returns a #${id} user`;
}
////////////////////////////////////////////////////////////////////
update(id: number, updateUserDto: UpdateUserDto) {
  return `This action updates a #${id} user`;
}
////////////////////////////////////////////////////////////////////
remove(id: number) {
  return `This action removes a #${id} user`;
}