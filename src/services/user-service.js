import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';

import {
  getUserValidation,
  loginUserValidation,
  registerUserValidation,
  updateUserValidation,
} from '../validations/user.validation.js';
import { validate } from '../validations/validation.js';
import { prismaClient } from '../application/database.js';
import { ResponseError } from '../error/response-error.js';
import { valid } from 'joi';

const register = async (request) => {
  const user = validate(registerUserValidation, request);

  const countUser = await prismaClient.user.count({
    where: {
      username: user.username,
    },
  });

  if (countUser === 1) {
    throw new ResponseError(400, 'Username already exists!');
  }

  // hashing user password
  user.password = await bcrypt.hash(user.password, 10);

  return await prismaClient.user.create({
    data: user,
    select: {
      username: true,
      name: true,
    },
  });
};

const login = async (request) => {
  const loginRequest = validate(loginUserValidation, request);

  const user = await prismaClient.user.findUnique({
    where: {
      username: loginRequest.username,
    },
    select: {
      username: true,
      password: true,
    },
  });

  if (!user) {
    throw new ResponseError(401, 'username or password is wrong!');
  }

  const isPasswordValid = await bcrypt.compare(
    loginRequest.password,
    user.password,
  );

  if (!isPasswordValid) {
    throw new ResponseError(401, 'username or password is wrong!');
  }

  const token = uuid().toString();

  return await prismaClient.user.update({
    data: {
      token,
    },
    where: {
      username: user.username,
    },
    select: {
      token: true,
    },
  });
};

const get = async (username) => {
  username = validate(getUserValidation, username);

  const user = await prismaClient.user.findUnique({
    where: {
      username,
    },
    select: {
      username: true,
      name: true,
    },
  });

  if (!user) {
    throw new ResponseError(404, 'User not found!');
  }

  return user;
};

const update = async (request) => {
  const user = validate(updateUserValidation, request);

  const totalUserInDb = await prismaClient.user.count({
    where: {
      username: user.username,
    },
  });

  if (totalUserInDb !== 1) {
    throw new ResponseError(404, 'User not found!');
  }

  const data = {};
  if (user.name) {
    data.name = user.name;
  }

  if (user.password) {
    data.password = await bcrypt.hash(user.password, 10);
  }

  return prismaClient.user.update({
    where: {
      username: user.username,
    },
    data,
    select: {
      username: true,
      name: true,
    },
  });
};

const logout = async (username) => {
  username = validate(getUserValidation, username);

  const user = await prismaClient.user.findUnique({
    where: {
      username,
    },
  });

  if (!user) {
    throw new ResponseError(404, 'User is not found!');
  }

return prismaClient.user.update({
    where: {
      username,
    },
    data: {
      token: null,
    },
    select: {
      username: true,
    },
  });
};

export default {
  register,
  login,
  get,
  update,
  logout,
};
