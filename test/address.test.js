import supertest from 'supertest';
import {
  createTestAddress,
  createTestContact,
  createTestUser,
  getTestAddress,
  getTestContact,
  removeAllTestAddresses,
  removeAllTestContact,
  removeTestUser,
} from './test-util.js';
import { web } from '../src/application/web.js';
import { logger } from '../src/application/logging.js';

// describe('POST /api/contacts/:contactId/addresses', () => {
//   beforeEach(async () => {
//     await createTestUser();
//     await createTestContact();
//   });

//   afterEach(async () => {
//     await removeAllTestAddresses();
//     await removeAllTestContact();
//     await removeTestUser();
//   });

//   it('should success create address', async () => {
//     const testContact = await getTestContact();

//     const result = await supertest(web)
//       .post(`/api/contacts/${testContact.id}/addresses`)
//       .set('Authorization', 'test')
//       .send({
//         street: 'street1',
//         city: 'city1',
//         province: 'province1',
//         country: 'country1',
//         postal_code: '901320',
//       });

//     expect(result.status).toBe(201);
//     expect(result.body.data.street).toBe('street1');
//     expect(result.body.data.city).toBe('city1');
//     expect(result.body.data.province).toBe('province1');
//     expect(result.body.data.country).toBe('country1');
//     expect(result.body.data.postal_code).toBe('901320');
//   });

//   it('should error contact not found', async () => {
//     const testContact = await getTestContact();

//     const result = await supertest(web)
//       .post(`/api/contacts/${testContact.id + 1}/addresses`)
//       .set('Authorization', 'test')
//       .send({
//         street: 'street1',
//         city: 'city1',
//         province: 'province1',
//         country: 'country1',
//         postal_code: '901320',
//       });

//     expect(result.status).toBe(404);
//     expect(result.body.errors).toBeDefined();
//   });

//   it('should error have to input mandatory data', async () => {
//     const testContact = await getTestContact();

//     const result = await supertest(web)
//       .post(`/api/contacts/${testContact.id}/addresses`)
//       .set('Authorization', 'test')
//       .send({
//         street: '',
//         city: '',
//         province: '',
//         country: '',
//         postal_code: '',
//       });

//     expect(result.status).toBe(400);
//     expect(result.body.errors).toBeDefined();
//   });
// });

// describe('GET /api/contacts/:contactId/addresses/:addressId', () => {
//   beforeEach(async () => {
//     await createTestUser();
//     await createTestContact();
//     await createTestAddress();
//   });

//   afterEach(async () => {
//     await removeAllTestAddresses();
//     await removeAllTestContact();
//     await removeTestUser();
//   });

//   it('Should get correct address', async () => {
//     const contact = await getTestContact();
//     const address = await getTestAddress();

//     const result = await supertest(web)
//       .get(`/api/contacts/${contact.id}/addresses/${address.id}`)
//       .set('Authorization', 'test');

//     expect(result.status).toBe(200);
//     expect(result.body.data.city).toBe('city1');
//     expect(result.body.data.province).toBe('province1');
//     expect(result.body.data.street).toBe('street1');
//     expect(result.body.data.country).toBe('country1');
//     expect(result.body.data.postal_code).toBe('091320');
//   });
// });

// describe('UPDATE /api/contacts/:contactId/addresses/:addressId', () => {
//   beforeEach(async () => {
//     await createTestUser();
//     await createTestContact();
//     await createTestAddress();
//   });

//   afterEach(async () => {
//     await removeAllTestAddresses();
//     await removeAllTestContact();
//     await removeTestUser();
//   });

//   it('Should success update address', async () => {
//     const contact = await getTestContact();
//     const address = await getTestAddress();

//     const result = await supertest(web)
//       .put(`/api/contacts/${contact.id}/addresses/${address.id}`)
//       .set('Authorization', 'test')
//       .send({
//         city: 'city2',
//         province: 'province2',
//         street: 'street2',
//         country: 'country2',
//         postal_code: '123123123',
//       });

//     expect(result.status).toBe(200);
//     expect(result.body.data.city).toBe('city2');
//     expect(result.body.data.province).toBe('province2');
//     expect(result.body.data.street).toBe('street2');
//     expect(result.body.data.country).toBe('country2');
//     expect(result.body.data.postal_code).toBe('123123123');
//   });

//   it('Should failed update because id not found', async () => {
//     const contact = await getTestContact();
//     const address = await getTestAddress();

//     const result = await supertest(web)
//       .put(`/api/contacts/${contact.id}/addresses/${address.id + 1}`)
//       .set('Authorization', 'test')
//       .send({
//         city: 'city2',
//         province: 'province2',
//         street: 'street2',
//         country: 'country2',
//         postal_code: '123123123',
//       });

//     expect(result.status).toBe(404);
//     expect(result.body.errors).toBeDefined();
//   });

//   it('Should failed update because mandatory data not filled', async () => {
//     const contact = await getTestContact();
//     const address = await getTestAddress();

//     const result = await supertest(web)
//       .put(`/api/contacts/${contact.id}/addresses/${address.id}`)
//       .set('Authorization', 'test')
//       .send({
//         city: '',
//         province: '',
//         street: '',
//         country: '',
//         postal_code: '',
//       });

//     expect(result.status).toBe(400);
//     expect(result.body.errors).toBeDefined();
//   });
// });

describe('DELETE /api/contacts/:contactId/addresses/:addressId', () => {
  beforeEach(async () => {
    await createTestUser();
    await createTestContact();
    await createTestAddress();
  });

  afterEach(async () => {
    await removeAllTestAddresses();
    await removeAllTestContact();
    await removeTestUser();
  });

  it('Should remove the correct address', async () => {
    const contact = await getTestContact();
    const address = await getTestAddress();

    const result = await supertest(web)
      .delete(`/api/contacts/${contact.id}/addresses/${address.id}`)
      .set('Authorization', 'test');

    expect(result.status).toBe(200);
    expect(result.body.data).toBe('Ok!');

    expect(await getTestAddress()).toBeNull();
  });

  it('Should failed remove the correct address because wrong id', async () => {
    const contact = await getTestContact();
    const address = await getTestAddress();

    const result = await supertest(web)
      .delete(`/api/contacts/${contact.id}/addresses/${address.id + 1}`)
      .set('Authorization', 'test');

    expect(result.status).toBe(404);
    expect(result.body.errors).toBeDefined();
  });
});
