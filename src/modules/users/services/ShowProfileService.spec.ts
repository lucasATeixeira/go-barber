import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import ShowProfileService from './ShowProfileService';

describe('UpdateProfileService', () => {
  let usersRepository: FakeUsersRepository;
  let showProfile: ShowProfileService;

  beforeEach(() => {
    usersRepository = new FakeUsersRepository();
    showProfile = new ShowProfileService(usersRepository);
  });

  it('should be able to update profile', async () => {
    const userPayload = {
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123',
    };

    const user = await usersRepository.create(userPayload);

    const profile = await showProfile.execute(user.id);

    expect(profile.name).toBe(user.name);
    expect(profile.email).toBe(user.email);
  });

  it('should not be able to show profile of a non existing user', async () => {
    await expect(
      showProfile.execute('non-existing-user-id'),
    ).rejects.toBeInstanceOf(AppError);
  });
});
