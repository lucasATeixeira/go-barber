import { getRepository, Repository } from 'typeorm';

import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';

import UserToken from '../entities/UserToken';

export default class UserTokensRepository implements IUserTokensRepository {
  private orm: Repository<UserToken>;

  constructor() {
    this.orm = getRepository(UserToken);
  }

  public async generate(user_id: string): Promise<UserToken> {
    const userToken = this.orm.create({ user_id });

    await this.orm.save(userToken);

    return userToken;
  }

  public findByToken(token: string): Promise<UserToken | undefined> {
    return this.orm.findOne({ where: { token } });
  }
}
