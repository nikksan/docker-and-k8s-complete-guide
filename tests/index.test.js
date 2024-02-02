const request = require('supertest');
const app = require('../src/index');

jest.mock('redis', () => ({
    createClient: () => ({
        set: () => {},
        get: () => {},
        on: () => {},
        connect: () => {},
    })
}));

afterAll(() => app.close());

describe('HTTP server', () => {
    it('should return 200 on GET /', async () => {
        await request(app)
            .get('/')
            .expect(201);
    });
});
