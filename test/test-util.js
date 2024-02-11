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

const removeAllTestContact = async () => {
  await prismaClient.contact.deleteMany({
    where: {
      username: 'ocire',
    },
  });
};

const createTestContact = async () => {
  await prismaClient.contact.create({
    data: {
      username: 'ocire',
      first_name: 'erico dwi',
      last_name: 'rsd',
      email: 'erico@gmail.com',
      phone: '08123981',
    },
  });
};

const createManyTestContact = async () => {
  for (let i = 0; i < 15; i++) {
    await prismaClient.contact.create({
      data: {
        username: `ocire`,
        first_name: `erico dwi ${i}`,
        last_name: `rsd ${i}`,
        email: `erico${i}@gmail.com`,
        phone: `08123981 ${i}`,
      },
    });
  }
};

const getTestContact = async () => {
  return prismaClient.contact.findFirst({
    where: {
      username: 'ocire',
    },
  });
};

const removeAllTestAddresses = async () => {
  await prismaClient.address.deleteMany({
    where: {
      contact: {
        username: 'ocire',
      },
    },
  });
};

const createTestAddress = async () => {
  const contact = await getTestContact();

  await prismaClient.address.create({
    data: {
      contact_id: contact.id,
      street: 'street1',
      city: 'city1',
      province: 'province1',
      country: 'country1',
      postal_code: '091320',
    },
  });
};

const getTestAddress = async () => {
  return prismaClient.address.findFirst({
    where: {
      contact: {
        username: 'ocire',
      },
    },
  });
};

export {
  removeTestUser,
  createTestUser,
  getTestUser,
  removeAllTestContact,
  createTestContact,
  createManyTestContact,
  getTestContact,
  removeAllTestAddresses,
  createTestAddress,
  getTestAddress,
};
