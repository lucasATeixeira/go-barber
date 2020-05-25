import { getRepository } from 'typeorm';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

import authConfig from '../../config/auth';

import User from '../models/User';

interface RequestDTO {
  email: string;
  password: string;
}

interface Response {
  user: User;
  token: string;
}

export default class AuthenticateUserService {
  public async execute({ email, password }: RequestDTO): Promise<Response> {
    const usersRepository = getRepository(User);

    const user = await usersRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw Error('Incorrect Email/Password combination');
    }

    const passowrdMatched = await compare(password, user.password);

    if (!passowrdMatched) {
      throw Error('Incorrect Email/Password combination');
    }

    const { expiresIn, secret } = authConfig.jwt;

    const token = sign({}, secret, {
      subject: user.id,
      expiresIn,
    });

    return {
      user,
      token,
    };
  }
}
