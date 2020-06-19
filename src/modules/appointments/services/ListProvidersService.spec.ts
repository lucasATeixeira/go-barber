import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ListProvidersService from './ListProvidersService';

describe('ListProvidersService', () => {
  let usersRepository: FakeUsersRepository;
  let listProviders: ListProvidersService;

  beforeEach(() => {
    usersRepository = new FakeUsersRepository();
    listProviders = new ListProvidersService(usersRepository);
  });

  it('should be able to list providers', async () => {
    const userPayload1 = {
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123',
    };

    const userPayload2 = {
      name: 'John Tre',
      email: 'johntre@example.com',
      password: '1',
    };

    const loggedUserPayload = {
      name: 'John Qua',
      email: 'johnqua@example.com',
      password: '1',
    };

    const user1 = await usersRepository.create(userPayload1);
    const user2 = await usersRepository.create(userPayload2);
    const loggedUser = await usersRepository.create(loggedUserPayload);

    const providers = await listProviders.execute(loggedUser.id);

    expect(providers).toEqual([user1, user2]);
  });
});
