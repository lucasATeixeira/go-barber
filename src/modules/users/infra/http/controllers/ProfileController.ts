import { Request, Response } from 'express';

import { container } from 'tsyringe';

import UpdateProfileService from '@modules/users/services/UpdateProfileService';
import ShowProfileService from '@modules/users/services/ShowProfileService';

export default class ProfileControllers {
  public async show(request: Request, response: Response): Promise<Response> {
    const showUser = container.resolve(ShowProfileService);

    const user = await showUser.execute(request.user.id);

    return response.json(user);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { name, email, password, old_password } = request.body;

    const updateProfile = container.resolve(UpdateProfileService);

    const user = await updateProfile.execute({
      name,
      email,
      password,
      old_password,
      user_id: request.user.id,
    });

    delete user.password;

    return response.json(user);
  }
}
