import { uuid } from 'uuidv4';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import IFindAllProviders from '@modules/users/dtos/IFindAllProvidersDTO';
import User from '../../infra/typeorm/entities/User';

export default class FakeUsersRepository implements IUsersRepository {
  private users: User[] = [];

  public async create({
    name,
    email,
    password,
  }: ICreateUserDTO): Promise<User> {
    const user = new User();
    Object.assign(user, { id: uuid(), name, email, password });
    this.users.push(user);
    return user;
  }

  public async findAllProviders({
    except_user_id,
  }: IFindAllProviders): Promise<User[]> {
    let { users } = this;

    if (except_user_id) {
      users = this.users.filter(user => user.id !== except_user_id);
    }

    return users;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const findUser = this.users.find(user => user.email === email);

    return findUser;
  }

  public async findById(id: string): Promise<User | undefined> {
    const findUser = this.users.find(user => user.id === id);

    return findUser;
  }

  public async save(user: User): Promise<User> {
    const index = this.users.findIndex(
      currentUser => currentUser.id === user.id,
    );

    this.users[index] = user;

    return user;
  }
}
