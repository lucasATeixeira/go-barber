import User from '../infra/typeorm/entities/User';
import ICreateUserDTO from '../dtos/ICreateUserDTO';
import IFindAllProviders from '../dtos/IFindAllProvidersDTO';

export default interface IUsersRepository {
  create(data: ICreateUserDTO): Promise<User>;
  findAllProviders(data: IFindAllProviders): Promise<User[]>;
  findById(id: string): Promise<User | undefined>;
  findByEmail(email: string): Promise<User | undefined>;
  save(user: User): Promise<User>;
}
