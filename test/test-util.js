import { prismaClient } from '../src/application/database.js';
import bcrypt from 'bcrypt';

const removeTestUser = async () => {
  await prismaClient.user.deleteMany({
    where: {
      username: 'ocire',
    },
  });
};

const createTestUser = async () => {
  await prismaClient.user.create({
    data: {
      username: 'ocire',
      password: await bcrypt.hash('ocire', 10),
      name: 'ocire test',
      token: 'test',
    },
  });
};

const getTestUser = async () => {
  return prismaClient.user.findUnique({
    where: {
      username: 'ocire',
    },
  });
};

export { removeTestUser, createTestUser, getTestUser };
