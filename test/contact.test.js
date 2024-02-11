import supertest from 'supertest';
import {
  createTestUser,
  removeTestUser,
  removeAllTestContact,
  createTestContact,
  getTestContact,
  createManyTestContact,
} from './test-util';
import { web } from '../src/application/web.js';
import { logger } from '../src/application/logging.js';

// describe('POST /api/contacts', () => {
//   beforeEach(async () => {
//     await createTestUser();
//   });

//   afterEach(async () => {
//     await removeAllTestContact();
//     await removeTestUser();
//   });
//   it('should can create new contact', async () => {
//     const result = await supertest(web)
//       .post('/api/contacts')
//       .set('Authorization', 'test')
//       .send({
//         first_name: 'erico dwi',
//         last_name: 'rsd',
//         email: 'erico@gmail.com',
//         phone: '08123812',
//       });

//     expect(result.status).toBe(201);
//     expect(result.body.data.id).toBeDefined();
//     expect(result.body.data.first_name).toBe('erico dwi');
//     expect(result.body.data.last_name).toBe('rsd');
//     expect(result.body.data.email).toBe('erico@gmail.com');
//     expect(result.body.data.phone).toBe('08123812');
//   });

//   it('should reject if request is invalid', async () => {
//     const result = await supertest(web)
//       .post('/api/contacts')
//       .set('Authorization', 'test')
//       .send({
//         first_name: '',
//         last_name:
//           'rsdddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddqwdqwdqwdqwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwdqwdqwdwdwidu1idnw1iudnoqndiuqndowqndiu1nwdoqndiu1ndo1wndiuwdnownievfiuwbfneowefinwiuefnwiufbwofnqoifqwpdonqwiodnqownfqwiubfnq;ojwfqoiwnfoqnfqofnweofoiwenfownfoiqnfoqbwfnqwdmpqowndoqwndoqndw',
//         email: 'erico',
//         phone: '0812381212313123213123123123123123123123123123',
//       });

//     expect(result.status).toBe(400);
//     expect(result.body.errors).toBeDefined();
//   });
// });

// describe('GET /api/contacts/:contactId', () => {
//   beforeEach(async () => {
//     await createTestUser();
//     await createTestContact();
//   });

//   afterEach(async () => {
//     await removeAllTestContact();
//     await removeTestUser();
//   });

//   it('should can get contact', async () => {
//     const testContact = await getTestContact();

//     const result = await supertest(web)
//       .get(`/api/contacts/${testContact.id}`)
//       .set('Authorization', 'test');

//     expect(result.status).toBe(200);
//     expect(result.body.data.id).toBe(testContact.id);
//     expect(result.body.data.first_name).toBe(testContact.first_name);
//     expect(result.body.data.last_name).toBe(testContact.last_name);
//     expect(result.body.data.email).toBe(testContact.email);
//     expect(result.body.data.phone).toBe(testContact.phone);
//   });

//   it('should return 404 if wrong contactid', async () => {
//     const testContact = await getTestContact();

//     const result = await supertest(web)
//       .get(`/api/contacts/${testContact.id + 1}`)
//       .set('Authorization', 'test');

//     expect(result.status).toBe(404);
//     expect(result.body.errors).toBeDefined();
//   });
// });

// describe('PUT api/contacts/contactId', () => {
//   beforeEach(async () => {
//     await createTestUser();
//     await createTestContact();
//   });

//   afterEach(async () => {
//     await removeAllTestContact();
//     await removeTestUser();
//   });

//   it('should can update existing contact', async () => {
//     const testContact = await getTestContact();

//     const result = await supertest(web)
//       .put(`/api/contacts/${testContact.id}`)
//       .set('Authorization', 'test')
//       .send({
//         first_name: 'ericow',
//         last_name: 'dwir',
//         email: 'ociredwi@gmail.com',
//         phone: '08123123',
//       });

//     expect(result.status).toBe(200);
//     expect(result.body.data.first_name).toBe('ericow');
//     expect(result.body.data.last_name).toBe('dwir');
//     expect(result.body.data.email).toBe('ociredwi@gmail.com');
//     expect(result.body.data.phone).toBe('08123123');
//   });

