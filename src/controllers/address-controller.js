import { date } from 'joi';
import { logger } from '../application/logging.js';
import addressService from '../services/address-service.js';

const create = async (req, res, next) => {
  try {
    const user = req.user;
    const contactId = req.params.contactId;
    const request = req.body;

    const result = await addressService.create(user, contactId, request);

    res.status(201).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const get = async (req, res, next) => {
  try {
    const user = req.user;
    const contactId = req.params.contactId;
    const addressId = req.params.addressId;

    const result = await addressService.get(user, contactId, addressId);

    res.status(200).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const user = req.user;
    const { contactId, addressId } = req.params;
    const request = req.body;
    request.id = addressId;

    const result = await addressService.update(
      user,
      contactId,
      addressId,
      request,
    );

    res.status(200).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const user = req.user;
    const { contactId, addressId } = req.params;

    await addressService.remove(user, contactId, addressId);

    res.status(200).json({
      data: 'Ok!',
    });
  } catch (error) {
    next(error);
  }
};

export default {
  create,
  get,
  update,
  remove,
};
