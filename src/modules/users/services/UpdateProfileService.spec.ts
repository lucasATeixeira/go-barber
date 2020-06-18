import AppError from '@shared/errors/AppError';

import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateProfileService from './UpdateProfileService';

describe('UpdateProfileService', () => {
  let hashProvider: FakeHashProvider;
  let usersRepository: FakeUsersRepository;
  let updateProfile: UpdateProfileService;

  beforeEach(() => {
    usersRepository = new FakeUsersRepository();
    hashProvider = new FakeHashProvider();
    updateProfile = new UpdateProfileService(usersRepository, hashProvider);
  });

  it('should be able to update profile', async () => {
    const userPayload = {
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123',
    };

    const updateUserPayload = {
      name: 'Changed Name',
      email: 'changedemail@example.com',
    };

    const user = await usersRepository.create(userPayload);

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      ...updateUserPayload,
    });

    expect(updatedUser.name).toBe(updateUserPayload.name);
    expect(updatedUser.email).toBe(updateUserPayload.email);
  });

  it('should be able to update passowrd', async () => {
    const userPayload = {
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123',
    };

    const updateUserPayload = {
      name: 'Changed Name',
      email: 'changedemail@example.com',
      old_password: userPayload.password,
      password: 'changed-password',
    };

    const user = await usersRepository.create(userPayload);

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      ...updateUserPayload,
    });

    expect(updatedUser.password).toBe(updateUserPayload.password);
  });

  it('should not be able to updtae profile of a non existing user', async () => {
    const updateUserPayload = {
      name: 'Changed Name',
      email: 'changedemail@example.com',
    };

    await expect(
      updateProfile.execute({
        user_id: 'non-existing-user-id',
        ...updateUserPayload,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to change email with an existing email', async () => {
    const userPayload = {
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123',
    };

    const preExistingUserPayload = {
      name: 'Random User',
      email: 'random@example.com',
      password: '123',
    };

    const updateUserPayload = {
      name: 'Changed Name',
      email: preExistingUserPayload.email,
    };

    await usersRepository.create(preExistingUserPayload);

    const user = await usersRepository.create(userPayload);

    await expect(
      updateProfile.execute({ user_id: user.id, ...updateUserPayload }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update password without sending old password', async () => {
    const userPayload = {
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123',
    };

    const updateUserPayload = {
      name: 'Changed Name',
      email: 'changedemail@example.com',
      password: 'changed-password',
    };

    const user = await usersRepository.create(userPayload);

    await expect(
      updateProfile.execute({
        user_id: user.id,
        ...updateUserPayload,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('shoult not be able to update password with wrong old password', async () => {
    const userPayload = {
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123',
    };

    const updateUserPayload = {
      name: 'Changed Name',
      email: 'changedemail@example.com',
      old_password: 'wrong_old_password',
      password: 'changed-password',
    };

    const user = await usersRepository.create(userPayload);

    await expect(
      updateProfile.execute({
        user_id: user.id,
        ...updateUserPayload,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