//   it('should failed update existing contact', async () => {
//     const testContact = await getTestContact();

//     const result = await supertest(web)
//       .put(`/api/contacts/${testContact.id}`)
//       .set('Authorization', 'test')
//       .send({
//         first_name: '',
//         last_name: 'dwir',
//         email: 'ociredwi@gmail.com',
//         phone: '08123123',
//       });

//     expect(result.status).toBe(400);
//     expect(result.body.errors).toBeDefined();
//   });

//   it('should reject update if contact is not found', async () => {
//     const testContact = await getTestContact();

//     const result = await supertest(web)
//       .put(`/api/contacts/${testContact.id + 1}`)
//       .set('Authorization', 'test')
//       .send({
//         first_name: 'ericow',
//         last_name: 'dwir',
//         email: 'ociredwi@gmail.com',
//         phone: '08123123',
//       });

//     expect(result.status).toBe(404);
//     expect(result.body.errors).toBeDefined();
//   });
// });

describe('DELETE /api/contacts/:contactId', () => {
  beforeEach(async () => {
    await createTestUser();
    await createTestContact();
  });

  afterEach(async () => {
    await removeAllTestContact();
    await removeTestUser();
  });

  it('should delete existing contact', async () => {
    let testContact = await getTestContact();

    const result = await supertest(web)
      .delete(`/api/contacts/${testContact.id}`)
      .set('Authorization', 'test');

    expect(result.status).toBe(200);
    expect(result.body.data).toBeDefined();

    testContact = await getTestContact();
    expect(testContact).toBeNull();
  });

  it('should error delete unexisting contact', async () => {
    const testContact = await getTestContact();

    const result = await supertest(web)
      .delete(`/api/contacts/${testContact.id + 1}`)
      .set('Authorization', 'test');

    expect(result.status).toBe(404);
    expect(result.body.errors).toBeDefined();
  });
});

// describe('GET /api/contacts', () => {
//   beforeEach(async () => {
//     await createTestUser();
//     await createManyTestContact();
//   });
//   afterEach(async () => {
//     await removeAllTestContact();
//     await removeTestUser();
//   });

//   it('should can search to page 2', async () => {
//     const result = await supertest(web)
//       .get('/api/contacts')
//       .query({
//         page: 2,
//       })
//       .set('Authorization', 'test');

//     expect(result.status).toBe(200);
//     expect(result.body.data.length).toBe(5);
//     expect(result.body.paging.page).toBe(2);
//     expect(result.body.paging.total_page).toBe(2);
//     expect(result.body.paging.total_item).toBe(15);
//   });

//   it('should can search name', async () => {
//     const result = await supertest(web)
//       .get('/api/contacts')
//       .query({
//         name: 'erico dwi 1',
//       })
//       .set('Authorization', 'test');

//     logger.info(result);

//     expect(result.status).toBe(200);
//     expect(result.body.data.length).toBe(6);
//     expect(result.body.paging.page).toBe(1);
//     expect(result.body.paging.total_page).toBe(1);
//     expect(result.body.paging.total_item).toBe(6);
//   });

//   it('should can search email', async () => {
//     const result = await supertest(web)
//       .get('/api/contacts')
//       .query({
//         email: 'erico5@gmail.com',
//       })
//       .set('Authorization', 'test');

//     logger.info(result);

//     expect(result.status).toBe(200);
//     expect(result.body.data.length).toBe(1);
//     expect(result.body.paging.page).toBe(1);
//     expect(result.body.paging.total_page).toBe(1);
//     expect(result.body.paging.total_item).toBe(1);
//   });

//   it('should can search phone', async () => {
//     const result = await supertest(web)
//       .get('/api/contacts')
//       .query({
//         phone: '08123981',
//       })
//       .set('Authorization', 'test');

//     logger.info(result);

//     expect(result.status).toBe(200);
//     expect(result.body.data.length).toBe(10);
//     expect(result.body.paging.page).toBe(1);
//     expect(result.body.paging.total_page).toBe(2);
//     expect(result.body.paging.total_item).toBe(15);
//   });
// });
