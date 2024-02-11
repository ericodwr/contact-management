import { prismaClient } from '../application/database.js';
import { ResponseError } from '../error/response-error.js';
import {
  createAddressValidation,
  getAddressValidation,
  updateAddressValidation,
} from '../validations/address-validation.js';
import { getContactValidation } from '../validations/contact-validation.js';
import { validate } from '../validations/validation.js';

const checkContactIsExists = async (user, contactId) => {
  contactId = validate(getContactValidation, contactId);

  const totalContactInDb = await prismaClient.contact.count({
    where: {
      username: user.username,
      id: contactId,
    },
  });

  if (totalContactInDb !== 1) {
    throw new ResponseError(404, 'contact not found!');
  }

  return contactId;
};

const create = async (user, contactId, request) => {
  contactId = await checkContactIsExists(user, contactId);

  const address = validate(createAddressValidation, request);
  address.contact_id = contactId;

  const result = await prismaClient.address.create({
    data: address,
    select: {
      id: true,
      street: true,
      city: true,
      province: true,
      country: true,
      postal_code: true,
    },
  });

  return result;
};

const get = async (user, contactId, addressId) => {
  contactId = await checkContactIsExists(user, contactId);

  addressId = validate(getAddressValidation, addressId);

  const result = await prismaClient.address.findFirst({
    where: {
      contact_id: contactId,
      id: addressId,
    },
    select: {
      street: true,
      city: true,
      province: true,
      country: true,
      postal_code: true,
    },
  });

  if (!result) {
    throw new ResponseError(404, 'address not found!');
  }

  return result;
};

const update = async (user, contactId, addressId, request) => {
  contactId = await checkContactIsExists(user, contactId);

  const updatedAddress = validate(updateAddressValidation, request);

  addressId = validate(getAddressValidation, addressId);

  const totalAddressInDb = await prismaClient.address.count({
    where: {
      contact_id: contactId,
      id: addressId,
    },
  });

  if (totalAddressInDb !== 1) {
    throw new ResponseError(404, 'address not found!');
  }

  const { street, city, province, country, postal_code } = updatedAddress;

  return prismaClient.address.update({
    where: {
      id: addressId,
      contact_id: contactId,
    },
    data: {
      street,
      city,
      country,
      province,
      postal_code,
    },
    select: {
      street: true,
      city: true,
      province: true,
      country: true,
      postal_code: true,
    },
  });
};

const remove = async (user, contactId, addressId) => {
  contactId = await checkContactIsExists(user, contactId);

  addressId = validate(getAddressValidation, addressId);

  const totalAddressInDb = await prismaClient.address.count({
    where: {
      contact_id: contactId,
      id: addressId,
    },
  });

  if (totalAddressInDb !== 1) {
    throw new ResponseError(404, 'address not found!');
  }

  await prismaClient.address.delete({
    where: {
      contact_id: contactId,
      id: addressId,
    },
  });
};

export default {
  create,
  get,
  update,
  remove,
};
